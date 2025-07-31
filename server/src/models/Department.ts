import { Model, DataTypes, type Optional } from 'sequelize'

import { Faculty } from './Faculty'
import sequelize from '../config/database'

interface DepartmentAttributes {
  id: number
  facultyId: number
  name: string
  code: string
  description?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface DepartmentCreationAttributes
  extends Optional<
    DepartmentAttributes,
    'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'
  > {}

export class Department // Named export
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  public id!: number
  public facultyId!: number
  public name!: string
  public code!: string
  public description?: string
  public isActive!: boolean | true
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Department.init(
  {
   id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  allowNull: false,
},
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Faculties', key: 'id' }, // Table name
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    code: { type: DataTypes.STRING(10), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: 'Departments', // Pluralized table name
    modelName: 'Department',
    timestamps: true,
    indexes: [
      { fields: ['facultyId'] },
      { fields: ['name', 'facultyId'], unique: true },
      { fields: ['code', 'facultyId'], unique: true },
    ],
  }
)

Faculty.hasMany(Department, { foreignKey: 'facultyId', as: 'departments' })
Department.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'faculty' })
