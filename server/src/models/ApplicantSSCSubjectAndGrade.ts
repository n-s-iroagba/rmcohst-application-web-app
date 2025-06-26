import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database'
import ApplicantSSCQualification from './ApplicantSSCQualification'
import SSCSubject from './SSCSubject'
import Grade from './Grade'

interface ApplicantSSCSubjectAndGradeAttributes {
  id: number
  subjectId: number
  gradeId: number
  applicantSSCQualificationId: number
}

interface ApplicantSSCSubjectAndGradeCreationAttributes
  extends Optional<ApplicantSSCSubjectAndGradeAttributes, 'id'> {}

class ApplicantSSCSubjectAndGrade
  extends Model<
    ApplicantSSCSubjectAndGradeAttributes,
    ApplicantSSCSubjectAndGradeCreationAttributes
  >
  implements ApplicantSSCSubjectAndGradeAttributes
{
  public id!: number
  public subjectId!: number
  public gradeId!: number
  public applicantSSCQualificationId!: number

  // Association methods for eager loading
  public getSubject!: () => Promise<SSCSubject>
  public getGrade!: () => Promise<Grade>
  
  // Timestamps - removed from attributes since we're disabling them
}

ApplicantSSCSubjectAndGrade.init(
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
    gradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Grade,
        key: 'id',
      },
    },
    applicantSSCQualificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ApplicantSSCQualification,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'ApplicantSSCSubjectAndGrade',
    tableName: 'applicant_ssc_subject_grades',  // Explicit table name
    timestamps: false,  // Disable automatic timestamps
  }
)

// =====================
// ASSOCIATIONS FOR EAGER LOADING
// =====================

// Association with SSCSubject
ApplicantSSCSubjectAndGrade.belongsTo(SSCSubject, {
  foreignKey: 'subjectId',
  as: 'subject',  // Alias for eager loading
})
SSCSubject.hasMany(ApplicantSSCSubjectAndGrade, {
  foreignKey: 'subjectId',
  as: 'applicantSSCSubjectAndGrades',  // Alias for eager loading
  })

Grade.hasMany(
  ApplicantSSCSubjectAndGrade,
  {
    foreignKey: 'gradeId',
    as: 'applicantSSCSubjectAndGrades',  // Alias for eager loading\
    }
)
// Association with Grade
ApplicantSSCSubjectAndGrade.belongsTo(Grade, {
  foreignKey: 'gradeId',
  as: 'grade',  // Alias for eager loading
})

// Association with Qualification
ApplicantSSCSubjectAndGrade.belongsTo(ApplicantSSCQualification, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'qualification',
})

// Reverse association from Qualification
ApplicantSSCQualification.hasMany(ApplicantSSCSubjectAndGrade, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'subjectGrades',  // Alias for eager loading
})




export default ApplicantSSCSubjectAndGrade
