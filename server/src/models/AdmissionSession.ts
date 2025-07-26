// AdmissionSession.ts
import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'

interface AdmissionSessionAttributes {
  id: number
  name: string
  applicationStartDate: Date
  applicationEndDate: Date
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AdmissionSessionCreationAttributes
  extends Optional<AdmissionSessionAttributes, 'id' | 'isCurrent' | 'createdAt' | 'updatedAt'> {}

class AdmissionSession
  extends Model<AdmissionSessionAttributes, AdmissionSessionCreationAttributes>
  implements AdmissionSessionAttributes
{
  public id!: number
  public name!: string
  public applicationStartDate!: Date
  public applicationEndDate!: Date
  public isCurrent!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public programs?: any[]
}

AdmissionSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    applicationStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    applicationEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'academic_sessions',
    modelName: 'AdmissionSession',
    timestamps: true,
  }
)

export default AdmissionSession
