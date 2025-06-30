// models/Grade.ts
import { Optional, Model, DataTypes } from 'sequelize'

import ApplicantSSCQualification from './ApplicantSSCQualification'
import sequelize from '../config/database'

// Grade Model
interface GradeAttributes {
  id: number

  grade: string

  gradePoint: number

  createdAt?: Date
  updatedAt?: Date
}

interface GradeCreationAttributes
  extends Optional<GradeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
  public id!: number

  public grade!: string

  public gradePoint!: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Grade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    grade: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },

    gradePoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 8,
      },
    },

  },
  {
    sequelize,
    tableName: 'grades',
    modelName: 'Grade',
    timestamps: true,
    indexes: [
      {
        fields: ['sscQualificationId'],
      },
      {
        fields: ['subjectName'],
      },
      {
        fields: ['grade'],
      },
      {
        unique: true,
        fields: ['sscQualificationId', 'subjectName', 'examType'],
        name: 'unique_subject_per_qualification_exam',
      },
    ],
  }
)

// Associations
ApplicantSSCQualification.hasMany(Grade, {
  foreignKey: 'sscQualificationId',
  as: 'grades',
  onDelete: 'CASCADE',
})

Grade.belongsTo(ApplicantSSCQualification, {
  foreignKey: 'sscQualificationId',
  as: 'sscQualification',
})

export default Grade
