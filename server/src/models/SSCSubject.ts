import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'

// Define full attributes
interface SSCSubjectAttributes {
  id: number
  name: string
  createdAt?: Date
  updatedAt?: Date
}

// Define creation attributes
interface SSCSubjectCreationAttributes
  extends Optional<SSCSubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SSCSubject extends Model<SSCSubjectAttributes, SSCSubjectCreationAttributes> {
  public id!: number
  public name!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

SSCSubject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ssc_subjects',
    modelName: 'SSCSubject',
    timestamps: true,
  }
)

export default SSCSubject
