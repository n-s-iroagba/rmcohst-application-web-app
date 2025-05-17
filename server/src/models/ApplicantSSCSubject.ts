import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import ApplicantSSCQualification from './ApplicantSSCQualification';


interface ApplicantSSCSubjectAttributes {
  id: number;
  name: string;
  grade: string;
  applicantSSCQualificationId: number;
}

interface ApplicantSSCSubjectCreationAttributes extends Optional<ApplicantSSCSubjectAttributes, 'id'> {}

class ApplicantSSCSubject extends Model<ApplicantSSCSubjectAttributes, ApplicantSSCSubjectCreationAttributes> implements ApplicantSSCSubjectAttributes {
  public id!: number;
  public name!: string;
  public grade!: string;
  public applicantSSCQualificationId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApplicantSSCSubject.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  applicantSSCQualificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'applicant_ssc_subjects',
  modelName: 'ApplicantSSCSubject',
});

ApplicantSSCQualification.hasMany(ApplicantSSCSubject, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'subjects',
  onDelete: 'CASCADE',
});

ApplicantSSCSubject.belongsTo(ApplicantSSCQualification, {
  foreignKey: 'applicantSSCQualificationId',
  as: 'qualification',
});

export default ApplicantSSCSubject;
