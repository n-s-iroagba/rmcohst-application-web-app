import type { Request, Response } from "express"

import { AppError } from "../utils/error/AppError"
import { MessageService } from "../services/MessagingService"

export class MessageController {
  private messageService: MessageService

  constructor() {
    this.messageService = new MessageService()
  }

  getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const messages = await this.messageService.getMessages(applicationId, userId)

      res.status(200).json({
        success: true,
        data: messages,
        message: "Messages retrieved successfully",
      })
    } catch (error) {
      throw new AppError("Failed to retrieve messages", 500)
    }
  }

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params
      const { content, attachments } = req.body
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const message = await this.messageService.sendMessage(applicationId, userId, content, attachments)

      res.status(201).json({
        success: true,
        data: message,
        message: "Message sent successfully",
      })
    } catch (error) {
      throw new AppError("Failed to send message", 500)
    }
  }

  markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const { messageId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      await this.messageService.markAsRead(messageId, userId)

      res.status(200).json({
        success: true,
        message: "Message marked as read",
      })
    } catch (error) {
      throw new AppError("Failed to mark message as read", 500)
    }
  }
}
