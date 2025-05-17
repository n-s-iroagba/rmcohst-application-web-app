import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Staff from './Staff';

// All attributes in AdmissionOfficer model
interface AdmissionOfficerAttributes {
  id: number;
  staffId: number;
  portalUsername: string;

  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes optional when creating (id usually auto-generated)
interface AdmissionOfficerCreationAttributes extends Optional<AdmissionOfficerAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class AdmissionOfficer extends Model<AdmissionOfficerAttributes, AdmissionOfficerCreationAttributes> implements AdmissionOfficerAttributes {
  public id!: number;
  public staffId!: number;
  public portalUsername!: string;
 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AdmissionOfficer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  staffId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Staff,
      key: 'id',
    },
  },
  portalUsername: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'admission_officers',
  modelName: 'AdmissionOfficer',
});

AdmissionOfficer.belongsTo(Staff, { foreignKey: 'staffId' });
Staff.hasOne(AdmissionOfficer, { foreignKey: 'staffId' });

export default AdmissionOfficer;
