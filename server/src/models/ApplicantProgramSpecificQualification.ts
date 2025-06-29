import { Model, DataTypes } from 'sequelize'
import { Application } from './Application'
import sequelize from '../config/database'


interface ApplicationProgramSpecificQualificationAttributes {
  id: number
  applicationId: number
  qualificationType?: string
  grade: string  
  isDocumentUploaded:boolean
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
  public isDocumentUploaded!:boolean
  public grade!:string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to check if program-specific qualification is complete
  public isComplete(): boolean {
    return !!(this.qualificationType && this.grade && this.isDocumentUploaded)
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
    isDocumentUploaded: {
      type: DataTypes.BOOLEAN, 
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    grade:{     
      type:DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'grade',
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
