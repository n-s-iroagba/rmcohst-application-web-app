import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from '../config/database'

// Grade enum
export enum Grade {
  A1 = 'A1',
  B2 = 'B2',
  B3 = 'B3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6',
  D7 = 'D7',
  E8 = 'E8',
}

// Qualification types enum
export enum QualificationType {
  WAEC = 'WAEC',
  NECO = 'NECO',
  NABTEB = 'NABTEB',
  GCE = 'GCE',
}

// Subject requirement structure
export interface SubjectRequirement {
  subjectId: number
  grade: Grade
  alternateSubjectId?: number // Optional alternate subject
}

export class ProgramSSCRequirement extends Model<
  InferAttributes<ProgramSSCRequirement>,
  InferCreationAttributes<ProgramSSCRequirement>
> {
  declare id: CreationOptional<number>
  declare programId: number
  declare tag: string
  declare maximumSittings: number
  declare qualificationTypes: QualificationType[]
  declare subjects: SubjectRequirement[] // Store all subjects as JSON array
  declare readonly createdAt: CreationOptional<Date>
  declare readonly updatedAt: CreationOptional<Date>
}

/**
 * Initialize the model
 */
ProgramSSCRequirement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Remove references - let associations handle this
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maximumSittings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },
    qualificationTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [QualificationType.WAEC],
    },
    subjects: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        hasRequiredSubjects(value: SubjectRequirement[]) {
          if (!Array.isArray(value) || value.length < 5) {
            throw new Error('Must have at least 5 subjects')
          }
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'program_ssc_requirements',
    modelName: 'ProgramSSCRequirement',
    timestamps: true,
  }
)
