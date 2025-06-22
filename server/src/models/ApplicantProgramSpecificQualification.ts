import { Optional, Model, DataTypes } from 'sequelize'
import { Application } from './Application'
import sequelize from '../config/database'
import Grade from './Grade'

interface ApplicationProgramSpecificQualificationAttributes {
  id: number
  applicationId: number
  qualificationType: string
  gradeId: number
  certificate: string // Changed to string for base64 encoded file
  createdAt?: Date
  updatedAt?: Date
}

interface ApplicationProgramSpecificQualificationCreationAttributes {
  qualificationType: string
  applicationId: number
}

class ApplicationProgramSpecificQualification
  extends Model<
    ApplicationProgramSpecificQualificationAttributes,
    ApplicationProgramSpecificQualificationCreationAttributes
  >
  implements ApplicationProgramSpecificQualificationAttributes
{
  public id!: number
  public applicationId!: number
  public qualificationType!: string
  public gradeId!: number
  public certificate!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to check if program-specific qualification is complete
  public isComplete(): boolean {
    return !!(this.qualificationType && this.gradeId && this.certificate)
  }
}

ApplicationProgramSpecificQualification.init(
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
        model: Application,
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
    certificate: {
      type: DataTypes.TEXT('long'), // Changed to TEXT for base64 strings
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Grade,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'applicant_program_specific_qualifications',
    modelName: 'ApplicationProgramSpecificQualification',
  }
)

Application.hasMany(ApplicationProgramSpecificQualification, {
  foreignKey: 'applicationId',
  as: 'programSpecificQualifications',
  onDelete: 'CASCADE',
})

ApplicationProgramSpecificQualification.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
})
export default ApplicationProgramSpecificQualification
