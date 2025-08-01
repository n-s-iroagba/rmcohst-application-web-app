import { 
  Model, 
  DataTypes, 
  Association,
} from 'sequelize'
import sequelize from '../config/database'

// Types and Enums
export enum Grade {
  A1 = 'A1',
  B2 = 'B2', 
  B3 = 'B3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6',
  D7 = 'D7',
  E8 = 'E8',
  F9 = 'F9'
}

export enum CertificateType {
  WAEC = 'WAEC',
  NECO = 'NECO',
  NABTEB = 'NABTEB',
  GCE = 'GCE'
}

export interface ApplicantSSCQualification {
  id?: number
  applicationId?: number|null
  numberOfSittings?: number|null
  certificateTypes?: string[]|[]
  certificates?: File[] | Blob[] | []
  firstSubjectId?: number|null
  firstSubjectGrade?: Grade|null
  secondSubjectId?: number|null
  secondSubjectGrade?: Grade|null
  thirdSubjectId?: number|null
  thirdSubjectGrade?: Grade|null
  fourthSubjectId?: number|null
  fourthSubjectGrade?: Grade|null
  fifthSubjectId?: number|null
  fifthSubjectGrade?: Grade|null
}

export interface SSCQualificationFormData extends Omit<ApplicantSSCQualification, 'id'> {}

// Validation interfaces
export interface ValidationResult {
  isValid?: boolean
  errors?: string[]
  warnings?: string[]
}

export interface CompletionStatus {
  isComplete?: boolean
  completedFields?: string[]
  missingFields?: string[]
  completionPercentage?: number
}

// Certificate file interface
export interface CertificateFile {
  id: number
  sscQualificationId: number
  fileName: string
  fileType: string
  fileSize: number
  fileUrl: string
  certificateType: CertificateType
  uploadedAt: Date
}

class SSCQualification extends Model<ApplicantSSCQualification> implements ApplicantSSCQualification {
  public id?: number
  public applicationId?: number | null
  public numberOfSittings?: number | null
  public certificateTypes?: string[] | []
  public certificates?: File[] | Blob[] | []
  public firstSubjectId?: number | null
  public firstSubjectGrade?: Grade | null
  public secondSubjectId?: number | null
  public secondSubjectGrade?: Grade | null
  public thirdSubjectId?: number | null
  public thirdSubjectGrade?: Grade | null
  public fourthSubjectId?: number | null
  public fourthSubjectGrade?: Grade | null
  public fifthSubjectId?: number | null
  public fifthSubjectGrade?: Grade | null

  // Timestamps
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  // Association declarations
  public static associations: {
    certificateFiles: Association<SSCQualification, CertificateFile>
    application: Association<SSCQualification, any>
  }



  /**
   * Checks completion status of the qualification
   */
  public getCompletionStatus(): CompletionStatus {
    const allFields = [
      'applicationId', 'numberOfSittings', 'certificateTypes',
      'firstSubjectId', 'firstSubjectGrade',
      'secondSubjectId', 'secondSubjectGrade', 
      'thirdSubjectId', 'thirdSubjectGrade',
      'fourthSubjectId', 'fourthSubjectGrade',
      'fifthSubjectId', 'fifthSubjectGrade'
    ]

    const completedFields = allFields.filter(field => {
      const value = this[field as keyof this]
      return value !== null && value !== undefined && 
             (Array.isArray(value) ? value.length > 0 : true)
    })

    const missingFields = allFields.filter(field => !completedFields.includes(field))

    return {
      isComplete: missingFields.length === 0,
      completedFields,
      missingFields,
      completionPercentage: Math.round((completedFields.length / allFields.length) * 100)
    }
  }

  /**
   * Validates certificate files against number of sittings
   */
  // public async validateCertificateFiles(certificateFiles:CertficateFile[]): Promise<ValidationResult> {
  //   const errors: string[] = []
    
  //   try {
     
      
  //     if (this.numberOfSittings && certificateFiles.length !== this.numberOfSittings) {
  //       errors.push(
  //         `Number of certificate files (${certificateFiles.length}) must match number of sittings (${this.numberOfSittings})`
  //       )
  //     }

  //     // Validate each certificate type has corresponding file
  //     if (this.certificateTypes) {
  //       const fileTypes = certificateFiles.map(file => file.certificateType)
  //       const missingTypes = this.certificateTypes.filter(type => 
  //         !fileTypes.includes(type as CertificateType)
  //       )
        
  //       if (missingTypes.length > 0) {
  //         errors.push(`Missing certificate files for: ${missingTypes.join(', ')}`)
  //       }
  //     }

  //     return {
  //       isValid: errors.length === 0,
  //       errors
  //     }
  //   } catch (error) {
  //     return {
  //       isValid: false,
  //       errors: ['Failed to validate certificate files']
  //     }
  //   }
  // }

  /**
   * Comprehensive validation including all checks
   */
  // public async validateAll(): Promise<ValidationResult> {
  //   const completionResult = this.validateCompletion()
  //   const certificateResult = await this.validateCertificateFiles()

  //   const allErrors = [...completionResult.errors, ...certificateResult.errors]
  //   const allWarnings = completionResult.warnings || []

  //   return {
  //     isValid: allErrors.length === 0,
  //     errors: allErrors,
  //     warnings: allWarnings
  //   }
  // }


  public validateCompletion(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Check if numberOfSittings is set first
    if (!this.numberOfSittings) {
      errors.push('Number of sittings is required')
      return {
        isValid: false,
        errors,
        warnings
      }
    }

    // Required fields validation - only check if numberOfSittings exists
    const requiredFields = [
      'applicationId',
      'certificateTypes',
      'firstSubjectId',
      'firstSubjectGrade',
      'secondSubjectId', 
      'secondSubjectGrade',
      'thirdSubjectId',
      'thirdSubjectGrade',
      'fourthSubjectId',
      'fourthSubjectGrade',
      'fifthSubjectId',
      'fifthSubjectGrade'
    ]

    requiredFields.forEach(field => {
      const value = this[field as keyof this]
      if (value === null || value === undefined) {
        errors.push(`${field} is required`)
      }
    })

    // Business logic validations
    if (this.numberOfSittings < 1 || this.numberOfSittings > 3) {
      errors.push('Number of sittings must be between 1 and 3')
    }

    // Validate certificate types match number of sittings
    if (this.certificateTypes && this.certificateTypes.length !== this.numberOfSittings) {
      errors.push(`Certificate types count (${this.certificateTypes.length}) must match number of sittings (${this.numberOfSittings})`)
    }

    // Grade validation
    const gradeFields = [
      'firstSubjectGrade', 'secondSubjectGrade', 'thirdSubjectGrade', 
      'fourthSubjectGrade', 'fifthSubjectGrade'
    ]
    
    gradeFields.forEach(field => {
      const grade = this[field as keyof this] as Grade
      if (grade && !Object.values(Grade).includes(grade)) {
        errors.push(`${field} must be a valid grade`)
      }
    })

    // Certificate types validation
    if (this.certificateTypes) {
      const invalidTypes = this.certificateTypes.filter(type => 
        !Object.values(CertificateType).includes(type as CertificateType)
      )
      if (invalidTypes.length > 0) {
        errors.push(`Invalid certificate types: ${invalidTypes.join(', ')}`)
      }
    }

    // Subject duplication check
    const subjectIds = [
      this.firstSubjectId, this.secondSubjectId, this.thirdSubjectId,
      this.fourthSubjectId, this.fifthSubjectId
    ].filter(id => id !== null)

    const duplicateSubjects = subjectIds.filter((id, index) => 
      subjectIds.indexOf(id) !== index
    )
    
    if (duplicateSubjects.length > 0) {
      errors.push('Duplicate subjects are not allowed')
    }

    // Warnings for poor grades
    const poorGrades = [Grade.D7, Grade.E8, Grade.F9]
    gradeFields.forEach(field => {
      const grade = this[field as keyof this] as Grade
      if (grade && poorGrades.includes(grade)) {
        warnings.push(`${field} has a grade that may not meet admission requirements`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }


  /**
   * Gets minimum required subjects count (usually 5 for SSC)
   */
  public static getMinimumSubjectsRequired(): number {
    return 5
  }

  /**
   * Gets valid certificate types
   */
  public static getValidCertificateTypes(): CertificateType[] {
    return Object.values(CertificateType)
  }

  /**
   * Gets valid grades
   */
  public static getValidGrades(): Grade[] {
    return Object.values(Grade)
  }

  /**
   * Instance method to check if qualification meets minimum requirements
   */
  public meetsMinimumRequirements(): boolean {
    const validation = this.validateCompletion()
    const completion = this.getCompletionStatus()
    
    return ((validation?.isValid||false) && completion.isComplete) as boolean
  }

  /**
   * Get subjects with passing grades (C6 and above)
   */
  public getPassingSubjects(): Array<{subjectId: number, grade: Grade}> {
    const passingGrades = [Grade.A1, Grade.B2, Grade.B3, Grade.C4, Grade.C5, Grade.C6]
    const subjects = []

    const subjectGradePairs = [
      { id: this.firstSubjectId, grade: this.firstSubjectGrade },
      { id: this.secondSubjectId, grade: this.secondSubjectGrade },
      { id: this.thirdSubjectId, grade: this.thirdSubjectGrade },
      { id: this.fourthSubjectId, grade: this.fourthSubjectGrade },
      { id: this.fifthSubjectId, grade: this.fifthSubjectGrade }
    ]

    for (const pair of subjectGradePairs) {
      if (pair.id && pair.grade && passingGrades.includes(pair.grade)) {
        subjects.push({ subjectId: pair.id, grade: pair.grade })
      }
    }

    return subjects
  }

  /**
   * Calculate overall performance score
   */
  public calculatePerformanceScore(): number {
    const gradePoints: Record<Grade, number> = {
      [Grade.A1]: 9,
      [Grade.B2]: 8,
      [Grade.B3]: 7,
      [Grade.C4]: 6,
      [Grade.C5]: 5,
      [Grade.C6]: 4,
      [Grade.D7]: 3,
      [Grade.E8]: 2,
      [Grade.F9]: 1
    }

    const grades = [
      this.firstSubjectGrade,
      this.secondSubjectGrade,
      this.thirdSubjectGrade,
      this.fourthSubjectGrade,
      this.fifthSubjectGrade
    ].filter(grade => grade !== null) as Grade[]

    if (grades.length === 0) return 0

    const totalPoints = grades.reduce((sum, grade) => sum + gradePoints[grade], 0)
    return Math.round((totalPoints / grades.length) * 100) / 100
  }
}
  SSCQualification.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Applications',
          key: 'id'
        }
      },
      numberOfSittings: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 3
        }
      },
      certificateTypes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
      },
      firstSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Subjects',
          key: 'id'
        }
      },
      firstSubjectGrade: {
        type: DataTypes.ENUM(...Object.values(Grade)),
        allowNull: true
      },
      secondSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Subjects', 
          key: 'id'
        }
      },
      secondSubjectGrade: {
        type: DataTypes.ENUM(...Object.values(Grade)),
        allowNull: true
      },
      thirdSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Subjects',
          key: 'id'
        }
      },
      thirdSubjectGrade: {
        type: DataTypes.ENUM(...Object.values(Grade)),
        allowNull: true
      },
      fourthSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,  
        references: {
          model: 'Subjects',
          key: 'id'
        }
      },
      fourthSubjectGrade: {
        type: DataTypes.ENUM(...Object.values(Grade)),
        allowNull: true
      },
      fifthSubjectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Subjects',
          key: 'id'
        }
      },
      fifthSubjectGrade: {
        type: DataTypes.ENUM(...Object.values(Grade)),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'SSCQualification',
      tableName: 'ssc_qualifications',
      timestamps: true,
      indexes: [
        {
          fields: ['applicationId']
        },
        {
          fields: ['numberOfSittings']
        }
      ]
    }
  )


// Certificate Files model for file management
export class CertificateFile extends Model<CertificateFile> {
  public id!: number
  public sscQualificationId!: number
  public fileName!: string
  public fileType!: string
  public fileSize!: number
  public fileUrl!: string
  public certificateType!: CertificateType
  public uploadedAt!: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}


  CertificateFile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sscQualificationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ssc_qualifications',
          key: 'id'
        }
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      certificateType: {
        type: DataTypes.ENUM(...Object.values(CertificateType)),
        allowNull: false
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      _attributes: '',
      sequelize: '',
      destroy: '',
      restore: '',
      update: '',
      increment: '',
      decrement: '',
      addHook: '',
      removeHook: '',
      hasHook: '',
      hasHooks: '',
      validate: '',
      createdAt: '',
      updatedAt: '',
      dataValues: '',
      _creationAttributes: '',
      isNewRecord: '',
      where: '',
      getDataValue: '',
      setDataValue: '',
      get: '',
      set: '',
      setAttributes: '',
      changed: '',
      previous: '',
      save: '',
      reload: '',
      equals: '',
      equalsOneOf: '',
      toJSON: '',
      isSoftDeleted: '',
      _model: ''
    },
    {
      sequelize,
      modelName: 'CertificateFile',
      tableName: 'certificate_files',
      timestamps: true
    }
  )


// Define associations
export const defineAssociations = () => {
  SSCQualification.hasMany(CertificateFile, {
    foreignKey: 'sscQualificationId',
    as: 'certificateFiles'
  })

  CertificateFile.belongsTo(SSCQualification, {
    foreignKey: 'sscQualificationId',
    as: 'sscQualification'
  })
}

export { SSCQualification }
export default SSCQualification