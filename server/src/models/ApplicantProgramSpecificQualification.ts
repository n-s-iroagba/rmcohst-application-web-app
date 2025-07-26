import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

interface ApplicantProgramSpecificQualificationAttributes {
  id: number
  applicationId: number
  qualificationType?: string
  grade: string
  isDocumentUploaded: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface ApplicantProgramSpecificQualificationCreationAttributes {
  qualificationType: string
  applicationId: number
}

class ApplicantProgramSpecificQualification
  extends Model<
    ApplicantProgramSpecificQualificationAttributes,
    ApplicantProgramSpecificQualificationCreationAttributes
  >
  implements ApplicantProgramSpecificQualificationAttributes
{
  public id!: number
  public applicationId!: number
  public qualificationType!: string
  public isDocumentUploaded!: boolean
  public grade!: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to check if program-specific qualification is complete
  public isComplete(): boolean {
    return !!(this.qualificationType && this.grade && this.isDocumentUploaded)
  }
}

ApplicantProgramSpecificQualification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Applications',
        key: 'id',
      },
    },
    qualificationType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    isDocumentUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'applicant_program_specific_qualifications',
    modelName: 'ApplicantProgramSpecificQualification',
  }
)

export default ApplicantProgramSpecificQualification
