import { Request, Response } from 'express'
import { z } from 'zod'
import ApplicantSSCQualificationService from '../services/ApplicantSSCQualificationService'
import logger from '../utils/logger'
import { Grade, CertificateType } from '../models/ApplicantSSCQualification'

// Validation schema for update request
const updateSSCQualificationSchema = z.object({
  applicationId: z.string().optional().transform(val => val ? Number(val) : undefined),
  numberOfSittings: z.string().optional().transform(val => val ? Number(val) : undefined),
  certificateTypes: z.string().optional(), // Will be parsed as JSON
  firstSubjectId: z.string().optional().transform(val => val ? Number(val) : undefined),
  firstSubjectGrade: z.nativeEnum(Grade).optional(),
  secondSubjectId: z.string().optional().transform(val => val ? Number(val) : undefined),
  secondSubjectGrade: z.nativeEnum(Grade).optional(),
  thirdSubjectId: z.string().optional().transform(val => val ? Number(val) : undefined),
  thirdSubjectGrade: z.nativeEnum(Grade).optional(),
  fourthSubjectId: z.string().optional().transform(val => val ? Number(val) : undefined),
  fourthSubjectGrade: z.nativeEnum(Grade).optional(),
  fifthSubjectId: z.string().optional().transform(val => val ? Number(val) : undefined),
  fifthSubjectGrade: z.nativeEnum(Grade).optional(),
})

const idParamUpdateSchema = z.object({
  id: z.string().transform(val => Number(val))
})

class ApplicantSSCQualificationController {
  /**
   * Update SSC Qualification
   * PUT /api/ssc-qualifications/:id
   */
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      // Validate params
      const { id } = idParamUpdateSchema.parse(req.params)
      
      // Validate body
      const validatedData = updateSSCQualificationSchema.parse(req.body)

      // Get files from multer (if any)
      const files = req.files as Express.Multer.File[] | undefined

      // Call service to update
      const updatedQualification = await ApplicantSSCQualificationService.update(
        id,
        validatedData,
        files
      )

      // Validate the updated qualification
      const validationResult = updatedQualification.validateCompletion()
      const completionStatus = updatedQualification.getCompletionStatus()

      logger.info(`SSC Qualification updated successfully for ID ${id}`)

      res.status(200).json({
        success: true,
        message: 'SSC Qualification updated successfully',
        data: {
          qualification: updatedQualification,
          validation: validationResult,
          completion: completionStatus,
          passingSubjects: updatedQualification.getPassingSubjects(),
          performanceScore: updatedQualification.calculatePerformanceScore(),
          meetsMinimumRequirements: updatedQualification.meetsMinimumRequirements()
        }
      })
    } catch (error: any) {
      logger.error('Error updating SSC Qualification:', error)

      // Handle validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
        return
      }

      // Handle not found errors
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        })
        return
      }

      // Handle other errors
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  /**
   * Get SSC Qualification by ID
   * GET /api/ssc-qualifications/:id
   */
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamUpdateSchema.parse(req.params)
      
      const qualification = await ApplicantSSCQualificationService.findById(id)
      
      if (!qualification) {
        res.status(404).json({
          success: false,
          message: 'SSC Qualification not found'
        })
        return
      }

      const validationResult = qualification.validateCompletion()
      const completionStatus = qualification.getCompletionStatus()

      res.status(200).json({
        success: true,
        data: {
          qualification,
          validation: validationResult,
          completion: completionStatus,
          passingSubjects: qualification.getPassingSubjects(),
          performanceScore: qualification.calculatePerformanceScore(),
          meetsMinimumRequirements: qualification.meetsMinimumRequirements()
        }
      })
    } catch (error: any) {
      logger.error('Error fetching SSC Qualification:', error)
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID parameter',
          errors: error.errors
        })
        return
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
}

export default ApplicantSSCQualificationController