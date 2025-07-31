import { Model, DataTypes, type Optional } from 'sequelize'

import { BiodataAttributes } from './Biodata'
import sequelize from '../config/database'

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ADMITTED = 'ADMITTED',
}

export interface ApplicationAttributes {
  id: number
  applicantUserId: number
  programId: number
  sessionId: number
  assignedOfficerId?: number
  status: ApplicationStatus
  adminComments?: string
  hoaComments?: string
  submittedAt?: Date

  createdAt?: Date
  updatedAt?: Date
}

export interface ApplicationCreationAttributes
  extends Optional<
    ApplicationAttributes,
    'id' | 'assignedOfficerId' | 'adminComments' | 'hoaComments' | 'submittedAt'
  > {}

export class Application
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: number
  public applicantUserId!: number
  public programId!: number
  public sessionId!: number
  public assignedOfficerId?: number
  public status!: ApplicationStatus

  public adminComments?: string
  public hoaComments?: string
  public submittedAt?: Date
  public biodata?: BiodataAttributes
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicantUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Remove references - let associations handle this
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Remove references - let associations handle this
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Remove references - let associations handle this
    },
    assignedOfficerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // Remove references - let associations handle this
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
      defaultValue: ApplicationStatus.DRAFT,
      allowNull: false,
    },
    adminComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hoaComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Applications',
    modelName: 'Application',
    timestamps: true,
  }
)