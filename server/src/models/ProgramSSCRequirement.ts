// models/ProgramSSCRequirement.ts
import { Optional, Model, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin } from "sequelize";
import sequelize from "../config/database";
import SSCSubjectMinimumGrade from "./SSCSubjectMinimumGrade";
import Program from "./Program";

// ProgramSSCRequirement Model
interface ProgramSSCRequirementAttributes {
  id: number;
  programId: number;
  qualificationTypes: string[]; 
  maximumNumberOfSittings: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgramSSCRequirementCreationAttributes 
  extends Optional<ProgramSSCRequirementAttributes, 'id' | 'createdAt' | 'updatedAt' > {}

class ProgramSSCRequirement extends Model<
  ProgramSSCRequirementAttributes, 
  ProgramSSCRequirementCreationAttributes
> implements ProgramSSCRequirementAttributes {

  public id!: number;
  public programId!: number;
  public qualificationTypes!: string[];

  public maximumNumberOfSittings!: number;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins for SSCSubjectMinimumGrade
  public addSSCSubjectMinimumGrade!: BelongsToManyAddAssociationMixin<SSCSubjectMinimumGrade, number>;
  public addSSCSubjectMinimumGrades!: BelongsToManyAddAssociationsMixin<SSCSubjectMinimumGrade, number>;
  public countSSCSubjectMinimumGrades!: BelongsToManyCountAssociationsMixin;
  public createSSCSubjectMinimumGrade!: BelongsToManyCreateAssociationMixin<SSCSubjectMinimumGrade>;
  public getSSCSubjectMinimumGrades!: BelongsToManyGetAssociationsMixin<SSCSubjectMinimumGrade>;
  public hasSSCSubjectMinimumGrade!: BelongsToManyHasAssociationMixin<SSCSubjectMinimumGrade, number>;
  public hasSSCSubjectMinimumGrades!: BelongsToManyHasAssociationsMixin<SSCSubjectMinimumGrade, number>;
  public removeSSCSubjectMinimumGrade!: BelongsToManyRemoveAssociationMixin<SSCSubjectMinimumGrade, number>;
  public removeSSCSubjectMinimumGrades!: BelongsToManyRemoveAssociationsMixin<SSCSubjectMinimumGrade, number>;
  public setSSCSubjectMinimumGrades!: BelongsToManySetAssociationsMixin<SSCSubjectMinimumGrade, number>;


}

ProgramSSCRequirement.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  programId: {
    type: DataTypes.INTEGER,

    references: {
      model: Program,
      key: 'id',
    },
  },
  qualificationTypes: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isIn: [['SSCE', 'GCE', 'NECO', 'NABTEB', 'WAEC']],
    },
  },





  maximumNumberOfSittings: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 2,
    },
  },
}, {
  sequelize,
  tableName: 'program_ssc_qualifications',
  modelName: 'ProgramSSCRequirement',
  timestamps: true,
  indexes: [
    {
      fields: ['programId'],
    },
    {
      fields: ['qualificationLevel'],
    },
    {
      fields: ['isActive'],
    },
    {
      unique: true,
      fields: ['programId', 'qualificationLevel'],
      name: 'unique_program_qualification_level'
    },
  ],
});

// Many-to-Many Association with SSCSubjectMinimumGrade
ProgramSSCRequirement.belongsToMany(SSCSubjectMinimumGrade, {
  through: 'ProgramSSCRequirementSubjects',
  foreignKey: 'programSSCQualificationId',
  otherKey: 'sscSubjectMinimumGradeId',
  as: 'sscSubjectMinimumGrades',
  onDelete: 'CASCADE',
});

SSCSubjectMinimumGrade.belongsToMany(ProgramSSCRequirement, {
  through: 'ProgramSSCRequirementSubjects',
  foreignKey: 'sscSubjectMinimumGradeId',
  otherKey: 'programSSCQualificationId',
  as: 'programSSCQualifications',
  onDelete: 'CASCADE',
});

export default ProgramSSCRequirement;
export { ProgramSSCRequirementAttributes, ProgramSSCRequirementCreationAttributes };
