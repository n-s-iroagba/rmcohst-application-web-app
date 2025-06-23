import { Model, DataTypes, type Sequelize, type Optional, type ForeignKey } from 'sequelize'
import Program from './Program'
import ApplicantSSCQualification from './ApplicantSSCQualification'
import User from './User'
import Biodata from './Biodata'
import ApplicantProgramSpecificRequirement from './ApplicantProgramSpecificRequirement'

// import type { ApplicantDocument } from "./ApplicantDocument" // Already imported if ApplicantDocumentFactory is used

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
  applicantUserId: ForeignKey<User['id']>
  programId?: ForeignKey<Program['id']> | null
  biodataId?: ForeignKey<Biodata['id']> | null
  sessionId: string // Assuming academic session ID is string (e.g. UUID)
  assignedOfficerId?: string | null // Assuming officer ID is string
  status: ApplicationStatus
  admissionLetterUrl?: string | null
  rejectionReason?: string | null
  adminComments?: string | null
  hoaComments?: string | null
  submittedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export interface ApplicationCreationAttributes {
  applicantUserId: string
  sessionId: string
  programId: string
  status: string
}

export class Application // Named export
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: number
  public applicantUserId!: ForeignKey<User['id']>
  public programId?: ForeignKey<Program['id']>
  public sessionId!: string
  public assignedOfficerId?: string | null
  public status!: ApplicationStatus
  public admissionLetterUrl?: string | null
  public rejectionReason?: string | null
  public adminComments?: string | null
  public hoaComments?: string | null
  public submittedAt?: Date | null

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public readonly applicant?: User
  public readonly program?: Program
  public readonly biodata?: Biodata
  // public readonly academicSession?: AcademicSession // Define if needed
  // public readonly assignedOfficer?: AdmissionOfficer // Define if needed
  public readonly sscQualifications?: ApplicantSSCQualification
  public readonly programSpecificQualifications?: ApplicantProgramSpecificRequirement
  public readonly applicantDocuments?: any[] // Use ApplicantDocument type here

  public static associate(models: any) {
    Application.belongsTo(models.User, { foreignKey: 'applicantUserId', as: 'applicant' })
    Application.belongsTo(models.Program, { foreignKey: 'programId', as: 'program' })
    Application.hasOne(models.Biodata, { foreignKey: 'applicationId', as: 'biodata' }) // Assuming Biodata has applicationId
    Application.hasOne(models.ApplicantSSCQualification, {
      foreignKey: 'applicationId',
      as: 'sscQualifications',
    })
    Application.hasOne(models.ApplicantProgramSpecificRequirement, {
      foreignKey: 'applicationId',
      as: 'programSpecificQualifications',
    })
    Application.hasMany(models.ApplicantDocument, {
      foreignKey: 'applicationId',
      as: 'applicantDocuments',
    })
  }
}

export const ApplicationFactory = (sequelize: Sequelize): typeof Application => {
  Application.init(
    {
      id: { type: DataTypes.INTEGER, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      applicantUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
      },
      programId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'Programs', key: 'id' },
      },
      biodataId: {
        type: DataTypes.UUID,
        allowNull: true /*, references: { model: 'Biodata', key: 'id' } */,
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: false /*, references: { model: 'AcademicSessions', key: 'id' } */,
      },
      assignedOfficerId: {
        type: DataTypes.UUID,
        allowNull: true /*, references: { model: 'AdmissionOfficers', key: 'id' } */,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(ApplicationStatus)),
        defaultValue: ApplicationStatus.DRAFT,
        allowNull: false,
      },
      admissionLetterUrl: { type: DataTypes.STRING, allowNull: true },
      rejectionReason: { type: DataTypes.TEXT, allowNull: true },
      adminComments: { type: DataTypes.TEXT, allowNull: true },
      hoaComments: { type: DataTypes.TEXT, allowNull: true },
      submittedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, tableName: 'Applications', modelName: 'Application', timestamps: true }
  )
  return Application
}
