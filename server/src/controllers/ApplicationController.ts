import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth'
import ApplicationService from '../services/ApplicationService'
import { ApplicationStatus } from '../models/Application'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'
import { ApiResponseUtil } from '../utils/response'


export class ApplicationController {
  private applicationService: ApplicationService

  constructor() {
    this.applicationService = new ApplicationService()
  }

  public createApplication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info('Create application endpoint called', { userId: req.user?.id })

      const application = await this.applicationService.createInitialApplication(
        req.user.id,
        req.body
      )

      res.status(200).json(
        ApiResponseUtil.success(
          application,
          'Application created successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error creating application', { 
        error, 
        userId: req.user?.id,
        applicationData: req.body 
      })
      next(error)
    }
  }

  public getAllApplications = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError('User not authenticated', 401)

      logger.info('Get all applications endpoint called', { userId: req.user.id })

      const applications = await this.applicationService.getAllApplicationsFiltered({})

      res.status(200).json(
        ApiResponseUtil.success(
          applications,
          'Applications retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching all applications', { 
        error, 
        userId: req.user?.id 
      })
      next(error)
    }
  }

  public getMyCurrentDetailedApplication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) throw new AppError('User not authenticated', 401)

      const { id } = req.params
      
      logger.info('Get detailed application endpoint called', { 
        userId: req.user.id,
        applicationId: id 
      })

      const application = await this.applicationService.getApplicationDetailsById(id)

      res.status(200).json(
        ApiResponseUtil.success(
          application,
          'Application details retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching detailed application', { 
        error, 
        userId: req.user?.id,
        applicationId: req.params.id 
      })
      next(error)
    }
  }

  public updateApplicationStatusByStaff = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (
        !req.user?.id ||
        !['ADMIN', 'HEAD_OF_ADMISSIONS', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized to update status', 403)
      }

      const { id } = req.params
      const { status, comments } = req.body

      logger.info('Update application status endpoint called', { 
        userId: req.user.id,
        applicationId: id,
        newStatus: status,
        userRole: req.user.role 
      })

      if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
        throw new AppError('Valid application status is required.', 400)
      }

      const application = await this.applicationService.updateApplicationStatus(
        id,
        status as ApplicationStatus,
        comments
      )

      res.status(200).json(
        ApiResponseUtil.success(
          application,
          'Application status updated successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error updating application status', { 
        error, 
        userId: req.user?.id,
        applicationId: req.params.id,
        status: req.body.status 
      })
      next(error)
    }
  }

  public submitFinalApplication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) throw new AppError('User not authenticated.', 401)
      if (req.user.role !== 'APPLICANT') {
        throw new AppError('Only applicants can submit applications.', 403)
      }

      const { applicationId } = req.params
      if (!applicationId) throw new AppError('Application ID is required.', 400)

      logger.info('Submit final application endpoint called', { 
        userId: req.user.id,
        applicationId 
      })

      const application = await this.applicationService.finalizeApplicantSubmission(
        applicationId,
        req.user.id
      )

      res.status(200).json(
        ApiResponseUtil.success(
          application,
          'Application submitted successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error in submitFinalApplication', {
        userId: req.user?.id,
        applicationId: req.params.applicationId,
        error,
      })
      next(error)
    }
  }

  public getAllApplicationsFiltered = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (
        !req.user?.id ||
        !['ADMIN', 'HEAD_OF_ADMISSIONS', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized', 403)
      }

      const {
        status,
        academicSessionId,
        admissionOfficerId,
        unassigned,
        page = 1,
        limit = 10,
      } = req.query

      logger.info('Get filtered applications endpoint called', { 
        userId: req.user.id,
        userRole: req.user.role,
        filters: { status, academicSessionId, admissionOfficerId, unassigned, page, limit }
      })

      const filters = {
        status: status as string | undefined,
        academicSessionId: academicSessionId as string | undefined,
        admissionOfficerId: admissionOfficerId as string | undefined,
        unassigned: unassigned === 'true',
        page: Number(page),
        limit: Number(limit),
      }

      const result = await this.applicationService.getAllApplicationsFiltered(filters)

      res.status(200).json(
        ApiResponseUtil.success(
          result,
          'Filtered applications retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching filtered applications', { 
        error, 
        userId: req.user?.id,
        filters: req.query 
      })
      next(error)
    }
  }

  public getApplicationDetailsById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) throw new AppError('User not authenticated', 401)

      const { id } = req.params

      logger.info('Get application details by ID endpoint called', { 
        userId: req.user.id,
        userRole: req.user.role,
        applicationId: id 
      })

      const application = await this.applicationService.getApplicationDetailsById(id)

      if (req.user.role === 'APPLICANT' && application.applicantUserId !== req.user.id) {
        throw new AppError('Forbidden: You can only view your own application.', 403)
      }

      res.status(200).json(
        ApiResponseUtil.success(
          application,
          'Application details retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching application details by ID', { 
        error, 
        userId: req.user?.id,
        applicationId: req.params.id 
      })
      next(error)
    }
  }

  public getApplicationStatusCounts = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (
        !req.user?.id ||
        !['ADMIN', 'HEAD_OF_ADMISSIONS', 'SUPER_ADMIN'].includes(req.user.role)
      ) {
        throw new AppError('Unauthorized', 403)
      }

      const { academicSessionId } = req.query

      logger.info('Get application status counts endpoint called', { 
        userId: req.user.id,
        userRole: req.user.role,
        academicSessionId 
      })

      const counts = await this.applicationService.getApplicationCountsByStatus(
        academicSessionId as string | undefined
      )

      res.status(200).json(
        ApiResponseUtil.success(
          counts,
          'Application status counts retrieved successfully',
          200
        )
      )
    } catch (error) {
      logger.error('Error fetching application status counts', { 
        error, 
        userId: req.user?.id,
        academicSessionId: req.query.academicSessionId 
      })
      next(error)
    }
  }

  // public assignApplicationToOfficersByDepartments = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     if (!req.user?.id || req.user.role !== "HEAD_OF_ADMISSIONS") {
  //       throw new AppError("Unauthorized: Only Head of Admissions can assign applications.", 403)
  //     }

  //     const { officerIds, departmentIds } = req.body
  //     if (!officerIds.length) throw new AppError("Officer ID is required for assignment.", 400)

  //     logger.info('Assign applications to officers by departments endpoint called', { 
  //       userId: req.user.id,
  //       officerIds,
  //       departmentIds 
  //     })

  //     const application = await this.applicationService.assignToOfficersByDepartments(departmentIds, officerIds)
  
  //     res.status(200).json(
  //       ApiResponseUtil.success(
  //         application,
  //         'Applications assigned to officers successfully',
  //         200
  //       )
  //     )
  //   } catch (error) {
  //     logger.error('Error assigning applications to officers', { 
  //       error, 
  //       userId: req.user?.id,
  //       officerIds: req.body.officerIds,
  //       departmentIds: req.body.departmentIds 
  //     })
  //     next(error)
  //   }
  // }
}

export default new ApplicationController()