import {
  Model,
  DataTypes,
  type Optional,
} from 'sequelize'
import Program from './Program'
import User from './User'
import AcademicSession from './AcademicSession'
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
  applicantUserId:number
  programId:number
  sessionId:number
  assignedOfficerId?: number
  status: ApplicationStatus  
  adminComments?: string 
  hoaComments?: string 
  submittedAt?: Date 
  createdAt?: Date
  updatedAt?: Date
}

export interface ApplicationCreationAttributes
  extends Optional<ApplicationAttributes, 'id'|'assignedOfficerId' |  'adminComments' | 'hoaComments' | 'submittedAt'> {}

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number
  public applicantUserId!:number
  public programId!:number
  public sessionId!:number
  public assignedOfficerId?: number
  public status!: ApplicationStatus
  public adminComments?: string 
  public hoaComments?: string 
  public submittedAt?: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

}




  Application.init(
    {
      id: {
        type: DataTypes.INTEGER,
        
        primaryKey: true,
      },
      applicantUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      programId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Programs', key: 'id' },
      },
   
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'AcademicSessions', key: 'id' },
      },
      assignedOfficerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

  Application.belongsTo(User, { as: 'applicant' })
    Application.belongsTo(Program, { as: 'program' })
    Application.belongsTo(AcademicSession, { as: 'academicSession' })

    
   
 


