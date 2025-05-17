import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Faculty from './Faculty';

interface DepartmentAttributes {
  id: number;
  name: string;
  facultyId: number;
}

interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id'> {}

class Department extends Model<DepartmentAttributes, DepartmentCreationAttributes> implements DepartmentAttributes {
  public id!: number;
  public name!: string;
  public facultyId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Department.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Faculty,
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'departments',
  modelName: 'Department',
});

Department.belongsTo(Faculty, {
  foreignKey: 'facultyId',
  as: 'faculty',
});

Faculty.hasMany(Department, {
  foreignKey: 'facultyId',
  as: 'departments', // pluralize for clarity
});

export default Department;
