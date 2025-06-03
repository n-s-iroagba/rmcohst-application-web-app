import { ForeignKey, NonAttribute, Optional, Model, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, DataTypes } from "sequelize";

import Department from "./Department";
import ProgramSpecificQualification from "./ProgramSpecificQualification";
import ProgramSSCQualification from "./ProgramSSCQualification";
import sequelize from "../config/database";

interface ProgramAttributes {
  id: number;
  departmentId: ForeignKey<Department['id']>; // Changed from department string to departmentId
  name: string; // Added program name
  code: string; // Added program code
  certificationType: string;
  durationType: 'WEEK' | 'MONTH' | 'YEAR';
  duration: number;
  prequalifications?: NonAttribute<ProgramSpecificQualification[]>;
  applicationFeeInNaira: number;
  acceptanceFeeInNaira: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id' | 'description' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Program extends Model<ProgramAttributes, ProgramCreationAttributes> implements ProgramAttributes {
  public id!: number;
  public departmentId!: ForeignKey<Department['id']>;
  public name!: string;
  public code!: string;
  public certificationType!: string;
  public durationType!: 'WEEK' | 'MONTH' | 'YEAR';
  public duration!: number;
  public applicationFeeInNaira!: number;
  public acceptanceFeeInNaira!: number;
  public description?: string;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getDepartment!: BelongsToGetAssociationMixin<Department>;
  public setDepartment!: BelongsToSetAssociationMixin<Department, number>;
  
  public getProgramSpecificQualifications!: HasManyGetAssociationsMixin<ProgramSpecificQualification>;
  public addProgramSpecificQualification!: HasManyAddAssociationMixin<ProgramSpecificQualification, number>;

  public getSSCQualification!: HasOneGetAssociationMixin<ProgramSSCQualification>;
  public setSSCQualification!: HasOneSetAssociationMixin<ProgramSSCQualification, number>;
}

Program.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Prevent deletion of department if it has programs
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  certificationType: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  durationType: {
    type: DataTypes.ENUM('WEEK', 'MONTH', 'YEAR'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  applicationFeeInNaira: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  acceptanceFeeInNaira: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
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
  tableName: 'programs',
  modelName: 'Program',
  timestamps: true,
  indexes: [
    {
      fields: ['departmentId'],
    },
    {
      fields: ['name', 'departmentId'],
      unique: true, // Program name must be unique within a department
    },
    {
      fields: ['code', 'departmentId'],
      unique: true, // Program code must be unique within a department
    },
    {
      fields: ['isActive'],
    },
    {
      fields: ['certificationType'],
    },
  ],
});

Department.hasMany(Program, { foreignKey: 'departmentId' });

// In your Program model
Program.belongsTo(Department, { 
  foreignKey: 'departmentId',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
export default Program