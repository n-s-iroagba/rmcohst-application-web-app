import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
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



export class ProgramSSCRequirement extends Model<
  InferAttributes<ProgramSSCRequirement>,
  InferCreationAttributes<ProgramSSCRequirement>
> {
  declare id: CreationOptional<string>
  declare tag: string
  declare programId: number
  declare maximumNumberOfSittings: string
  declare qualificationTypes: string[]

  declare firstSubject: string
  declare firstSubjectGrade: Grade

  declare secondSubject: string
  declare secondSubjectGrade: Grade

  declare thirdSubject: string
  declare alternateThirdSubject: string
  declare thirdSubjectGrade: Grade

  declare fourthSubject: string
  declare alternateFourthSubject: string
  declare fourthSubjectGrade: Grade

  declare fifthSubject: string | null
  declare alternateFifthSubject: string
  declare fifthSubjectGrade: Grade

  declare readonly createdAt: CreationOptional<Date>
  declare readonly updatedAt: CreationOptional<Date>
}

// Initialize model
ProgramSSCRequirement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maximumNumberOfSittings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qualificationTypes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    firstSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstSubjectGrade: {
      type: DataTypes.ENUM(...Object.values(Grade)),
      allowNull: false,
    },
    secondSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondSubjectGrade: {
      type: DataTypes.ENUM(...Object.values(Grade)),
      allowNull: false,
    },
    thirdSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternateThirdSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thirdSubjectGrade: {
      type: DataTypes.ENUM(...Object.values(Grade)),
      allowNull: false,
    },
    fourthSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternateFourthSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fourthSubjectGrade: {
      type: DataTypes.ENUM(...Object.values(Grade)),
      allowNull: false,
    },
    fifthSubject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alternateFifthSubject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fifthSubjectGrade: {
      type: DataTypes.ENUM(...Object.values(Grade)),
      allowNull: false,
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
  }
)

