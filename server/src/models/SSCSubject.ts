import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';
import sequelize from '../config/database';
import ProgramSSCSubject from './ProgramSSCSubject';

// Define full attributes
interface SSCSubjectAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
interface SSCSubjectCreationAttributes extends Optional<SSCSubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class SSCSubject extends Model<SSCSubjectAttributes, SSCSubjectCreationAttributes> {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins for ProgramSSCSubject
  public getProgramSSCSubjects!: HasManyGetAssociationsMixin<ProgramSSCSubject>;
  public addProgramSSCSubject!: HasManyAddAssociationMixin<ProgramSSCSubject, number>;
  public createProgramSSCSubject!: HasManyCreateAssociationMixin<ProgramSSCSubject>;

  public static associations: {
    programSSCSubjects: Association<SSCSubject, ProgramSSCSubject>;
  };
}

SSCSubject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ssc_subjects',
    modelName: 'SSCSubject',
    timestamps: true,
  }
);

export default SSCSubject;
