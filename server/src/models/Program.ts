// Program.ts
import {
  Optional,
  Model,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  DataTypes,
} from 'sequelize'
import ProgramSpecificRequirement from './ProgramSpecificRequirement'
import ProgramSSCRequirement from './ProgramSSCRequirement'
import sequelize from '../config/database'
import AcademicSession from './AcademicSession'
import { Department } from './Department'

export type ProgramLevel = 'OND' | 'HND' | 'Certificate'
type DurationType = 'WEEK' | 'MONTH' | 'YEAR'

interface ProgramAttributes {
  id: number
  departmentId: number
  name: string
  level: ProgramLevel
  durationType: DurationType
  duration: number
  applicationFeeInNaira: number
  acceptanceFeeInNaira: number
  description?: string
  sscRequirementId: number
  programSpecificRequirementsId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface ProgramCreationAttributes
  extends Optional<
    ProgramAttributes,
    'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'
  > {}

class Program
  extends Model<ProgramAttributes, ProgramCreationAttributes>
  implements ProgramAttributes
{
  public id!: number
  public departmentId!: number
  public name!: string
  public level!: ProgramLevel
  public durationType!: 'WEEK' | 'MONTH' | 'YEAR'
  public duration!: number
  public applicationFeeInNaira!: number
  public acceptanceFeeInNaira!: number
  public description?: string
  public isActive!: boolean
  public sscRequirementId!: number
  public programSpecificRequirementsId!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Department associations
  public getDepartment!: BelongsToGetAssociationMixin<Department>
  public setDepartment!: BelongsToSetAssociationMixin<Department, number>

  // Qualification associations
  public getProgramSpecificRequirements!: HasManyGetAssociationsMixin<ProgramSpecificRequirement>
  public addProgramSpecificRequirement!: HasManyAddAssociationMixin<
    ProgramSpecificRequirement,
    number
  >
  public getSSCQualification!: HasOneGetAssociationMixin<ProgramSSCRequirement>
  public setSSCQualification!: HasOneSetAssociationMixin<ProgramSSCRequirement, number>

  // Session associations
  public getSessions!: BelongsToManyGetAssociationsMixin<AcademicSession>
  public addSession!: BelongsToManyAddAssociationMixin<AcademicSession, number>
  public removeSession!: BelongsToManyRemoveAssociationMixin<AcademicSession, number>
  public sessions?: AcademicSession[]
}

Program.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    durationType: {
      type: DataTypes.ENUM('WEEK', 'MONTH', 'YEAR'),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    applicationFeeInNaira: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    acceptanceFeeInNaira: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sscRequirementId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'program_ssc_requirements',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    programSpecificRequirementsId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'program_specific_requirements',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'programs',
    modelName: 'Program',
    timestamps: true,
    indexes: [
      {
        fields: ['departmentId'],
      },
      {
        fields: ['name', 'departmentId'],
        unique: true,
      },
      {
        fields: ['code', 'departmentId'],
        unique: true,
      },
      {
        fields: ['isActive'],
      },
      {
        fields: ['level'],
      },
    ],
  }
)

// Associations
Department.hasMany(Program, { foreignKey: 'departmentId' })
Program.belongsTo(Department, {
  foreignKey: 'departmentId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
})


import ProgramSession from './ProgramSession'

// Many-to-many relationship between Program and AcademicSession
Program.belongsToMany(AcademicSession, {
  through: ProgramSession,
  foreignKey: 'programId',
  otherKey: 'sessionId',
  as: 'sessions',
})

AcademicSession.belongsToMany(Program, {
  through: ProgramSession,
  foreignKey: 'sessionId',
  otherKey: 'programId',
  as: 'programs',
})

// Direct associations with junction table
Program.hasMany(ProgramSession, { foreignKey: 'programId' })
ProgramSession.belongsTo(Program, { foreignKey: 'programId' })

AcademicSession.hasMany(ProgramSession, { foreignKey: 'sessionId' })
ProgramSession.belongsTo(AcademicSession, { foreignKey: 'sessionId' })

export default Program
