import ApplicantProgramSpecificQualification from '../models/ApplicantProgramSpecificQualification'
import logger from '../utils/logger'

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface CompletionStatus {
  isComplete: boolean
  completedFields: string[]
  missingFields: string[]
  completionPercentage: number
}

class ApplicantProgramSpecificQualificationService {
  public static async create(applicationId: number): Promise<ApplicantProgramSpecificQualification> {
    try {
      const qualification = await ApplicantProgramSpecificQualification.create({ applicationId })
      logger.info(`Program Specific Qualification created with ID ${qualification.id}`)
      return qualification
    } catch (error: any) {
      logger.error(`Failed to create Program Specific Qualification: ${error.message}`)
      throw error
    }
  }

  public static async update(
    id: number,
    updateData: any,
    files?: Express.Multer.File[]
  ): Promise<ApplicantProgramSpecificQualification> {
    try {
      // Find the existing qualification
      const existingQualification = await ApplicantProgramSpecificQualification.findByPk(id)
      if (!existingQualification) {
        throw new Error(`Program Specific Qualification with ID ${id} not found`)
      }

      const {
        applicationId,
        qualificationType,
        grade,
        ...otherFields
      } = updateData

      // Handle certificate file if provided
      let certificate: Buffer | undefined
      
      if (files && files.length > 0) {
        if (files.length > 1) {
          logger.error(`Too many files provided: expected 1, got ${files.length}`)
          throw new Error('Only one certificate file is allowed.')
        }

        const certificateFile = files[0]
        
        // Validate file type (optional - you can customize this)
        const allowedMimeTypes = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if (!allowedMimeTypes.includes(certificateFile.mimetype)) {
          throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`)
        }

        // Check file size (5MB limit)
        const maxFileSize = 5 * 1024 * 1024 // 5MB
        if (certificateFile.size > maxFileSize) {
          throw new Error('File size exceeds 5MB limit')
        }

        certificate = certificateFile.buffer
        logger.info(`Certificate file processed: ${certificateFile.originalname} (${certificateFile.size} bytes)`)
      }

      // Prepare update data
      const updatePayload = {
        ...(applicationId && { applicationId: Number(applicationId) }),
        ...(qualificationType && { qualificationType }),
        ...(grade && { grade }),
        ...(certificate && { certificate }),
        ...otherFields,
      }

      // Update the qualification
      await existingQualification.update(updatePayload)

      // Fetch and return the updated qualification
      const updatedQualification = await ApplicantProgramSpecificQualification.findByPk(id)
      
      logger.info(`Program Specific Qualification updated for ID ${id}`)
      return updatedQualification!
    } catch (error: any) {
      logger.error('Failed to update Program Specific Qualification', error)
      throw error
    }
  }

  public static async findById(id: number): Promise<ApplicantProgramSpecificQualification | null> {
    try {
      const qualification = await ApplicantProgramSpecificQualification.findByPk(id)
      return qualification
    } catch (error: any) {
      logger.error(`Failed to find Program Specific Qualification with ID ${id}: ${error.message}`)
      throw error
    }
  }

  public static async findByApplicationId(applicationId: number): Promise<ApplicantProgramSpecificQualification | null> {
    try {
      const qualification = await ApplicantProgramSpecificQualification.findOne({
        where: { applicationId }
      })
      return qualification
    } catch (error: any) {
      logger.error(`Failed to find Program Specific Qualification for application ${applicationId}: ${error.message}`)
      throw error
    }
  }

  public static async delete(id: number): Promise<boolean> {
    try {
      const qualification = await ApplicantProgramSpecificQualification.findByPk(id)
      if (!qualification) {
        throw new Error(`Program Specific Qualification with ID ${id} not found`)
      }

      await qualification.destroy()
      logger.info(`Program Specific Qualification deleted with ID ${id}`)
      return true
    } catch (error: any) {
      logger.error(`Failed to delete Program Specific Qualification with ID ${id}: ${error.message}`)
      throw error
    }
  }

  // Additional helper methods
  public static validateQualification(qualification: ApplicantProgramSpecificQualification): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // Required fields validation
    if (!qualification.applicationId) {
      errors.push('Application ID is required')
    }

    if (!qualification.qualificationType) {
      errors.push('Qualification type is required')
    }

    if (!qualification.grade) {
      errors.push('Grade is required')
    }

    if (!qualification.certificate) {
      errors.push('Certificate file is required')
    }

    // Business logic validations
    if (qualification.qualificationType) {
      // Add your specific qualification type validations here
      const validQualificationTypes = [
        'A_LEVEL', 'DIPLOMA', 'DEGREE', 'PROFESSIONAL_CERT', 'OTHER'
      ]
      
      if (!validQualificationTypes.includes(qualification.qualificationType.toUpperCase())) {
        warnings.push('Qualification type may not be recognized')
      }
    }

    if (qualification.grade) {
      // Add grade validation logic based on your requirements
      const validGrades = ['A', 'B', 'C', 'D', 'E', 'F', 'PASS', 'MERIT', 'DISTINCTION']
      if (!validGrades.some(grade => qualification.grade?.toUpperCase().includes(grade))) {
        warnings.push('Grade format may not be standard')
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  public static getCompletionStatus(qualification: ApplicantProgramSpecificQualification): CompletionStatus {
    const allFields = ['applicationId', 'qualificationType', 'grade', 'certificate']
    
    const completedFields = allFields.filter(field => {
      const value = qualification[field as keyof ApplicantProgramSpecificQualification]
      return value !== null && value !== undefined
    })

    const missingFields = allFields.filter(field => !completedFields.includes(field))

    return {
      isComplete: missingFields.length === 0,
      completedFields,
      missingFields,
      completionPercentage: Math.round((completedFields.length / allFields.length) * 100)
    }
  }
}

export default ApplicantProgramSpecificQualificationService