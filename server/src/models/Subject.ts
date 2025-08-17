// models/Subject.ts
import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'

interface SubjectAttributes {
  id: number
  name: string
  code: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

interface SubjectCreationAttributes
  extends Optional<SubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Subject
  extends Model<SubjectAttributes, SubjectCreationAttributes>
  implements SubjectAttributes
{
  public id!: number
  public name!: string
  public code!: string
  public description?: string
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Subjects',
    modelName: 'Subject',
    timestamps: true,
    indexes: [
      { fields: ['name'], unique: true },
      { fields: ['code'], unique: true },
    ],
  }
)

export default Subject
