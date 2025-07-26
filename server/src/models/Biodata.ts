import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

export interface BiodataAttributes {
  id: number
  applicationId: number
  firstName: string
  middleName?: string | null
  surname: string
  gender: string
  dateOfBirth: Date
  maritalStatus: string
  homeAddress: string
  nationality: string
  stateOfOrigin: string
  lga: string
  homeTown: string
  phoneNumber: string
  emailAddress: string
  passportPhotograph: Blob | Buffer
  nextOfKinFullName: string
  nextOfKinPhoneNumber: string
  nextOfKinAddress: string
  relationshipWithNextOfKin: string
}

interface BiodataCreationAttributes {
  applicationId: number
}

class Biodata
  extends Model<BiodataAttributes, BiodataCreationAttributes>
  implements BiodataAttributes
{
  public id!: number
  public applicationId!: number
  public firstName!: string
  public middleName?: string | null
  public surname!: string
  public gender!: string
  public dateOfBirth!: Date
  public maritalStatus!: string
  public homeAddress!: string
  public nationality!: string
  public stateOfOrigin!: string
  public lga!: string
  public homeTown!: string
  public phoneNumber!: string
  public emailAddress!: string
  public passportPhotograph!: Buffer
  public nextOfKinFullName!: string
  public nextOfKinPhoneNumber!: string
  public nextOfKinAddress!: string
  public relationshipWithNextOfKin!: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to check if biodata is complete
  public isComplete(): boolean {
    const requiredFields: (keyof BiodataAttributes)[] = [
      'firstName',
      'surname',
      'gender',
      'dateOfBirth',
      'maritalStatus',
      'homeAddress',
      'nationality',
      'stateOfOrigin',
      'lga',
      'homeTown',
      'phoneNumber',
      'emailAddress',
      'passportPhotograph',
      'nextOfKinFullName',
      'nextOfKinPhoneNumber',
      'nextOfKinAddress',
      'relationshipWithNextOfKin',
    ]

    return requiredFields.every(field => {
      const value = this[field]
      return value !== null && value !== undefined && value !== ''
    })
  }
}

Biodata.init(
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
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    stateOfOrigin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lga: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    homeTown: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    passportPhotograph: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    nextOfKinFullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nextOfKinPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nextOfKinAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    relationshipWithNextOfKin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    tableName: 'biodata',
    modelName: 'Biodata',
  }
)

export default Biodata
