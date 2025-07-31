import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

export interface BiodataAttributes {
  id: number
  applicationId: number
  firstName?:string|null
  middleName?:string|null | null
  surname?:string|null
  gender?:string|null
  dateOfBirth: Date
  maritalStatus?:string|null
  homeAddress?:string|null
  nationality?:string|null
  stateOfOrigin?:string|null
  lga?:string|null
  homeTown?:string|null
  phoneNumber?:string|null
  emailAddress?:string|null
  passportPhotograph: Blob | Buffer
  nextOfKinFullName?:string|null
  nextOfKinPhoneNumber?:string|null
  nextOfKinAddress?:string|null
  relationshipWithNextOfKin?:string|null
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
  public firstName?: string|null
  public middleName?: string | null
  public surname?: string|null
  public gender?: string|null
  public dateOfBirth!: Date
  public maritalStatus?: string|null
  public homeAddress?: string|null
  public nationality?: string|null
  public stateOfOrigin?: string|null
  public lga?: string|null
  public homeTown?: string|null
  public phoneNumber?: string|null
  public emailAddress?: string|null
  public passportPhotograph!: Buffer
  public nextOfKinFullName?: string|null
  public nextOfKinPhoneNumber?: string|null
  public nextOfKinAddress?: string|null
  public relationshipWithNextOfKin?: string|null

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
      allowNull:true,
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
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull:true,
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    homeAddress: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    stateOfOrigin: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    lga: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    homeTown: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    passportPhotograph: {
      type: DataTypes.BLOB('long'),
      allowNull:true,
    },
    nextOfKinFullName: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    nextOfKinPhoneNumber: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    nextOfKinAddress: {
      type: DataTypes.STRING,
      allowNull:true,
      validate: {
        notEmpty: true,
      },
    },
    relationshipWithNextOfKin: {
      type: DataTypes.STRING,
      allowNull:true,
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
