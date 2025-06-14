// services/MessageService.ts
import { Op, Transaction } from 'sequelize'
import Message from '../models/Message'
import { AppError } from '../utils/error/AppError'
import sequelize from '../config/database'

interface SendMessageData {
  content: string
  attachments?: string[]
  messageType?: 'TEXT' | 'SYSTEM' | 'NOTIFICATION'
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  parentMessageId?: number
  metadata?: object
}

interface MessageFilters {
  messageType?: 'TEXT' | 'SYSTEM' | 'NOTIFICATION'
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  isRead?: boolean
  startDate?: string
  endDate?: string
  senderId?: string
  senderRole?: 'APPLICANT' | 'ADMIN' | 'REVIEWER'
}

interface PaginatedMessages {
  messages: Message[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
  }
  unreadCount: number
}

export class MessageService {
  async getMessages(
    applicationId: string, 
    userId: string, 
    page: number = 1, 
    limit: number = 50,
    filters: MessageFilters = {}
  ): Promise<PaginatedMessages> {
    try {
      // Verify user has access to this application
      await this.verifyApplicationAccess(applicationId, userId)

      const offset = (page - 1) * limit
      const whereClause: any = { applicationId }

      // Apply filters
      if (filters.messageType) {
        whereClause.messageType = filters.messageType
      }
      if (filters.priority) {
        whereClause.priority = filters.priority
      }
      if (filters.isRead !== undefined) {
        whereClause.isRead = filters.isRead
      }
      if (filters.senderId) {
        whereClause.senderId = filters.senderId
      }
      if (filters.senderRole) {
        whereClause.senderRole = filters.senderRole
      }
      if (filters.startDate || filters.endDate) {
        const dateFilter: any = {}
        if (filters.startDate) {
          dateFilter[Op.gte] = new Date(filters.startDate)
        }
        if (filters.endDate) {
          dateFilter[Op.lte] = new Date(filters.endDate)
        }
        whereClause.createdAt = dateFilter
      }

      const { count, rows } = await Message.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Message,
            as: 'parentMessage',
            required: false
          },
          {
            model: Message,
            as: 'replies',
            required: false,
            separate: true,
            order: [['createdAt', 'ASC']]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      // Get unread count for this user
      const unreadCount = await Message.count({
        where: {
          applicationId,
          [Op.or]: [
            { readBy: { [Op.not]: { [Op.contains]: [userId] } } },
            { readBy: null }
          ]
        }
      })

      const totalPages = Math.ceil(count / limit)

      return {
        messages: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
        unreadCount
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to retrieve messages', 500)
    }
  }

  async sendMessage(
    applicationId: string,
    senderId: string,
    content: string,
    attachments?: string[],
    senderRole: 'APPLICANT' | 'ADMIN' | 'REVIEWER' = 'APPLICANT',
    additionalData?: Partial<SendMessageData>
  ): Promise<Message> {
    const transaction: Transaction = await sequelize.transaction()

    try {
      // Verify user has access to this application
      await this.verifyApplicationAccess(applicationId, senderId)

      // Validate content
      if (!content || content.trim().length === 0) {
        throw new AppError('Message content cannot be empty', 400)
      }

      if (content.length > 10000) {
        throw new AppError('Message content too long (max 10000 characters)', 400)
      }

      // Validate attachments
      if (attachments && attachments.length > 10) {
        throw new AppError('Too many attachments (max 10)', 400)
      }

      // Get sender information (you might want to fetch from User model)
      const senderEmail = await this.getSenderEmail(senderId)

      const messageData = {
        applicationId,
        senderId,
        senderEmail,
        senderRole,
        content: content.trim(),
        attachments: attachments || [],
        messageType: additionalData?.messageType || 'TEXT',
        priority: additionalData?.priority || 'NORMAL',
        parentMessageId: additionalData?.parentMessageId,
        metadata: additionalData?.metadata,
      }

      const message = await Message.create(messageData, { transaction })

      // If this is a reply, mark parent message as having replies
      if (additionalData?.parentMessageId) {
        await this.updateParentMessageMetadata(additionalData.parentMessageId, transaction)
      }

      // Send real-time notification (implement based on your notification system)
      await this.sendRealTimeNotification(applicationId, message, senderId)

      await transaction.commit()

      // Return message with associations
      return await Message.findByPk(message.id, {
        include: [
          {
            model: Message,
            as: 'parentMessage',
            required: false
          }
        ]
      }) as Message

    } catch (error) {
      await transaction.rollback()
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to send message', 500)
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findByPk(messageId)

      if (!message) {
        throw new AppError('Message not found', 404)
      }

      // Verify user has access to this application
      await this.verifyApplicationAccess(message.applicationId, userId)

      // Check if already read by this user
      if (message.isReadBy(userId)) {
        return // Already read, no action needed
      }

      // Mark as read
      message.markAsReadBy(userId)
      await message.save()

    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to mark message as read', 500)
    }
  }

  async markAllAsRead(applicationId: string, userId: string): Promise<number> {
    try {
      // Verify user has access to this application
      await this.verifyApplicationAccess(applicationId, userId)

      const unreadMessages = await Message.findAll({
        where: {
          applicationId,
          [Op.or]: [
            { readBy: { [Op.not]: { [Op.contains]: [userId] } } },
            { readBy: null }
          ]
        }
      })

      let markedCount = 0
      
      for (const message of unreadMessages) {
        if (!message.isReadBy(userId)) {
          message.markAsReadBy(userId)
          await message.save()
          markedCount++
        }
      }

      return markedCount

    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to mark all messages as read', 500)
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const transaction: Transaction = await sequelize.transaction()

    try {
      const message = await Message.findByPk(messageId)

      if (!message) {
        throw new AppError('Message not found', 404)
      }

      // Verify user has access to this application
      await this.verifyApplicationAccess(message.applicationId, userId)

      // Only allow sender or admin to delete
      if (message.senderId !== userId) {
        // Check if user is admin (implement based on your user role system)
        const isAdmin = await this.checkAdminPermission(userId)
        if (!isAdmin) {
          throw new AppError('You can only delete your own messages', 403)
        }
      }

      // Soft delete - mark as deleted rather than actually deleting
      await message.update({
        content: '[Message deleted]',
        attachments: [],
        metadata: { 
          ...message.metadata, 
          deleted: true, 
          deletedAt: new Date(), 
          deletedBy: userId 
        }
      }, { transaction })

      await transaction.commit()

    } catch (error) {
      await transaction.rollback()
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to delete message', 500)
    }
  }

  async getMessageThread(messageId: string, userId: string): Promise<Message[]> {
    try {
      const message = await Message.findByPk(messageId)

      if (!message) {
        throw new AppError('Message not found', 404)
      }

      // Verify user has access to this application
      await this.verifyApplicationAccess(message.applicationId, userId)

      // Get the root message of the thread
      let rootMessageId = messageId
      if (message.parentMessageId) {
        const rootMessage = await this.getRootMessage(message.parentMessageId)
        rootMessageId = rootMessage.id.toString()
      }

      // Get all messages in the thread
      const threadMessages = await Message.findAll({
        where: {
          [Op.or]: [
            { id: rootMessageId },
            { parentMessageId: rootMessageId }
          ]
        },
        order: [['createdAt', 'ASC']]
      })

      return threadMessages

    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to retrieve message thread', 500)
    }
  }

  async getUnreadCount(applicationId: string, userId: string): Promise<number> {
    try {
      // Verify user has access to this application
      await this.verifyApplicationAccess(applicationId, userId)

      return await Message.count({
        where: {
          applicationId,
          [Op.or]: [
            { readBy: { [Op.not]: { [Op.contains]: [userId] } } },
            { readBy: null }
          ]
        }
      })

    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to get unread count', 500)
    }
  }

  // Helper methods
  private async verifyApplicationAccess(applicationId: string, userId: string): Promise<void> {
    // TODO: Implement application access verification
    // This should check if the user has access to the application
    // Either as the applicant, or as an admin/reviewer
    
    // For now, we'll assume access is granted
    // In a real implementation, you would:
    // 1. Check if user is the applicant for this application
    // 2. Check if user is an admin or reviewer with access
    // 3. Throw AppError if no access
  }

  private async getSenderEmail(senderId: string): Promise<string | undefined> {
    // TODO: Implement user lookup to get email
    // For now, returning undefined
    return undefined
  }

  private async updateParentMessageMetadata(parentMessageId: number, transaction: Transaction): Promise<void> {
    const parentMessage = await Message.findByPk(parentMessageId, { transaction })
    if (parentMessage) {
      const replyCount = await Message.count({
        where: { parentMessageId },
        transaction
      })
      
      await parentMessage.update({
        metadata: {
          ...parentMessage.metadata,
          replyCount
        }
      }, { transaction })
    }
  }

  private async sendRealTimeNotification(applicationId: string, message: Message, senderId: string): Promise<void> {
    // TODO: Implement real-time notification
    // This could use WebSockets, Socket.IO, or push notifications
    console.log(`New message in application ${applicationId} from ${senderId}`)
  }

  private async getRootMessage(messageId: number): Promise<Message> {
    const message = await Message.findByPk(messageId)
    if (!message) {
      throw new AppError('Message not found', 404)
    }
    
    if (message.parentMessageId) {
      return await this.getRootMessage(message.parentMessageId)
    }
    
    return message
  }

  private async checkAdminPermission(userId: string): Promise<boolean> {
    // TODO: Implement admin permission check
    // For now, returning false
    return false
  }
}
