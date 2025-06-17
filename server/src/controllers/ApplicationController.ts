import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "../middleware/auth" // Your custom request type
import ApplicationService from "../services/ApplicationService"
import { ApplicationStatus } from "../models/Application"
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"


export class ApplicationController {
  private applicationService: ApplicationService

  constructor() {
    this.applicationService = new ApplicationService()
  }
   public createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
       try {
  
      const application = await this.applicationService.createInitialApplication(req.user.id,req.body)
      res.status(200).json(application)
    } catch (error) {
      next(error)
    }
  }

  public getAllApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User not authenticated", 401)
      const applications = await this.applicationService.getAllApplicationsFiltered({})
      res.status(200).json(applications)
    } catch (error) {
      next(error)
    }
  }

  public getMyCurrentDetailedApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("User not authenticated", 401)
      const { id } = req.params
      const application = await this.applicationService.getApplicationDetailsById(id)
      res.status(200).json(application)
    } catch (error) {
      next(error)
    }
  }

  public updateApplicationStatusByStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id || !["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"].includes(req.user.role)) {
        throw new AppError("Unauthorized to update status", 403)
      }
      const { id } = req.params
      const { status, comments } = req.body
      if (!status || !Object.values(ApplicationStatus).includes(status as ApplicationStatus)) {
        throw new AppError("Valid application status is required.", 400)
      }
      const application = await this.applicationService.updateApplicationStatus(
        id,
        status as ApplicationStatus,
        comments,
      )
      res.status(200).json({ data: application })
    } catch (error) {
      next(error)
    }
  }




  // New controller method for final submission
  public submitFinalApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) throw new AppError("User not authenticated.", 401)
      if (req.user.role !== "APPLICANT") {
        throw new AppError("Only applicants can submit applications.", 403)
      }
      const { applicationId } = req.params // Application ID from route
      if (!applicationId) throw new AppError("Application ID is required.", 400)

      const application = await this.applicationService.finalizeApplicantSubmission(applicationId,req.user.id)
      res.status(200).json({ data: application }) // Wrap in data object
    } catch (error) {
      logger.error("Error in submitFinalApplication", {
        userId: req.user?.id,
        applicationId: req.params.applicationId,
        error,
      })
      next(error)
    }
  }

  // --- Admin/HOA specific methods ---
  public getAllApplicationsFiltered = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id || !["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"].includes(req.user.role)) {
        throw new AppError("Unauthorized", 403)
      }
      // Extract filters from req.query, provide defaults for pagination
      const { status, academicSessionId, admissionOfficerId, unassigned, page = 1, limit = 10 } = req.query
      const filters = {
        status: status as string | undefined,
        academicSessionId: academicSessionId as string | undefined,
        admissionOfficerId: admissionOfficerId as string | undefined,
        unassigned: unassigned === "true",
        page: Number(page),
        limit: Number(limit),
      }
      const result = await this.applicationService.getAllApplicationsFiltered(filters)
      res.status(200).json({ data: result })
    } catch (error) {
      next(error)
    }
  }

  public getApplicationDetailsById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) throw new AppError("User not authenticated", 401)
      const { id } = req.params
      // Add role-based access check: applicant can only see their own, admin their assigned, HOA/SuperAdmin all.
      const application = await this.applicationService.getApplicationDetailsById(id)
      if (req.user.role === "APPLICANT" && application.applicantUserId !== req.user.id) {
        throw new AppError("Forbidden: You can only view your own application.", 403)
      }
      // Further checks for ADMISSION_OFFICER if they should only see assigned ones.
      res.status(200).json({ data: application })
    } catch (error) {
      next(error)
    }
  }

  public getApplicationStatusCounts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id || !["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"].includes(req.user.role)) {
        throw new AppError("Unauthorized", 403)
      }
      const { academicSessionId } = req.query // Optional filter by session
      const counts = await this.applicationService.getApplicationCountsByStatus(academicSessionId as string | undefined)
      res.status(200).json({ data: counts })
    } catch (error) {
      next(error)
    }
  }


  // public assignApplicationToOfficersByDepartments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //   try {
  //     if (!req.user?.id || req.user.role !== "HEAD_OF_ADMISSIONS") {
  //       throw new AppError("Unauthorized: Only Head of Admissions can assign applications.", 403)
  //     }

  //     const { officerIds, departmentIds } = req.body
  //     if (!officerIds.length) throw new AppError("Officer ID is required for assignment.", 400)

  //     const application = await this.applicationService.assignToOfficersByDepartments(departmentIds, officerIds)
  //     res.status(200).json({ data: application })
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}

export default new ApplicationController()
