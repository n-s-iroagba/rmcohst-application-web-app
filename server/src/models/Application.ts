import { Model, DataTypes, type Sequelize, type Optional, type ForeignKey } from "sequelize"
// import sequelize from "../config/database" // Default import
import type { User } from "./User"
import type { Program } from "./Program"
import type { Biodata } from "./Biodata"
import type { ApplicantSSCQualification } from "./ApplicantSSCQualification"
import type { ApplicantProgramSpecificQualification } from "./ApplicantProgramSpecificQualification"
// import type { ApplicantDocument } from "./ApplicantDocument" // Already imported if ApplicantDocumentFactory is used

export enum ApplicationStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ADMITTED = "ADMITTED",
}

export interface ApplicationAttributes {
  id: string
  applicantUserId: ForeignKey<User["id"]>
  programId?: ForeignKey<Program["id"]> | null
  biodataId?: ForeignKey<Biodata["id"]> | null
  academicSessionId: string // Assuming academic session ID is string (e.g. UUID)
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

export interface ApplicationCreationAttributes
  extends Optional<
    ApplicationAttributes,
    | "id"
    | "programId"
    | "biodataId"
    | "assignedOfficerId"
    | "admissionLetterUrl"
    | "rejectionReason"
    | "adminComments"
    | "hoaComments"
    | "submittedAt"
    | "createdAt"
    | "updatedAt"
  > {}

export class Application // Named export
  extends Model<ApplicationAttributes, ApplicationCreationAttributes>
  implements ApplicationAttributes
{
  public id!: string
  public applicantUserId!: ForeignKey<User["id"]>
  public programId?: ForeignKey<Program["id"]> | null
  public biodataId?: ForeignKey<Biodata["id"]> | null
  public academicSessionId!: string
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
  public readonly sscQualifications?: ApplicantSSCQualification[]
  public readonly programSpecificQualifications?: ApplicantProgramSpecificQualification[]
  public readonly applicantDocuments?: any[] // Use ApplicantDocument type here

  public static associate(models: any) {
    Application.belongsTo(models.User, { foreignKey: "applicantUserId", as: "applicant" })
    Application.belongsTo(models.Program, { foreignKey: "programId", as: "program" })
    Application.hasOne(models.Biodata, { foreignKey: "applicationId", as: "biodata" }) // Assuming Biodata has applicationId
    Application.hasMany(models.ApplicantSSCQualification, { foreignKey: "applicationId", as: "sscQualifications" })
    Application.hasMany(models.ApplicantProgramSpecificQualification, {
      foreignKey: "applicationId",
      as: "programSpecificQualifications",
    })
    Application.hasMany(models.ApplicantDocument, { foreignKey: "applicationId", as: "applicantDocuments" })
  }
}

export const ApplicationFactory = (sequelize: Sequelize): typeof Application => {
  Application.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      applicantUserId: { type: DataTypes.UUID, allowNull: false, references: { model: "Users", key: "id" } },
      programId: { type: DataTypes.UUID, allowNull: true, references: { model: "Programs", key: "id" } },
      biodataId: { type: DataTypes.UUID, allowNull: true /*, references: { model: 'Biodata', key: 'id' } */ },
      academicSessionId: {
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
    { sequelize, tableName: "Applications", modelName: "Application", timestamps: true },
  )
  return Application
}
