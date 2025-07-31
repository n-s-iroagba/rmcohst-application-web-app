// models/UserRole.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from '../config/database'

class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
  declare id: CreationOptional<number>
  declare userId: number
  declare roleId: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Use string reference instead of direct model import
      references: {
        model: 'users', // Table name
        key: 'id',
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Use string reference instead of direct model import
      references: {
        model: 'roles', // Table name
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'user_role',
    tableName: 'user_roles',
    indexes: [
      // Unique constraint to prevent duplicate assignments
      {
        unique: true,
        fields: ['userId', 'roleId'],
      },
      // Index for roleId for faster role-based queries
      {
        fields: ['roleId'],
      },
    ],
  }
)

export default UserRole
