import { Model, DataTypes, Optional, Association, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/database'
import Program from './Program'
import Grade from './Grade'

// Define all attributes
interface ProgramSpecificRequirementAttributes {
  id: number
  programId: number
  qualificationType: string
  minimumGradeId: number
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

  // Association mixins
  public getProgram!: BelongsToGetAssociationMixin<Program>

  public static associations: {
    program: Association<ProgramSpecificRequirement, Program>
  }
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
        model: Program,
        key: 'id',
      },
    },
    qualificationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minimumGradeId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Grade,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'program_specific_qualifications',
    modelName: 'ProgramSpecificRequirement',
    timestamps: true,
  }
)

// Associations
Program.hasMany(ProgramSpecificRequirement, {
  sourceKey: 'id',
  foreignKey: 'programId',
  as: 'programSpecificQualifications',
})

ProgramSpecificRequirement.belongsTo(Program, {
  foreignKey: 'programId',
  as: 'program',
})

export default ProgramSpecificRequirement
