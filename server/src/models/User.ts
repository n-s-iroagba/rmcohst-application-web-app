import { Model, DataTypes, type Optional } from 'sequelize'
import bcrypt from 'bcryptjs'
import { Staff } from './Staff'
import { RoleWithPermissions, UserWithRole } from '../services/RbacService'
import sequelize from '../config/database'


export interface AuthUser{
 id: number
 username:string
role:string
email:string
}


interface UserAttributes {
  id: number
  username:string
  email: string
  password: string
  roleId:number
  isEmailVerified: boolean
  verificationCode?: string | null
  verificationToken?: string | null
  passwordResetToken?: string | null
  refreshToken?: string|null
  createdAt?: Date
  updatedAt?: Date
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | 'id'
    | 'isEmailVerified'
    |'verificationCode'
    | 'verificationToken'
    | 'passwordResetToken'
    | 'roleId'
    | 'createdAt'
    |'refreshToken'
    | 'updatedAt'
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public username!: string
  public email!: string
  public password!: string
  public roleId!: number
  public isEmailVerified!: boolean
  public verificationToken!: string | null
  public refreshToken?: string | null 
  public verificationCode!: string | null
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
        isEmailVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        verificationToken: {
          type: DataTypes.STRING(400),
          allowNull: true,
        },
        verificationCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        passwordResetToken: {
          type: DataTypes.STRING(400),
          allowNull: true,
        },
        refreshToken: {
          type: DataTypes.STRING(400),
          allowNull:true
        },

        username: {
          type: DataTypes.STRING,
          allowNull: false
        },
        roleId: {
          type:DataTypes.INTEGER,
          allowNull:true,
          references: {
            model: 'roles',
            key: 'id'
          }
        }
      },
      {
        sequelize,
        tableName: 'users',
        paranoid: true, // Enable soft deletes
      }
    )

export default User
