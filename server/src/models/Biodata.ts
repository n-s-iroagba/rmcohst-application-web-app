// ===== UPDATED BIODATA MODEL - SYNCHRONIZED =====
import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database'

export interface BiodataAttributes {
  id: number
  applicationId: number
  firstName?: string
  surname?: string
  otherNames?: string // Changed from middleName
  email?: string // Changed from emailAddress
  phoneNumber?: string
  dateOfBirth?: Date
  gender?: string
  maritalStatus?: string
  nationality?: string
  stateOfOrigin?: string
  localGovernmentArea?: string // Changed from lga
  contactAddress?: string // Changed from homeAddress
  permanentHomeAddress?: string // New field
  passportPhotograph?: Buffer
  nextOfKinName?: string // Changed from nextOfKinFullName
  nextOfKinPhoneNumber?: string
  nextOfKinAddress?: string
  nextOfKinRelationship?: string // Changed from relationshipWithNextOfKin
  completed?: boolean
  homeTown?: string // Kept for backward compatibility if needed
}

export interface BiodataCreationAttributes {
  applicationId: number
}

class Biodata
  extends Model<BiodataAttributes, BiodataCreationAttributes>
  implements BiodataAttributes
{
  public id!: number
  public applicationId!: number
  public firstName?: string
  public surname?: string
  public otherNames?: string
  public email?: string
  public phoneNumber?: string
  public dateOfBirth?: Date
  public gender?: string
  public maritalStatus?: string
  public nationality?: string
  public stateOfOrigin?: string
  public localGovernmentArea?: string
  public contactAddress?: string
  public permanentHomeAddress?: string
  public passportPhotograph?: Buffer
  public nextOfKinName?: string
  public nextOfKinPhoneNumber?: string
  public nextOfKinAddress?: string
  public nextOfKinRelationship?: string
  public completed?: boolean
  public homeTown?: string

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Method to check if biodata is complete
  public isComplete(): boolean {
    const requiredFields: (keyof BiodataAttributes)[] = [
      'firstName',
      'surname',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'maritalStatus',
      'nationality',
      'stateOfOrigin',
      'localGovernmentArea',
      'contactAddress',
      'permanentHomeAddress',
      'passportPhotograph',
      'nextOfKinName',
      'nextOfKinPhoneNumber',
      'nextOfKinAddress',
      'nextOfKinRelationship',
    ]

    return requiredFields.every(field => {
      const value = this[field]
      return value !== null && value !== undefined && value !== ''
    })
  }

  // Helper method to get completion status with details
  public getCompletionStatus(): {
    isComplete: boolean
    completedFields: string[]
    missingFields: string[]
    completionPercentage: number
  } {
    const requiredFields: (keyof BiodataAttributes)[] = [
      'firstName',
      'surname',
      'email',
      'phoneNumber',
      'dateOfBirth',
      'gender',
      'maritalStatus',
      'nationality',
      'stateOfOrigin',
      'localGovernmentArea',
      'contactAddress',
      'permanentHomeAddress',
      'passportPhotograph',
      'nextOfKinName',
      'nextOfKinPhoneNumber',
      'nextOfKinAddress',
      'nextOfKinRelationship',
    ]

    const completedFields = requiredFields.filter(field => {
      const value = this[field]
      return value !== null && value !== undefined && value !== ''
    })

    const missingFields = requiredFields.filter(field => !completedFields.includes(field))

    return {
      isComplete: missingFields.length === 0,
      completedFields: completedFields.map(field => String(field)),
      missingFields: missingFields.map(field => String(field)),
      completionPercentage: Math.round((completedFields.length / requiredFields.length) * 100),
    }
  }

  // Method to validate email format
  public isValidEmail(): boolean {
    if (!this.email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(this.email)
  }

  // Method to validate phone number format (Nigerian format)
  public isValidPhoneNumber(): boolean {
    if (!this.phoneNumber) return false
    // Nigerian phone number validation (11 digits starting with 0 or international format)
    const phoneRegex = /^(\+234|0)[789]\d{9}$/
    return phoneRegex.test(this.phoneNumber.replace(/\s/g, ''))
  }

  // Method to validate age (must be at least 16 years old)
  public isValidAge(): boolean {
    if (!this.dateOfBirth) return false
    const today = new Date()
    const birthDate = new Date(this.dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16
    }
    return age >= 16
  }

  // Comprehensive validation method
  public validateAll(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // Check completion
    const completionStatus = this.getCompletionStatus()
    if (!completionStatus.isComplete) {
      errors.push(`Missing required fields: ${completionStatus.missingFields.join(', ')}`)
    }

    // Validate email
    if (this.email && !this.isValidEmail()) {
      errors.push('Invalid email format')
    }

    // Validate phone number
    if (this.phoneNumber && !this.isValidPhoneNumber()) {
      errors.push('Invalid phone number format (must be Nigerian format)')
    }

    // Validate age
    if (this.dateOfBirth && !this.isValidAge()) {
      errors.push('Applicant must be at least 16 years old')
    }

    // Validate gender
    if (this.gender && !['Male', 'Female', 'M', 'F'].includes(this.gender)) {
      warnings.push('Gender should be Male or Female')
    }

    // Validate marital status
    if (
      this.maritalStatus &&
      !['Single', 'Married', 'Divorced', 'Widowed'].includes(this.maritalStatus)
    ) {
      warnings.push('Marital status should be Single, Married, Divorced, or Widowed')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
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
      allowNull: true,
      defaultValue: '',
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    otherNames: {
      // Changed from middleName
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    email: {
      // Changed from emailAddress
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        isIn: [['Male', 'Female', 'M', 'F', '']],
      },
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        isIn: [['Single', 'Married', 'Divorced', 'Widowed', '']],
      },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    stateOfOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    localGovernmentArea: {
      // Changed from lga
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    contactAddress: {
      // Changed from homeAddress
      type: DataTypes.TEXT, // Changed to TEXT for longer addresses
      allowNull: true,
      defaultValue: '',
    },
    permanentHomeAddress: {
      // New field
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    passportPhotograph: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      defaultValue: null,
    },
    nextOfKinName: {
      // Changed from nextOfKinFullName
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    nextOfKinPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    nextOfKinAddress: {
      type: DataTypes.TEXT, // Changed to TEXT for longer addresses
      allowNull: true,
      defaultValue: '',
    },
    nextOfKinRelationship: {
      // Changed from relationshipWithNextOfKin
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    homeTown: {
      // Kept for backward compatibility
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
  },
  {
    sequelize,
    tableName: 'biodata',
    modelName: 'Biodata',
    hooks: {
      beforeSave: (biodata: Biodata) => {
        // Auto-update completed status based on isComplete check
        biodata.completed = biodata.isComplete()
      },
    },
  }
)

export default Biodata
