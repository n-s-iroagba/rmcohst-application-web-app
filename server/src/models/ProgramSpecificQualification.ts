import { Model, DataTypes, Optional, Association, BelongsToGetAssociationMixin } from 'sequelize'
import sequelize from '../config/database'
import Program from './Program'
import Grade from './Grade'

// Define all attributes
interface ProgramSpecificQualificationAttributes {
  id: number
  programId: number
  qualificationType: string
  minimumGradeId: number
  createdAt?: Date
  updatedAt?: Date
}

// Define creation attributes
interface ProgramSpecificQualificationCreationAttributes
  extends Optional<ProgramSpecificQualificationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSpecificQualification extends Model<
  ProgramSpecificQualificationAttributes,
  ProgramSpecificQualificationCreationAttributes
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
    program: Association<ProgramSpecificQualification, Program>
  }
}

ProgramSpecificQualification.init(
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
    modelName: 'ProgramSpecificQualification',
    timestamps: true,
  }
)

// Associations
Program.hasMany(ProgramSpecificQualification, {
  sourceKey: 'id',
  foreignKey: 'programId',
  as: 'programSpecificQualifications',
})

ProgramSpecificQualification.belongsTo(Program, {
  foreignKey: 'programId',
  as: 'program',
})

export default ProgramSpecificQualification
