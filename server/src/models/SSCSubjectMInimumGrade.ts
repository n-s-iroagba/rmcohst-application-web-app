// models/SSCSubjectMinimumGrade.ts
import { LargeNumberLike } from 'crypto'
import { Optional, Model, DataTypes } from 'sequelize'
import SSCSubject from './SSCSubject'
import Grade from './Grade'
import sequelize from '../config/database'

// SSCSubjectM inimumGrade Model
interface SSCSubjectMinimumGradeAttributes {
  id: number
  subjectId: number
  gradeId: number
  alternativeSubjectId?: number
  createdAt?: Date
  updatedAt?: Date
}

interface SSCSubjectMinimumGradeCreationAttributes
  extends Optional<SSCSubjectMinimumGradeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SSCSubjectMinimumGrade
  extends Model<SSCSubjectMinimumGradeAttributes, SSCSubjectMinimumGradeCreationAttributes>
  implements SSCSubjectMinimumGradeAttributes
{
  public id!: number
  public subjectId!: number
  public gradeId!: number
  public alerternativeSubjectId?: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

SSCSubjectMinimumGrade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: SSCSubject,
        key: 'id',
      },
    },
    alternativeSubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: SSCSubject,
        key: 'id',
      },
    },

    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Grade,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'ssc_subject_minimum_grades',
    modelName: 'SSCSubjectMinimumGrade',
    timestamps: true,
    indexes: [
      {
        fields: ['courseId'],
      },
      {
        fields: ['subjectName'],
      },
      {
        fields: ['isRequired'],
      },
      {
        unique: true,
        fields: ['courseId', 'subjectName'],
        name: 'unique_subject_per_course',
      },
    ],
  }
)

export default SSCSubjectMinimumGrade
