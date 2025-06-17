import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import ApplicantSSCQualification from './ApplicantSSCQualification';
import SSCSubject from './SSCSubject';
import Grade from './Grade';


interface ApplicantSSCSubjectAndGradeAttributes {
  id: number;
  subjectId: number;
  gradeId: number;
  applicantSSCQualificationId: number;
}

interface ApplicantSSCSubjectAndGradeCreationAttributes extends Optional<ApplicantSSCSubjectAndGradeAttributes, 'id'> {}

class ApplicantSSCSubjectAndGrade extends Model<ApplicantSSCSubjectAndGradeAttributes, ApplicantSSCSubjectAndGradeCreationAttributes> implements ApplicantSSCSubjectAndGradeAttributes {
  public id!: number;
  public subjectId!: number;
  public gradeId!: number;
  public applicantSSCQualificationId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApplicantSSCSubjectAndGrade.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model:SSCSubject,
      key:'id'
    }
  },
  gradeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references:{
      model:Grade,
      key:'id'
    }
  },
  applicantSSCQualificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  // model: 'ApplicantSSCSubjectAndGrade',
});

ApplicantSSCQualification.hasMany(ApplicantSSCSubjectAndGrade, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'subjects',
  onDelete: 'CASCADE',
});

ApplicantSSCSubjectAndGrade.belongsTo(ApplicantSSCQualification, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'qualification',
});

export default ApplicantSSCSubjectAndGrade;
