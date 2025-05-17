import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import Application from './Application';

interface ApplicationProgramSpecificQualificationAttributes {
  id: number;
  
applicationId: ForeignKey<Application['id']>;
  qualificationType?: string;
  grade?: string;
  certificate?:string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApplicationProgramSpecificQualificationCreationAttributes{

    applicationId: ForeignKey<Application['id']>;
  
  
}

class ApplicationProgramSpecificQualification extends Model<ApplicationProgramSpecificQualificationAttributes, ApplicationProgramSpecificQualificationCreationAttributes>
  implements ApplicationProgramSpecificQualificationAttributes {
  public id!: number;
  public applicationId!: ForeignKey<Application['id']>;
  public qualificationType?: string;
  public grade?: string;
  public certificate?: string 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApplicationProgramSpecificQualification.init({
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
  qualificationType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
    certificate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  grade: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'applicant_program_specific_qualifications',
  modelName: 'ApplicationProgramSpecificQualification',
});

Application.hasMany(ApplicationProgramSpecificQualification, {
  foreignKey: 'applicationId',
  as: 'specificQualifications',
  onDelete: 'CASCADE',
});

ApplicationProgramSpecificQualification.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});

export default ApplicationProgramSpecificQualification;
