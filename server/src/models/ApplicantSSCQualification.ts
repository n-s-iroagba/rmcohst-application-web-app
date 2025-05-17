import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/database';
import ApplicantSSCSubject from './ApplicantSSCSubject';
import Application from './Application';

interface ApplicantSSCQualificationAttributes {
  id: number;
  applicationId: number;
  numberOfSittings?: number | null;
  certificateTypes?: string[];
  certificates?: string[]
  minimumGrade?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicantSSCQualificationCreationAttributes  {
  applicationId: ForeignKey<Application['id']>;
}

class ApplicantSSCQualification extends Model<ApplicantSSCQualificationAttributes, ApplicantSSCQualificationCreationAttributes>
  implements ApplicantSSCQualificationAttributes {
  public id!: number;
  public applicationId!: number;
  public numberOfSittings?: number | null;
  public certificateTypes?: string[];
  public certificates?: string[]
  public minimumGrade!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSubjects!: HasManyGetAssociationsMixin<ApplicantSSCSubject>;
  public addSubject!: HasManyAddAssociationMixin<ApplicantSSCSubject, number>;
  public createSubject!: HasManyCreateAssociationMixin<ApplicantSSCSubject>;
}

ApplicantSSCQualification.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Application,
      key: 'id',
    },
  },
  numberOfSittings: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
certificateTypes: {
  type: DataTypes.STRING,
  allowNull: false,
  get() {
    // cast as unknown first, then string
    const rawValue = this.getDataValue('certificateTypes') as unknown as string | null;
    return rawValue ? rawValue.split(',') : [];
  },

  set(value: string[]) {
    this.setDataValue('certificateTypes', value.join(',') as any);
  },

},
certificates: {
  type: DataTypes.STRING,
  allowNull: false,
  get() {
    // cast as unknown first, then string
    const rawValue = this.getDataValue('certificateTypes') as unknown as string | null;
    return rawValue ? rawValue.split(',') : [];
  },

  set(value: string[]) {
    this.setDataValue('certificateTypes', value.join(',') as any);
  },

},



  minimumGrade: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'applicant_ssc_qualifications',
  modelName: 'ApplicantSSCQualification',
});

Application.hasOne(ApplicantSSCQualification, {
  foreignKey: 'applicationId',
  as: 'sscQualification',
  onDelete: 'CASCADE',
});

ApplicantSSCQualification.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});

export default ApplicantSSCQualification;
