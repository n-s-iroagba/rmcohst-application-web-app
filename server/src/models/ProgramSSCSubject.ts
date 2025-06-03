import {
  Model,
  DataTypes,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Optional,
} from 'sequelize';
import sequelize from '../config/database';
import ProgramSSCQualification from './ProgramSSCQualification';
import SSCSubject from './SSCSubject';

interface ProgramSSCSubjectAttributes {
  id: number;
  sscSubjectId: ForeignKey<SSCSubject['id']>;
  minimumGrade: string;
  programSSCQualificationId: ForeignKey<ProgramSSCQualification['id']>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgramSSCSubjectCreationAttributes extends Optional<ProgramSSCSubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSSCSubject extends Model<
  ProgramSSCSubjectAttributes,
  ProgramSSCSubjectCreationAttributes
> {
  public id!: number;
  public sscSubjectId!: ForeignKey<SSCSubject['id']>;
  public minimumGrade!: string;
  public programSSCQualificationId!: ForeignKey<ProgramSSCQualification['id']>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getQualification!: BelongsToGetAssociationMixin<ProgramSSCQualification>;
  public setQualification!: BelongsToSetAssociationMixin<ProgramSSCQualification, string>;

  public getSSCSubject!: BelongsToGetAssociationMixin<SSCSubject>;
  public setSSCSubject!: BelongsToSetAssociationMixin<SSCSubject, number>;
}

ProgramSSCSubject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sscSubjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minimumGrade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programSSCQualificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'program_ssc_subjects',
    modelName: 'ProgramSSCSubject',
    timestamps: true,
  }
);

// Associations
ProgramSSCQualification.hasMany(ProgramSSCSubject, {
  foreignKey: 'programSSCQualificationId',
  as: 'subjects',
  onDelete: 'CASCADE',
});

ProgramSSCSubject.belongsTo(ProgramSSCQualification, {
  foreignKey: 'programSSCQualificationId',
  as: 'qualification',
});

SSCSubject.hasMany(ProgramSSCSubject, {
  foreignKey: 'sscSubjectId',
  as: 'programSSCSubjects',
});

ProgramSSCSubject.belongsTo(SSCSubject, {
  foreignKey: 'sscSubjectId',
  as: 'sscSubject',
});

export default ProgramSSCSubject;
