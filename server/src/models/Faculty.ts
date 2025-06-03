
// models/Faculty.ts
import { 
  Model, 
  DataTypes, 
  Optional, 
  HasManyGetAssociationsMixin, 
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  ForeignKey 
} from 'sequelize';
import sequelize from '../config/database';

interface FacultyAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FacultyCreationAttributes extends Optional<FacultyAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Faculty extends Model<FacultyAttributes, FacultyCreationAttributes> implements FacultyAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association methods
  public getDepartments!: HasManyGetAssociationsMixin<any>; // Department type will be available after import
  public addDepartment!: HasManyAddAssociationMixin<any, number>;
  public countDepartments!: HasManyCountAssociationsMixin;
}

Faculty.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'faculties',
  modelName: 'Faculty',
  timestamps: true,
  indexes: [
    {
      fields: ['name'],
      unique: true,
    },
    {
      fields: ['code'],
      unique: true,
    },
    {
      fields: ['isActive'],
    },
  ],
});

export default Faculty