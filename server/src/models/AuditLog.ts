// services/AuditService.ts
import { Op, WhereOptions } from 'sequelize'
import { AppError } from '../utils/error/AppError'

// First, let's define the AuditLog model
// models/AuditLog.ts
import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'

export interface AuditLogAttributes {
  id: number
  userId?: string
  userEmail?: string
  action: string
  resource: string
  resourceId?: string
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  ipAddress?: string
  userAgent?: string
  requestData?: object
  responseData?: object
  errorMessage?: string
  duration?: number
  createdAt: Date
  updatedAt: Date
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: number
  public userId?: string
  public userEmail?: string
  public action!: string
  public resource!: string
  public resourceId?: string
  public status!: 'SUCCESS' | 'FAILED' | 'PENDING'
  public ipAddress?: string
  public userAgent?: string
  public requestData?: object
  public responseData?: object
  public errorMessage?: string
  public duration?: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

AuditLog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., CREATE, UPDATE, DELETE, LOGIN, LOGOUT'
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., USER, APPLICATION, PROGRAM'
  },
  resourceId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING'),
    allowNull: false,
    defaultValue: 'SUCCESS'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requestData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  responseData: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in milliseconds'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  sequelize,
  tableName: 'audit_logs',
  modelName: 'AuditLog',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['action']
    },
    {
      fields: ['resource']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
})

// Export the model
export { AuditLog }
