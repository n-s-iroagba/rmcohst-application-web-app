import {
  Model,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasOneSetAssociationMixin,
  BelongsToGetAssociationMixin,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import BioData from './Biodata';
import ApplicantProgramSpecificQualification from './ApplicantProgramSpecificQualification';

import ApplicantSSCQualification from './ApplicantSSCQualification';
import AdmissionOfficer from './AdmissionOfficer';  // Import AdmissionOfficer model
import AcademicSession from './AcademicSession';
import Payment from './Payment';
import Program from './Program';

// creationType: userId, status:Application_PAID
export type ApplicationStatus=   | 'APPLICATION_PAID'
    | 'BIODATA'
    | 'SSC_QUALIFICATION'
    | 'PROGRAM_SPECIFIC_QUALIFICATION'
    | 'SUBMITTED'
    | 'ADMISSION_OFFICER_REVIEWED'
    | 'ADMITTED'
    | 'REJECTED'
    | 'OFFERED'
    | 'ACCEPTED'
    | 'ACCEPTANCE_PAID';
interface ApplicationAttributes {
  id: number;
  userId: number;
  admissionOfficerId?: ForeignKey<AdmissionOfficer['id']> | null;
   academicSessionId:ForeignKey<AcademicSession['id']>
  status: ApplicationStatus
 
}

interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id' | 'admissionOfficerId'> {}

class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: number;
  public userId!: number;
  public admissionOfficerId?: number | null;
  public status!: ApplicationAttributes['status'];
  public academicSessionId!:ForeignKey<AcademicSession['id']>

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getBioData!: HasOneGetAssociationMixin<BioData>;
  public getApplicantSSCQualification!: HasOneGetAssociationMixin<ApplicantSSCQualification>;
  public getApplicantProgramSpecificQualifications!: HasManyGetAssociationsMixin<ApplicantProgramSpecificQualification>;
  public getPayment!: HasOneGetAssociationMixin<Payment>;
  public setPayment!: HasOneSetAssociationMixin<Payment, number>;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public getAdmissionOfficer!: BelongsToGetAssociationMixin<AdmissionOfficer>;
}

Application.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    admissionOfficerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AdmissionOfficer,
        key: 'id',
      },
    },
        academicSessionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AdmissionOfficer,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM(
        'APPLICATION_PAID',
        'BIODATA',
        'SSC_QUALIFICATION',
        'PROGRAM_SPECIFIC_QUALIFICATION',
        'SUBMITTED',
        'ADMISSION_OFFICER_REVIEWED',
        'ADMITTED',
        'REJECTED',
        'OFFERED',
        'ACCEPTED',
        'ACCEPTANCE_PAID'
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    modelName: 'Application',
  }
);

// Associations

Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });


Application.belongsTo(AcademicSession, { foreignKey: 'academicSessionId', as: 'academicSession' });
AcademicSession.hasMany(Application,{ foreignKey: 'academicSessionId', as: 'applications' })
Application.belongsTo(Program, { foreignKey: 'programId', as: 'program' });
Program.hasMany(Application,{ foreignKey: 'programId', as: 'applications' })

// AdmissionOfficer has many applications as tasks
AdmissionOfficer.hasMany(Application, {
  foreignKey: 'admissionOfficerId',
  as: 'tasks',
  onDelete: 'SET NULL',
});
Application.belongsTo(AdmissionOfficer, {
  foreignKey: 'admissionOfficerId',
  as: 'admissionOfficer',
});

export default Application;
