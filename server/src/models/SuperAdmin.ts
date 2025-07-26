import { Model, DataTypes, Optional, ForeignKey } from 'sequelize'
import sequelize from '../config/database'
import User from './User'

// Full attributes for SuperAdmin
interface SuperAdminAttributes {
  id: number
  firstName: string
  lastName: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

// Creation attributes (omit id, createdAt, updatedAt)
interface SuperAdminCreationAttributes
  extends Optional<SuperAdminAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SuperAdmin extends Model<SuperAdminAttributes, SuperAdminCreationAttributes> {
  public id!: number
  public firstName!: string
  public lastName!: string
  public userId!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date


}

SuperAdmin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ' User',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'super_admins',
    modelName: 'SuperAdmin',
    timestamps: true,
  }
)

// Associations
SuperAdmin.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasOne(SuperAdmin, { foreignKey: 'userId', as: 'superAdmin' })

export default SuperAdmin
