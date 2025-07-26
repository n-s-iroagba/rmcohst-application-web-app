// models/Permission.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from '../config/database'

export interface PermissionAttributes {
  id: number
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PermissionCreationAttributes
  extends Omit<PermissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Permission
  extends Model<InferAttributes<Permission>, InferCreationAttributes<Permission>>
  implements PermissionAttributes
{
  // Attributes
  public id!: CreationOptional<number>
  public name!: string
  public description!: CreationOptional<string | null>

  public readonly createdAt!: CreationOptional<Date>
  public readonly updatedAt!: CreationOptional<Date>
}
Permission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: [0, 500],
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: 'CURRENT_TIMESTAMP' as any,
    },
  },
  {
    sequelize,
    modelName: 'permission',
    tableName: 'permissions',
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ['name'],
      },
      
    ],
    hooks: {
      beforeValidate: (permission: Permission) => {
        // Clean and format values
        if (permission.name) permission.name = permission.name.trim().toLowerCase()
        if (permission.description) permission.description = permission.description.trim()
      },
    },
  }
)

export default Permission
