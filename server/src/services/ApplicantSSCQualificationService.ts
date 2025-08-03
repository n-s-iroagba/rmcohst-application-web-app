import ApplicantSSCQualification from '../models/ApplicantSSCQualification'
import logger from '../utils/logger'
import { idParamSchema } from '../validation/faculty.validationSchemas'

class ApplicantSSCQualificationService {
  public static async create(applicationId: number): Promise<ApplicantSSCQualification> {
    try {
      const qualification = await ApplicantSSCQualification.create({ applicationId })
      logger.info(`SSC Qualification created with ID ${qualification.id}`)
      return qualification
    } catch (error: any) {
      logger.error(`Failed to create SSC Qualification: ${error.message}`)
      throw error
    }
  }

  public static async update(
    id: number,
    updateData: any,
    files?: Express.Multer.File[]
  ): Promise<ApplicantSSCQualification> {
    try {
      // Find the existing qualification
      const existingQualification = await ApplicantSSCQualification.findByPk(id)
      if (!existingQualification) {
        throw new Error(`SSC Qualification with ID ${id} not found`)
      }

      const {
        applicationId,
        numberOfSittings,
        certificateTypes,
        firstSubjectId,
        firstSubjectGrade,
        secondSubjectId,
        secondSubjectGrade,
        thirdSubjectId,
        thirdSubjectGrade,
        fourthSubjectId,
        fourthSubjectGrade,
        fifthSubjectId,
        fifthSubjectGrade,
        ...otherFields
      } = updateData

      // Handle certificate files if provided
      let certificates: any[] = existingQualification.certificates || []
      
      if (files && files.length > 0) {
        if (numberOfSittings && files.length !== Number(numberOfSittings)) {
          logger.error(
            `File count mismatch: expected ${numberOfSittings}, got ${files.length}`
          )
          throw new Error('Number of files must match number of sittings.')
        }

        certificates = files.map(file => ({
          fileName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          buffer: file.buffer.toString('base64'),
        }))
      }

      // Parse certificateTypes if it's a string
      let parsedCertificateTypes = certificateTypes
      if (typeof certificateTypes === 'string') {
        try {
          parsedCertificateTypes = JSON.parse(certificateTypes)
        } catch (parseError) {
          logger.error('Failed to parse certificateTypes JSON')
          throw new Error('Invalid certificateTypes format')
        }
      }

      // Prepare update data
      const updatePayload = {
        ...(applicationId && { applicationId }),
        ...(numberOfSittings && { numberOfSittings: Number(numberOfSittings) }),
        ...(parsedCertificateTypes && { certificateTypes: parsedCertificateTypes }),
        certificates,
        ...(firstSubjectId && { firstSubjectId: Number(firstSubjectId) }),
        ...(firstSubjectGrade && { firstSubjectGrade }),
        ...(secondSubjectId && { secondSubjectId: Number(secondSubjectId) }),
        ...(secondSubjectGrade && { secondSubjectGrade }),
        ...(thirdSubjectId && { thirdSubjectId: Number(thirdSubjectId) }),
        ...(thirdSubjectGrade && { thirdSubjectGrade }),
        ...(fourthSubjectId && { fourthSubjectId: Number(fourthSubjectId) }),
        ...(fourthSubjectGrade && { fourthSubjectGrade }),
        ...(fifthSubjectId && { fifthSubjectId: Number(fifthSubjectId) }),
        ...(fifthSubjectGrade && { fifthSubjectGrade }),
        ...otherFields,
      }

      // Update the qualification
      await existingQualification.update(updatePayload)

      // Fetch and return the updated qualification
      const updatedQualification = await ApplicantSSCQualification.findByPk(id)
      
      logger.info(`SSC Qualification updated for ID ${id}`)
      return updatedQualification!
    } catch (error: any) {
      logger.error('Failed to update SSC Qualification', error)
      throw error
    }
  }

  public static async findById(id: number): Promise<ApplicantSSCQualification | null> {
    try {
      const qualification = await ApplicantSSCQualification.findByPk(id)
      return qualification
    } catch (error: any) {
      logger.error(`Failed to find SSC Qualification with ID ${id}: ${error.message}`)
      throw error
    }
  }

  public static async findByApplicationId(applicationId: number): Promise<ApplicantSSCQualification | null> {
    try {
      const qualification = await ApplicantSSCQualification.findOne({
        where: { applicationId }
      })
      return qualification
    } catch (error: any) {
      logger.error(`Failed to find SSC Qualification for application ${applicationId}: ${error.message}`)
      throw error
    }
  }
}

export default ApplicantSSCQualificationService