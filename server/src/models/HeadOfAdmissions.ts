import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Staff from './Staff';

interface HeadOfAdmissionsAttributes {
  id: number;
  staffId: number;
  email:string
  portalUsername: string;
  portalPassword: string;
}

interface HeadOfAdmissionsCreationAttributes extends Optional<HeadOfAdmissionsAttributes, 'id'> {}

class HeadOfAdmissions extends Model<HeadOfAdmissionsAttributes, HeadOfAdmissionsCreationAttributes> implements HeadOfAdmissionsAttributes {
  public id!: number;
  public staffId!: number;
  public email!:string
  public portalUsername!: string;
  public portalPassword!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// creationType == all attributes
HeadOfAdmissions.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  
  portalPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type:DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize,
  tableName: 'admission_officers',
  modelName: 'HeadOfAdmissions',
});

HeadOfAdmissions.belongsTo(Staff, { foreignKey: 'staffId' });
Staff.hasOne(HeadOfAdmissions, { foreignKey: 'staffId' });

export default HeadOfAdmissions;
