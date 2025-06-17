import {
  Model,
  DataTypes,
  type ForeignKey,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type Optional,
  type Sequelize,
} from "sequelize"
// import sequelize from "../config/database" // Default import
import type User from "./User"
export type StaffRole = "ADMIN" | "HEAD_OF_ADMISSIONS" 
interface StaffAttributes {
  id: string // Changed to string for UUID consistency if User.id is UUID
  phoneNumber: string
  role:StaffRole,
  userId: ForeignKey<User["id"]>
  createdAt?: Date
  updatedAt?: Date
}

interface StaffCreationAttributes extends Optional<StaffAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Staff // Named export
  extends Model<StaffAttributes, StaffCreationAttributes>
  implements StaffAttributes
{
  public id!: string
  public phoneNumber!: string
  public userId!: ForeignKey<User["id"]>
  public role!: StaffRole
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public getUser!: BelongsToGetAssociationMixin<User>
  public setUser!: BelongsToSetAssociationMixin<User, string> // User ID type

  public readonly user?: User

  public static associate(models: any) {
    Staff.belongsTo(models.User, { foreignKey: "userId", as: "user" })
  }
}

export const StaffFactory = (sequelize: Sequelize): typeof Staff => {
  Staff.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      userId: {
        type: DataTypes.UUID, // Match User ID type
        allowNull: false,
        unique: true,
        references: { model: "Users", key: "id" }, // Table name
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role: {
        type: DataTypes.ENUM("ADMIN", "HEAD_OF_ADMISSIONS"),
        allowNull: false,
        defaultValue: "ADMIN", // Default to ADMIN role
      }
    },
    { sequelize, tableName: "Staff", modelName: "Staff", timestamps: true },
  )
  return Staff
}
