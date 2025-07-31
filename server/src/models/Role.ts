// models/Role.ts
// models/Role.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import sequelize from '../config/database'

export interface RoleAttributes {
  id: number
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}
class Role
  extends Model<InferAttributes<Role>, InferCreationAttributes<Role>>
  implements RoleAttributes
{
  declare id: CreationOptional<number>
  declare name: string
  declare description: CreationOptional<string | null>

  declare readonly createdAt: CreationOptional<Date>
  declare readonly updatedAt: CreationOptional<Date>
}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'role',
    tableName: 'roles',
    timestamps: true,
    indexes: [{ unique: true, fields: ['name'] }],
  }
)

export default Role
