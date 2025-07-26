// models/RolePermission.ts - Explicit junction model
import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

class RolePermission extends Model {
  public roleId!: number
  public permissionId!: number
}

RolePermission.init({}, { sequelize, modelName: 'role_permission', timestamps: false })

export default RolePermission
