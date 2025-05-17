import {
  Model,
  DataTypes,
  ForeignKey,
  Optional,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Application from './Application';

// Interface for full attributes (all columns)
interface StudentAttributes {
  id: number;
  studentId: string;
  userId: ForeignKey<User['id']>;
  applicationId: ForeignKey<Application['id']>;
  department: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt?: Date;
  updatedAt?: Date;
}

// Creation attributes: omit id, createdAt, updatedAt (auto-generated)
interface StudentCreationAttributes
  extends Optional<StudentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Student extends Model<StudentAttributes, StudentCreationAttributes> {
  public id!: number;
  public studentId!: string;
  public userId!: ForeignKey<User['id']>;
  public applicationId!: ForeignKey<Application['id']>;
  public department!: string;
  public status!: 'active' | 'inactive' | 'graduated';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;
  public getApplication!: BelongsToGetAssociationMixin<Application>;
  public setApplication!: BelongsToSetAssociationMixin<Application, number>;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Application,
        key: 'id',
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'graduated'),
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'students',
    modelName: 'Student',
    timestamps: true,
    paranoid: true,  // <--- Enable soft delete
    deletedAt: 'deletedAt', // Optional, default name for soft delete timestamp
  }
);



// Associations
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Student.belongsTo(Application, { foreignKey: 'applicationId', as: 'application' });

export default Student;
