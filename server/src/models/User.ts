import {
  Model,
  DataTypes,
  type Optional,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
} from "sequelize"
import sequelize from "../config/database"
import bcrypt from "bcryptjs"
import Staff from "./Staff" // Import Staff
import AdmissionOfficer from "./AdmissionOfficer" // Import AdmissionOfficer
import HeadOfAdmissions from "./HeadOfAdmissions" // Import HeadOfAdmissions

// These are all the attributes in the User model
interface UserAttributes {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  role: "ADMIN" | "HEAD_OF_ADMISSIONS" | "APPLICANT" | "SUPER_ADMIN"
  emailVerified: boolean
  verificationToken?: string | null
  verificationTokenExpiry?: Date | null
  resetToken?: string | null
  resetTokenExpiry?: Date | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null // For paranoid soft deletes
}

// These attributes are optional when creating a new User
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "emailVerified"
    | "verificationToken"
    | "verificationTokenExpiry"
    | "resetToken"
    | "resetTokenExpiry"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public firstName!: string
  public lastName!: string
  public role!: "ADMIN" | "HEAD_OF_ADMISSIONS" | "APPLICANT" | "SUPER_ADMIN"
  public emailVerified!: boolean
  public verificationToken!: string | null
  public verificationTokenExpiry!: Date | null
  public resetToken!: string | null
  public resetTokenExpiry!: Date | null
  public deletedAt!: Date | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Associations
  public getStaff!: HasOneGetAssociationMixin<Staff>
  public setStaff!: HasOneSetAssociationMixin<Staff, number>
  public getAdmissionOfficer!: HasOneGetAssociationMixin<AdmissionOfficer>
  public setAdmissionOfficer!: HasOneSetAssociationMixin<AdmissionOfficer, number>
  public getHeadOfAdmissions!: HasOneGetAssociationMixin<HeadOfAdmissions>
  public setHeadOfAdmissions!: HasOneSetAssociationMixin<HeadOfAdmissions, number>

  public readonly staff?: Staff
  public readonly admissionOfficer?: AdmissionOfficer
  public readonly headOfAdmissions?: HeadOfAdmissions
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "HEAD_OF_ADMISSIONS", "APPLICANT", "SUPER_ADMIN"),
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      // For paranoid soft deletes
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    paranoid: true, // Enable soft deletes
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
    },
  },
)

// Define associations
User.hasOne(Staff, { foreignKey: "userId", as: "staff" })
User.hasOne(AdmissionOfficer, { foreignKey: "userId", as: "admissionOfficer" })
User.hasOne(HeadOfAdmissions, { foreignKey: "userId", as: "headOfAdmissions" })

export default User
