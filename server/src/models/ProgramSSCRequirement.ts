import { Model, DataTypes, Optional, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database';
import Program from './Program'; // Import your Program model
import SSCSubject from './SSCSubject';
import Grade from './Grade';

interface ProgramSSCRequirementAttributes {
  id: number;
  programId: number;
  subjectId: number;
  minimumGradeId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProgramSSCRequirementCreationAttributes
  extends Optional<ProgramSSCRequirementAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class ProgramSSCRequirement
  extends Model<ProgramSSCRequirementAttributes, ProgramSSCRequirementCreationAttributes>
  implements ProgramSSCRequirementAttributes
{
  public id!: number;
  public programId!: number;
  public subjectId!: number;
  public minimumGradeId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Eager loading associations
  public getProgram!: BelongsToGetAssociationMixin<Program>;
  public getSubject!: BelongsToGetAssociationMixin<SSCSubject>;
  public getMinimumGrade!: BelongsToGetAssociationMixin<Grade>;
}

ProgramSSCRequirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Program,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SSCSubject,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    minimumGradeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Grade,
        key: 'id',
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'program_ssc_requirements',
    modelName: 'ProgramSSCRequirement',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['programId', 'subjectId'], // Ensures unique subject requirement per program
      },
    ],
  }
);

// =====================
// ASSOCIATIONS
// =====================

// Program has many SSC subject requirements
Program.hasMany(ProgramSSCRequirement, {
  foreignKey: 'programId',
  as: 'sscRequirements',
  onDelete: 'CASCADE',
});

ProgramSSCRequirement.belongsTo(Program, {
  foreignKey: 'programId',
  as: 'program',
});

// SSCSubject has many program requirements
SSCSubject.hasMany(ProgramSSCRequirement, {
  foreignKey: 'subjectId',
  as: 'programRequirements',
  onDelete: 'CASCADE',
});

ProgramSSCRequirement.belongsTo(SSCSubject, {
  foreignKey: 'subjectId',
  as: 'subject',
});

// Minimum grade requirement
ProgramSSCRequirement.belongsTo(Grade, {
  foreignKey: 'minimumGradeId',
  as: 'minimumGrade',
});

Grade.hasMany(ProgramSSCRequirement, {
  foreignKey: 'minimumGradeId',
  as: 'usedInRequirements',
});

export default ProgramSSCRequirement;