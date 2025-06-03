import { Model, DataTypes, Optional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import Application from './Application';

interface BiodataAttributes {
  id: number;
  applicationId: ForeignKey<Application['id']>; // FK to Application
  firstName?: string;
  middleName?: string | null;
  surname?: string;
  gender?: string;
  dateOfBirth?: Date;
  maritalStatus?: string;
  homeAddress?: string;
  nationality?: string;
  stateOfOrigin?: string;
  lga?: string;
  homeTown?: string;
  phoneNumber?: string;
  emailAddress?: string;
  passportPhotograph?: string;
  nextOfKinFullName?: string;
  nextOfKinPhoneNumber?: string;
  nextOfKinAddress?: string;
  relationshipWithNextOfKin?: string;
}

interface BiodataCreationAttributes {
  applicationId: ForeignKey<Application['id']>; 
}

class Biodata extends Model<BiodataAttributes,BiodataCreationAttributes> implements BiodataAttributes {
  public id!: number;
public  applicationId!: ForeignKey<Application['id']>; 
  public firstName?: string;
  public middleName?: string | null;
  public surname?: string;
  public gender?: string;
  public dateOfBirth?: Date;
  public maritalStatus?: string;
  public homeAddress?: string;
  public nationality?: string;
  public stateOfOrigin?: string;
  public lga?: string;
  public homeTown!: string;
  public phoneNumber?: string;
  public emailAddress?: string;
  public passportPhotograph?: string;
  public nextOfKinFullName?: string;
  public nextOfKinPhoneNumber?: string;
  public nextOfKinAddress?: string;
  public relationshipWithNextOfKin?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Biodata.init({
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
    unique: true, // because hasOne association
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  maritalStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stateOfOrigin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lga: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeTown: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportPhotograph: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextOfKinFullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextOfKinPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nextOfKinAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  relationshipWithNextOfKin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'biodata',
  modelName: 'Biodata',
});

Application.hasOne(Biodata, {
  foreignKey: 'applicationId',
  as: 'bioData',
});

Biodata.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application',
});

export default Biodata;
