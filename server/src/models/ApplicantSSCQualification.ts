import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

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

export enum QualificationType {
  WAEC = 'WAEC',
  NECO = 'NECO',
  NABTEB = 'NABTEB',
  GCE = 'GCE',
}

export interface SubjectRequirement {
  subjectId: number
  grade: Grade
  alternateSubjectId?: number
}

interface ApplicantSSCQualificationAttributes {
  id: number
  applicationId: number|null
  numberOfSittings: number|null
  qualificationTypes: QualificationType[]|[]
  subjects: SubjectRequirement[]|[]
  isDocumentUploaded: boolean |null
  createdAt?: Date
  updatedAt?: Date
}

interface ApplicantSSCQualificationCreationAttributes {
  applicationId: number
}

class ApplicantSSCQualification
  extends Model<ApplicantSSCQualificationAttributes, ApplicantSSCQualificationCreationAttributes>
  implements ApplicantSSCQualificationAttributes
{
  public id!: number
  public applicationId!: number
  public numberOfSittings!: number |null
  public subjects!: SubjectRequirement[]|[]
  public qualificationTypes!: QualificationType[]|[]
  public isDocumentUploaded!: boolean |null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public isComplete(): boolean {
    return !!(
      this.numberOfSittings &&
      this.qualificationTypes?.length > 0 &&
      this.isDocumentUploaded &&
      this.subjects?.length >= 5
    )
  }

  public hasValidCertificateTypes(): boolean {
    const validTypes = Object.values(QualificationType)
    return this.qualificationTypes.every(type => validTypes.includes(type))
  }
}

ApplicantSSCQualification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Applications',
        key: 'id',
      },
    },
    numberOfSittings: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 2,
      },
    },
    qualificationTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      // validate: {
      //   isValidArray(value: any) {
      //     if (!Array.isArray(value) || value.length === 0) {
      //       throw new Error('Certificate types must be a non-empty array')
      //     }
      //     // Validate certificate types
      //     const validTypes = ['WAEC', 'NECO', 'GCE', 'NABTEB']
      //     const invalidTypes = value.filter((type: string) => !validTypes.includes(type))
      //     if (invalidTypes.length > 0) {
      //       throw new Error(`Invalid certificate types: ${invalidTypes.join(', ')}`)
      //     }
      //   },
      // },
    },
    subjects: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isDocumentUploaded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'applicant_ssc_qualifications',
    modelName: 'ApplicantSSCQualification',
  }
)

export default ApplicantSSCQualification
