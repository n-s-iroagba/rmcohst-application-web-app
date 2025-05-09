
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user';

class Application extends Model {
  public id!: string;
  public applicantId!: string;
  public program!: string;
  public startDate!: Date;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Submitted', 'UnderReview', 'DecisionPending', 'Accepted', 'Rejected'),
    defaultValue: 'Draft'
  }
}, {
  sequelize,
  tableName: 'applications'
});

Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });

export default Application;
