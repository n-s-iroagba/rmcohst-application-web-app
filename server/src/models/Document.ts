import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'
import ApplicationProgramSpecificQualification from './ApplicantProgramSpecificQualification'
import ApplicantSSCQualification from './ApplicantSSCQualification'
import Biodata from './Biodata'

// Interface for document attributes
interface DocumentAttributes {
  id: number
  fileName: string
  mimeType: string
  buffer: Buffer
  documentableId: number // Polymorphic foreign key ID
  documentableType:
    | 'ApplicantSSCQualification'
    | 'ApplicationProgramSpecificQualification'
    | 'Biodata' // Polymorphic type (model name)
  createdAt: Date
  updatedAt: Date
}

// Interface for creation attributes
interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Document
  extends Model<DocumentAttributes, DocumentCreationAttributes>
  implements DocumentAttributes
{
  public id!: number
  public fileName!: string
  public mimeType!: string
  public buffer!: Buffer
  public documentableId!: number
  public documentableType!:
    | 'ApplicantSSCQualification'
    | 'ApplicationProgramSpecificQualification'
    | 'Biodata'
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    mimeType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^[a-z]+\/[a-z0-9\-+.]+$/i,
      },
    },
    buffer: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    documentableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    documentableType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [['ApplicantSSCQualification', 'ApplicationProgramSpecificQualification', 'Biodata']],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'documents',
    modelName: 'Document',
    timestamps: true,
    indexes: [
      { fields: ['fileName'] },
      { fields: ['mimeType'] },
      { fields: ['documentableType'] },
      { fields: ['documentableId'] },
    ],
  }
)
ApplicantSSCQualification.hasMany(Document, {
  foreignKey: 'documentableId',
  constraints: false,
  scope: {
    documentableType: 'ApplicantSSCQualification',
  },
  as: 'documents',
})
ApplicationProgramSpecificQualification.hasMany(Document, {
  foreignKey: 'documentableId',
  constraints: false,
  scope: {
    documentableType: 'ApplicationProgramSpecificQualification',
  },
  as: 'documents',
})
Biodata.hasMany(Document, {
  foreignKey: 'documentableId',
  constraints: false,
  scope: {
    documentableType: 'Biodata',
  },
  as: 'documents',
})
export default Document
