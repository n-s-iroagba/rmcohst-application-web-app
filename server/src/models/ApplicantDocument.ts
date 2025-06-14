import { Model, DataTypes, type Sequelize, type Optional, type ForeignKey } from "sequelize"
// import sequelize from "../config/database" // Default import
import { DOCUMENT_TYPES } from "../config/documentTypes" // Named import
import type { Application } from "./Application"

export interface ApplicantDocumentAttributes {
  id: string
  applicationId: ForeignKey<Application["id"]>
  documentType: string // Use string type, validated against DOCUMENT_TYPES
  fileName: string
  fileUrl: string
  googleDriveFileId?: string | null
  fileSize?: number | null
  mimeType?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface ApplicantDocumentCreationAttributes
  extends Optional<
    ApplicantDocumentAttributes,
    "id" | "googleDriveFileId" | "fileSize" | "mimeType" | "createdAt" | "updatedAt"
  > {}

export class ApplicantDocument // Named export
  extends Model<ApplicantDocumentAttributes, ApplicantDocumentCreationAttributes>
  implements ApplicantDocumentAttributes
{
  public id!: string
  public applicationId!: ForeignKey<Application["id"]>
  public documentType!: string
  public fileName!: string
  public fileUrl!: string
  public googleDriveFileId?: string | null
  public fileSize?: number | null
  public mimeType?: string | null

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public readonly application?: Application

  public static associate(models: any) {
    ApplicantDocument.belongsTo(models.Application, {
      foreignKey: "applicationId",
      as: "application",
    })
    models.Application.hasMany(ApplicantDocument, {
      foreignKey: "applicationId",
      as: "applicantDocuments",
    })
  }
}

export const ApplicantDocumentFactory = (sequelize: Sequelize): typeof ApplicantDocument => {
  ApplicantDocument.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      applicationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Applications", key: "id" },
      },
      documentType: { type: DataTypes.ENUM(...DOCUMENT_TYPES), allowNull: false },
      fileName: { type: DataTypes.STRING, allowNull: false },
      fileUrl: { type: DataTypes.STRING, allowNull: false },
      googleDriveFileId: { type: DataTypes.STRING, allowNull: true },
      fileSize: { type: DataTypes.INTEGER, allowNull: true },
      mimeType: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, tableName: "ApplicantDocuments", modelName: "ApplicantDocument", timestamps: true },
  )
  return ApplicantDocument
}
