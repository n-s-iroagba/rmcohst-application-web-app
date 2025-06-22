import {
  Model,
  DataTypes,
  type Optional,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type HasManyGetAssociationsMixin,
  type HasManyAddAssociationMixin,
  type HasManyCountAssociationsMixin,
  type ForeignKey,
  type Sequelize,
} from 'sequelize'
// import sequelize from '../config/database'; // Default import
import type { Faculty } from './Faculty' // Assuming Faculty model exists
// import type Program from './Program'; // Assuming Program model exists

interface DepartmentAttributes {
  id: string // Changed to string for UUID consistency
  facultyId: ForeignKey<Faculty['id']>
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
  public id!: string
  public facultyId!: ForeignKey<Faculty['id']>
  public name!: string
  public code!: string
  public description?: string
  public isActive!: boolean | true
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getFaculty!: BelongsToGetAssociationMixin<Faculty>
  public setFaculty!: BelongsToSetAssociationMixin<Faculty, string> // Faculty ID type

  public getPrograms!: HasManyGetAssociationsMixin<any> // Replace 'any' with Program type
  public addProgram!: HasManyAddAssociationMixin<any, string> // Program ID type
  public countPrograms!: HasManyCountAssociationsMixin

  public static associate(models: any) {
    Department.belongsTo(models.Faculty, { foreignKey: 'facultyId', as: 'faculty' })
    Department.hasMany(models.Program, { foreignKey: 'departmentId', as: 'programs' }) // Assuming Program has departmentId
  }
}

export const DepartmentFactory = (sequelize: Sequelize): typeof Department => {
  Department.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      facultyId: {
        type: DataTypes.UUID, // Match Faculty ID type
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
  return Department
}
