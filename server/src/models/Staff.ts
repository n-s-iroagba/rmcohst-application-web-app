import {
  Model,
  DataTypes,
  type Optional,

} from 'sequelize'

import sequelize from '../config/database'
export type StaffRole = 'ADMIN' | 'HEAD_OF_ADMISSIONS'

interface StaffAttributes {
  id: number // Changed to string for UUID consistency if User.id is UUID
  phoneNumber: string
  firstname: string
  lastname: string
  middlename?: string
  userId:number
  createdAt?: Date
  updatedAt?: Date
}

interface StaffCreationAttributes
  extends Optional<StaffAttributes, 'id' | 'createdAt' | 'updatedAt' | 'middlename'> {}

export class Staff // Named export
  extends Model<StaffAttributes, StaffCreationAttributes>
  implements StaffAttributes
{
  public firstname!: string
  public lastname!: string
  public middlename?: string | undefined
  public userId!: number
  public id!: number
  public phoneNumber!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

 
  
}

  Staff.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      userId: {
        type: DataTypes.UUID, // Match User ID type
        allowNull: false,
        unique: true,
        references: { model: 'Users', key: 'id' }, // Table name
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      firstname: {
        type: DataTypes.STRING,
      },
      lastname: {
        type: DataTypes.STRING,
      },
      middlename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize, tableName: 'Staff', modelName: 'Staff', timestamps: true }
  )


