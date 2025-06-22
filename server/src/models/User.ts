import {
  Model,
  DataTypes,
  type Optional,
  type HasOneGetAssociationMixin,
  type HasOneSetAssociationMixin,
} from 'sequelize'
import sequelize from '../config/database'
import bcrypt from 'bcryptjs'
import { Staff } from './Staff'
export type UserRole = 'APPLICANT' | 'STAFF' | 'SUPER_ADMIN'

interface UserAttributes {
  id: number
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  verificationToken?: string | null
  verificationTokenExpiry?: Date | null
  passwordResetToken?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isEmailVerified'
    | 'verificationToken'
    | 'verificationTokenExpiry'
    | 'passwordResetToken'
    | 'createdAt'
    | 'updatedAt'
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public email!: string
  public password!: string
  public firstName!: string
  public lastName!: string
  public role!: 'STAFF' | 'APPLICANT' | 'SUPER_ADMIN'
  public isEmailVerified!: boolean
  public verificationToken!: string | null
  public passwordResetToken!: string | null

  // timestamps
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public readonly staff?: Staff
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
      type: DataTypes.ENUM('STAFF', 'APPLICANT', 'SUPER_ADMIN'),
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    paranoid: true, // Enable soft deletes
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
    },
  }
)

// Define associations
User.hasOne(Staff, { foreignKey: 'userId', as: 'staff' })

export default User
