import type { Request, Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth'
import FacultyService from '../services/FacultyService'
import { logger } from '../utils/logger'
import { AppError } from '../utils/errors'
import { ApiResponseUtil } from '../utils/response'

export class FacultyController {
  private facultyService: typeof FacultyService

  constructor() {
    this.facultyService = FacultyService
  }

  public getAllFaculties = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        includeDepartments = false 
      } = req.query

      logger.info('Get all faculties endpoint called', {
        page: Number(page),
        limit: Number(limit),
        includeDepartments: includeDepartments === 'true'
      })

      const result = await this.facultyService.getAllFaculties(
        Number(page),
        Number(limit),
        includeDepartments === 'true'
      )

      res.status(200).json(
        ApiResponseUtil.success(
          result,
          'Faculties retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching all faculties', { 
        error,
        query: req.query 
      })
      next(error)
    }
  }

  public getFacultyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params

      logger.info('Get faculty by ID endpoint called', {
        facultyId: Number(id)
      })

      const faculty = await this.facultyService.getFacultyById(Number(id))

      res.status(200).json(
        ApiResponseUtil.success(
          faculty,
          'Faculty retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching faculty by ID', {
        error,
        facultyId: req.params.id
      })
      next(error)
    }
  }

  public getFacultiesWithDepartmentCounts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('Get faculties with department counts endpoint called')

      const faculties = await this.facultyService.getFacultiesWithDepartmentCounts()

      res.status(200).json(
        ApiResponseUtil.success(
          faculties,
          'Faculties with department counts retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching faculties with department counts', { error })
      next(error)
    }
  }

  public createFaculty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Authorization check - only admins can create faculties
      if (
        !req.user?.id ||
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized to create faculties', 403)
      }

      const { faculties } = req.body

      logger.info('Create faculty endpoint called', {
        userId: req.user.id,
        userRole: req.user.role,
        facultyCount: faculties?.length
      })

      const createdFaculties = await this.facultyService.createFaculty(faculties)

      res.status(201).json(
        ApiResponseUtil.success(
          createdFaculties,
          `${createdFaculties.length} faculties created successfully`,
          201
        )
      )
    } catch (error) {
      logger.error('Error creating faculties', {
        error,
        userId: req.user?.id,
        facultyData: req.body
      })
      next(error)
    }
  }

  public updateFaculty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Authorization check - only admins can update faculties
      if (
        !req.user?.id ||
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized to update faculties', 403)
      }

      const { id } = req.params
      const { name } = req.body

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new AppError('Faculty name is required and must be a non-empty string', 400)
      }

      logger.info('Update faculty endpoint called', {
        userId: req.user.id,
        userRole: req.user.role,
        facultyId: Number(id),
        newName: name
      })

      const updatedFaculty = await this.facultyService.updateFaculty(Number(id), name.trim())

      res.status(200).json(
        ApiResponseUtil.success(
          updatedFaculty,
          'Faculty updated successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error updating faculty', {
        error,
        userId: req.user?.id,
        facultyId: req.params.id,
        updates: req.body
      })
      next(error)
    }
  }

  public deleteFaculty = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Authorization check - only admins can delete faculties
      if (
        !req.user?.id ||
        !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized to delete faculties', 403)
      }

      const { id } = req.params

      logger.info('Delete faculty endpoint called', {
        userId: req.user.id,
        userRole: req.user.role,
        facultyId: Number(id)
      })

      await this.facultyService.deleteFaculty(Number(id))

      res.status(200).json(
        ApiResponseUtil.success(
          { deletedFacultyId: Number(id) },
          'Faculty deleted successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error deleting faculty', {
        error,
        userId: req.user?.id,
        facultyId: req.params.id
      })
      next(error)
    }
  }

}

export default new FacultyController()