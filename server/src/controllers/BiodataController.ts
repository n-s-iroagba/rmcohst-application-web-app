

import { NextFunction, Request, Response } from 'express'
import BiodataService, { UpdateBiodataInput } from '../services/BiodataService'
import { validationResult } from 'express-validator'
import { BadRequestError, NotFoundError } from '../utils/errors'

class BiodataController {
  /**
   * Get biodata by application ID
   * GET /api/biodata/application/:applicationId
   */
  async getBiodataByApplicationId(req: Request, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params
      const parsedApplicationId = parseInt(applicationId, 10)

      if (isNaN(parsedApplicationId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid application ID'
        })
        return
      }

      const biodata = await BiodataService.getBiodataByApplicationId(parsedApplicationId)

      if (!biodata) {
        res.status(404).json({
          success: false,
          message: 'Biodata not found for this application'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Biodata retrieved successfully',
        data: biodata
      })
    } catch (error) {
      console.error('Error fetching biodata:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Get biodata by ID
   * GET /api/biodata/:id
   */
  async getBiodataById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const parsedId = parseInt(id, 10)

      if (isNaN(parsedId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid biodata ID'
        })
        return
      }

      const biodata = await BiodataService.getBiodataById(parsedId)

      if (!biodata) {
        res.status(404).json({
          success: false,
          message: 'Biodata not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Biodata retrieved successfully',
        data: biodata
      })
    } catch (error) {
      console.error('Error fetching biodata:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  /**
   * Update biodata by application ID
   * PUT /api/biodata/application/:applicationId
   */
  async updateBiodataByApplicationId(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
 

      const { applicationId } = req.params
      const parsedApplicationId = parseInt(applicationId, 10)

      if (isNaN(parsedApplicationId)) {
         throw new BadRequestError('no application id')
      }

      // Extract update data from request body
      const updateData: UpdateBiodataInput = {}
      const allowedFields = [
        'firstName',
        'middleName',
        'surname',
        'gender',
        'dateOfBirth',
        'maritalStatus',
        'homeAddress',
        'nationality',
        'stateOfOrigin',
        'lga',
        'passportPhotograph',
        'homeTown',
        'phoneNumber',
        'emailAddress',
        'passportPhotograph',
        'nextOfKinFullName',
        'nextOfKinPhoneNumber',
        'nextOfKinAddress',
        'relationshipWithNextOfKin'
      ]

      // Only include fields that are present in the request body
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field as keyof UpdateBiodataInput] = req.body[field]
        }
      })

      if(req.file){
        updateData['passportPhotograph']=req.file.buffer
      }

      // Handle date conversion if dateOfBirth is provided
      if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth)
      }

      const updatedBiodata = await BiodataService.updateBiodataByApplicationId(
        parsedApplicationId,
        updateData
      )

      if (!updatedBiodata) throw new NotFoundError('biodata to be updated not found')

      res.status(200).json({
        success: true,
        message: 'Biodata updated successfully',
        data: updatedBiodata 
      })
    } catch (error) {
      console.error('Error updating biodata:', error)
      next(error)
    }
  }

  /**
   * Update biodata by ID
   * PUT /api/biodata/:id
   */
  async updateBiodataById(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        })
        return
      }

      const { id } = req.params
      const parsedId = parseInt(id, 10)

      if (isNaN(parsedId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid biodata ID'
        })
        return
      }

      // Extract update data from request body
      const updateData: UpdateBiodataInput = {}
      const allowedFields = [
        'firstName',
        'middleName',
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
        'relationshipWithNextOfKin'
      ]

      // Only include fields that are present in the request body
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field as keyof UpdateBiodataInput] = req.body[field]
        }
      })
       if(req.file){
        updateData['passportPhotograph']=req.file.buffer
      }

      // Handle date conversion if dateOfBirth is provided
      if (updateData.dateOfBirth && typeof updateData.dateOfBirth === 'string') {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth)
      }

      const updatedBiodata = await BiodataService.updateBiodataById(
        parsedId,
        updateData
      )

      if (!updatedBiodata) {
        res.status(404).json({
          success: false,
          message: 'Biodata not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Biodata updated successfully',
        data: updatedBiodata
      })
    } catch (error) {
      console.error('Error updating biodata:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }





  /**
   * Get all biodata with pagination
   * GET /api/biodata
   */
  async getAllBiodata(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const offset = (page - 1) * limit

      const { biodata, total } = await BiodataService.getAllBiodata(limit, offset)

      res.status(200).json({
        success: true,
        message: 'Biodata records retrieved successfully',
        data: {
          biodata,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            limit
          }
        }
      })
    } catch (error) {
      console.error('Error fetching biodata records:', error)
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
}

export default new BiodataController()
