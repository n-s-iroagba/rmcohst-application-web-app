import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'


// ===== FIXED PROGRAM SPECIFIC QUALIFICATION MODEL =====
interface ApplicantProgramSpecificQualificationAttributes {
  id: number
  applicationId: number
  qualificationType?: string | null
  grade?: string | null
  isDocumentUploaded?: boolean | null
  createdAt?: Date
  updatedAt?: Date
}

interface ApplicantProgramSpecificQualificationCreationAttributes {

  applicationId: number
}



interface ApplicantProgramSpecificQualificationCreationAttributes {
  applicationId: number
  qualificationType?: string
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
  public qualificationType?: string | null
  public isDocumentUploaded?: boolean | null
  public grade?: string | null
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
      allowNull: true, // Changed to allow null for draft applications
    },
    isDocumentUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false, // Added default value
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
