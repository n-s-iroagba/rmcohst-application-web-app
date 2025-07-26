import { Model, DataTypes, Optional, Association, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/database'


// Define all attributes
interface ProgramSpecificRequirementAttributes {
  id: number
  programId: number
  qualificationType: string
  minimumGrade: string
  createdAt?: Date
  updatedAt?: Date
}

// Define creation attributes
interface ProgramSpecificRequirementCreationAttributes
  extends Optional<ProgramSpecificRequirementAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSpecificRequirement extends Model<
  ProgramSpecificRequirementAttributes,
  ProgramSpecificRequirementCreationAttributes
> {
  public id!: number
  public programId!: number
  public qualificationType!: string
  public minimumGrade!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

}

ProgramSpecificRequirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Programs',
        key: 'id',
      },
    },
    qualificationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minimumGrade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'program_specific_qualifications',
    modelName: 'ProgramSpecificRequirement',
    timestamps: true,
  }
)


export default ProgramSpecificRequirement
