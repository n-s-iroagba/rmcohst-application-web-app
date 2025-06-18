import {
  Model,
  DataTypes,
  type Optional,
  type HasManyGetAssociationsMixin,
  type HasManyAddAssociationMixin,
  type HasManyCountAssociationsMixin,
  type Sequelize,
} from "sequelize"
// import sequelize from '../config/database'; // Default import
// import type Department from './Department'; // Assuming Department model exists

interface FacultyAttributes {
  id: number // Changed to string for UUID consistency
  name: string
  code: string
  description?: string
  nameOfDean?:string;
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface FacultyCreationAttributes
  extends Optional<FacultyAttributes, "id" | "description" | "isActive" | "createdAt" | "updatedAt"> {}

export class Faculty // Named export
  extends Model<FacultyAttributes, FacultyCreationAttributes>
  implements FacultyAttributes
{
  public id!: number
  public name!: string
  public code!: string
  public description?: string
  public isActive?: boolean|true
  public nameOfDean?: string | undefined
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getDepartments!: HasManyGetAssociationsMixin<any> // Replace 'any' with Department type
  public addDepartment!: HasManyAddAssociationMixin<any, string> // Department ID type
  public countDepartments!: HasManyCountAssociationsMixin

  public static associate(models: any) {
    Faculty.hasMany(models.Department, { foreignKey: "facultyId", as: "departments" })
  }
}

export const FacultyFactory = (sequelize: Sequelize): typeof Faculty => {
  Faculty.init(
    {
      id: { type: DataTypes.INTEGER, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
      nameOfDean:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      sequelize,
      tableName: "Faculties", // Pluralized table name
      modelName: "Faculty",
      timestamps: true,
      indexes: [
        { fields: ["name"], unique: true },
        { fields: ["code"], unique: true },
      ],
    },
  )
  return Faculty
}
