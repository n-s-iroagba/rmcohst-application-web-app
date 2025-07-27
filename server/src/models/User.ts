import { Model, DataTypes, type Optional } from 'sequelize'
import bcrypt from 'bcryptjs'
import { Staff } from './Staff'
import { RoleWithPermissions, UserWithRole } from '../services/RbacService'
import sequelize from '../config/database'


export interface AuthUser{
 id: number
 username:string
role:RoleWithPermissions
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
          type: DataTypes.STRING,
          allowNull: true,
        },
        verificationCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        passwordResetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false
        },
        roleId: {
          type:DataTypes.STRING,
          allowNull:true
        }
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

export default User
