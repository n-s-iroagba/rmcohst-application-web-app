// models/Faculty.ts

import { 
  Model, 
  DataTypes, 
  Optional, 
  HasManyGetAssociationsMixin, 
  HasManyAddAssociationMixin, 
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin 
} from 'sequelize';
import sequelize from '../config/database';
import Department from './Department';

interface FacultyAttributes {
  id: number;
  name: string;
}

interface FacultyCreationAttributes extends Optional<FacultyAttributes, 'id'> {}

class Faculty extends Model<FacultyAttributes, FacultyCreationAttributes> implements FacultyAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins for Departments (one-to-many)
  public getDepartments!: HasManyGetAssociationsMixin<Department>;
  public addDepartment!: HasManyAddAssociationMixin<Department, number>;
  public hasDepartment!: HasManyHasAssociationMixin<Department, number>;
  public countDepartments!: HasManyCountAssociationsMixin;
  public createDepartment!: HasManyCreateAssociationMixin<Department>;

  // You can add other association mixins as needed
}

Faculty.init({
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
}, {
  sequelize,
  tableName: 'faculties',
  modelName: 'Faculty',
});


export default Faculty;
