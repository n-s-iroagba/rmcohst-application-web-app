
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Application from './application';

class Document extends Model {
  public id!: string;
  public applicationId!: string;
  public type!: string;
  public url!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Application,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'documents'
});

Document.belongsTo(Application, { foreignKey: 'applicationId' });
Application.hasMany(Document, { foreignKey: 'applicationId' });

export default Document;
