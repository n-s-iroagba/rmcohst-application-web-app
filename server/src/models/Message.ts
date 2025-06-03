// models/Message.ts
import { Model, DataTypes, Optional, BelongsToGetAssociationMixin, HasManyGetAssociationsMixin } from 'sequelize'
import sequelize from '../config/database'

interface MessageAttributes {
  id: number
  applicationId: string
  senderId: string
  senderEmail?: string
  senderRole: 'APPLICANT' | 'ADMISSION_OFFR' | 'HOA'
  content: string
  attachments?: string[] // Array of file URLs/paths
  isRead: boolean
  readAt?: Date
  readBy?: string[] // Array of user IDs who have read the message
  messageType: 'TEXT' | 'SYSTEM' | 'NOTIFICATION'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  parentMessageId?: number // For reply threads
  metadata?: object // Additional data like mentions, formatting, etc.
  createdAt: Date
  updatedAt: Date
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isRead' | 'readBy' | 'senderEmail' | 'attachments' | 'readAt' | 'parentMessageId' | 'metadata'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: number
  public applicationId!: string
  public senderId!: string
  public senderEmail?: string
  public senderRole!: 'APPLICANT' | 'ADMISSION_OFFR' | 'HOA'
  public content!: string
  public attachments?: string[]
  public isRead!: boolean
  public readAt?: Date
  public readBy?: string[]
  public messageType!: 'TEXT' | 'SYSTEM' | 'NOTIFICATION'
  public priority!: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  public parentMessageId?: number
  public metadata?: object
  
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Associations
  public getParentMessage!: BelongsToGetAssociationMixin<Message>
  public getReplies!: HasManyGetAssociationsMixin<Message>

  // Instance methods
  public markAsReadBy(userId: string): void {
    if (!this.readBy) {
      this.readBy = []
    }
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId)
      if (!this.isRead) {
        this.isRead = true
        this.readAt = new Date()
      }
    }
  }

  public isReadBy(userId: string): boolean {
    return this.readBy ? this.readBy.includes(userId) : false
  }
}

Message.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Reference to the application this message belongs to'
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'ID of the user who sent the message'
  },
  senderEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  senderRole: {
    type: DataTypes.ENUM('APPLICANT', 'ADMISSION_OFFR', 'HOA'),
    allowNull: false,
    defaultValue: 'APPLICANT'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of file URLs or paths'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  readBy: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of user IDs who have read this message'
  },
  messageType: {
    type: DataTypes.ENUM('TEXT', 'SYSTEM', 'NOTIFICATION'),
    allowNull: false,
    defaultValue: 'TEXT'
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
    allowNull: false,
    defaultValue: 'NORMAL'
  },
  parentMessageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    },
    comment: 'For reply threads - references parent message'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional metadata like mentions, formatting, etc.'
  },
  createdAt: '',
  updatedAt: ''
}, {
  sequelize,
  tableName: 'messages',
  modelName: 'Message',
  indexes: [
    {
      fields: ['applicationId']
    },
    {
      fields: ['senderId']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['messageType']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['parentMessageId']
    }
  ]
})

// Self-referencing association for reply threads
Message.belongsTo(Message, {
  foreignKey: 'parentMessageId',
  as: 'parentMessage'
})

Message.hasMany(Message, {
  foreignKey: 'parentMessageId',
  as: 'replies'
})

export default Message