// Program.ts
import {
  Optional,
  Model,
  DataTypes,
} from 'sequelize'

import sequelize from '../config/database'

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
  code: string
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
  public code!: string
  public level!: ProgramLevel
  public durationType!: 'WEEK' | 'MONTH' | 'YEAR'
  public duration!: number
  public applicationFeeInNaira!: number
  public acceptanceFeeInNaira!: number
  public description?: string
  public isActive!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
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
      // Remove references - let associations handle this
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    code: {
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
  },
  {
    sequelize,
    tableName: 'Programs', // Make this consistent - use capitalized
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

// Remove all associations from here - move them to associations.ts
export default Program