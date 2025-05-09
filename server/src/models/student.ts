
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user';
import Application from './application';

class Student extends Model {
  public id!: string;
  public studentId!: string;
  public userId!: string;
  public applicationId!: string;
  public department!: string;
  public status!: 'active' | 'inactive' | 'graduated';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Application,
      key: 'id'
    }
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'graduated'),
    defaultValue: 'active'
  }
}, {
  sequelize,
  tableName: 'students'
});

Student.belongsTo(User, { foreignKey: 'userId' });
Student.belongsTo(Application, { foreignKey: 'applicationId' });

export default Student;
