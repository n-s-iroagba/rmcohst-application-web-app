import { Model, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Optional } from 'sequelize';
import sequelize from '../config/database';

import ProgramSpecificQualification from './ProgramSpecificQualification';
import ProgramSSCQualification from './ProgramSSCQualification';

interface ProgramAttributes {
  id: number;
  department: string; // Or number if FK to Department id
  certificationType: string;
  durationType: 'WEEK' | 'MONTH' | 'YEAR';
  duration: number;
  applicationFeeInNaira: number;
  acceptanceFeeInNaira: number;
}

interface ProgramCreationAttributes extends Optional<ProgramAttributes, 'id'> {}

class Program extends Model<ProgramAttributes, ProgramCreationAttributes> implements ProgramAttributes {
  public id!: number;
  public department!: string;
  public certificationType!: string;
  public durationType!: 'WEEK'|'MONTH'|'YEAR';
  public duration!: number;
  public applicationFeeInNaira!: number;
  public acceptanceFeeInNaira!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
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
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acceptanceFeeInNaira: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  applicationFeeInNaira: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  certificationType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationType: {
    type: DataTypes.ENUM('WEEK', 'MONTH', 'YEAR'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'programs',
  modelName: 'Program',
});


export default Program;
