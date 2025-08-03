import { Request, Response } from 'express'
import { z } from 'zod'
import ApplicantProgramSpecificQualificationService from '../services/ApplicantProgramSpecificQualificationService'
import logger from '../utils/logger'

// Validation schema for update request
const updateProgramSpecificQualificationSchema = z.object({
  applicationId: z.string().optional().transform(val => val ? Number(val) : undefined),
  qualificationType: z.string().optional(),
  grade: z.string().optional(),
})

const idParamSchema = z.object({
  id: z.string().transform(val => Number(val))
})

class ApplicantProgramSpecificQualificationController {
  /**
   * Update Program Specific Qualification
   * PUT /api/program-specific-qualifications/:id
   */
  public static async update(req: Request, res: Response): Promise<void> {
    try {
      // Validate params
      const { id } = idParamSchema.parse(req.params)
      
      // Validate body
      const validatedData = updateProgramSpecificQualificationSchema.parse(req.body)

      // Get file from multer (single file expected)
      const files = req.files as Express.Multer.File[] | undefined

      // Call service to update
      const updatedQualification = await ApplicantProgramSpecificQualificationService.update(
        id,
        validatedData,
        files
      )

      // Get validation and completion status
      const validationResult = ApplicantProgramSpecificQualificationService.validateQualification(updatedQualification)
      const completionStatus = ApplicantProgramSpecificQualificationService.getCompletionStatus(updatedQualification)

      logger.info(`Program Specific Qualification updated successfully for ID ${id}`)

      res.status(200).json({
        success: true,
        message: 'Program Specific Qualification updated successfully',
        data: {
          qualification: updatedQualification,
          validation: validationResult,
          completion: completionStatus,
          isComplete: updatedQualification.isComplete()
        }
      })
    } catch (error: any) {
      logger.error('Error updating Program Specific Qualification:', error)

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

      // Handle file-related errors
      if (error.message.includes('file') || error.message.includes('File')) {
        res.status(400).json({
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
   * Get Program Specific Qualification by ID
   * GET /api/program-specific-qualifications/:id
   */
  public static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params)
      
      const qualification = await ApplicantProgramSpecificQualificationService.findById(id)
      
      if (!qualification) {
        res.status(404).json({
          success: false,
          message: 'Program Specific Qualification not found'
        })
        return
      }

      const validationResult = ApplicantProgramSpecificQualificationService.validateQualification(qualification)
      const completionStatus = ApplicantProgramSpecificQualificationService.getCompletionStatus(qualification)

      res.status(200).json({
        success: true,
        data: {
          qualification,
          validation: validationResult,
          completion: completionStatus,
          isComplete: qualification.isComplete()
        }
      })
    } catch (error: any) {
      logger.error('Error fetching Program Specific Qualification:', error)
      
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

  /**
   * Create Program Specific Qualification
   * POST /api/program-specific-qualifications
   */
  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = z.object({
        applicationId: z.number()
      }).parse(req.body)

      const qualification = await ApplicantProgramSpecificQualificationService.create(applicationId)

      logger.info(`Program Specific Qualification created successfully for application ${applicationId}`)

      res.status(201).json({
        success: true,
        message: 'Program Specific Qualification created successfully',
        data: { qualification }
      })
    } catch (error: any) {
      logger.error('Error creating Program Specific Qualification:', error)
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
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

  /**
   * Delete Program Specific Qualification
   * DELETE /api/program-specific-qualifications/:id
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = idParamSchema.parse(req.params)
      
      await ApplicantProgramSpecificQualificationService.delete(id)

      logger.info(`Program Specific Qualification deleted successfully for ID ${id}`)

      res.status(200).json({
        success: true,
        message: 'Program Specific Qualification deleted successfully'
      })
    } catch (error: any) {
      logger.error('Error deleting Program Specific Qualification:', error)
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid ID parameter',
          errors: error.errors
        })
        return
      }

      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message
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

  /**
   * Get Program Specific Qualification by Application ID
   * GET /api/program-specific-qualifications/application/:applicationId
   */
  public static async getByApplicationId(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = z.object({
        applicationId: z.string().transform(val => Number(val))
      }).parse(req.params)
      
      const qualification = await ApplicantProgramSpecificQualificationService.findByApplicationId(applicationId)
      
      if (!qualification) {
        res.status(404).json({
          success: false,
          message: 'Program Specific Qualification not found for this application'
        })
        return
      }

      const validationResult = ApplicantProgramSpecificQualificationService.validateQualification(qualification)
      const completionStatus = ApplicantProgramSpecificQualificationService.getCompletionStatus(qualification)

      res.status(200).json({
        success: true,
        data: {
          qualification,
          validation: validationResult,
          completion: completionStatus,
          isComplete: qualification.isComplete()
        }
      })
    } catch (error: any) {
      logger.error('Error fetching Program Specific Qualification by application ID:', error)
      
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid application ID parameter',
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

export default ApplicantProgramSpecificQualificationController