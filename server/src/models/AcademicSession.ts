// AcademicSession.ts
import {
  Model,
  DataTypes,
  Optional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
} from 'sequelize'
import sequelize from '../config/database'

interface AcademicSessionAttributes {
  id: number
  sessionName: string
  reportingDate: Date
  isCurrent: boolean
  createdAt: Date
  updatedAt: Date
}

interface AcademicSessionCreationAttributes
  extends Optional<AcademicSessionAttributes, 'id' | 'isCurrent' | 'createdAt' | 'updatedAt'> {}

class AcademicSession
  extends Model<AcademicSessionAttributes, AcademicSessionCreationAttributes>
  implements AcademicSessionAttributes
{
  public id!: number
  public sessionName!: string
  public reportingDate!: Date
  public isCurrent!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Association methods
  public getPrograms!: BelongsToManyGetAssociationsMixin<any>

  public setPrograms!: BelongsToManyAddAssociationMixin<any, number>
  public addPrograms!: BelongsToManyAddAssociationsMixin<any, number>
  public removeProgram!: BelongsToManyRemoveAssociationMixin<any, number>
  public removePrograms!: BelongsToManyRemoveAssociationsMixin<any, number>
  public programs?: any[]
}

AcademicSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reportingDate: {
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
    modelName: 'AcademicSession',
    timestamps: true,
  }
)

export default AcademicSession
