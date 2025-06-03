import Application, { ApplicationStatus } from "../models/Application"
import User from "../models/User"
import Biodata from "../models/Biodata"
import AcademicSession from "../models/AcademicSession"
import AdmissionOfficer from "../models/AdmissionOfficer"
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"

interface ApplicationFilters {
  status?: string
  academicSessionId?: number
  admissionOfficerId?: number
  page: number
  limit: number
}

class ApplicationService {
  // Create new application
  static async createApplication(data: {
    userId: number
    academicSessionId: number
    programId:number,
    status: "APPLICATION_PAID"
  }) {
    try {
      // Check if user already has an application for this session
      const existingApplication = await Application.findOne({
        where: {
          userId: data.userId,
          academicSessionId: data.academicSessionId,
        },
      })

      if (existingApplication) {
        throw new AppError("Application already exists for this session", 400)
      }

      const application = await Application.create(data)

      // Create empty biodata record
      await Biodata.create({ applicationId: application.id })

      logger.info("Application created successfully", { applicationId: application.id })
      return application
    } catch (error) {
      logger.error("Error creating application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to create application", 500)
    }
  }

  // Get application by ID with all related data
  static async getApplicationById(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: Biodata,
            as: "bioData",
          },
          {
            model: AcademicSession,
            as: "academicSession",
          },
          {
            model: AdmissionOfficer,
            as: "admissionOfficer",
          },
        ],
      })

      if (!application) {
        throw new AppError("Application not found", 404)
      }

      return application
    } catch (error) {
      logger.error("Error fetching application", { error, id })
      throw error instanceof AppError ? error : new AppError("Failed to fetch application", 500)
    }
  }

  // Get applications by user ID
  static async getApplicationsByUserId(userId: number) {
    try {
      const applications = await Application.findAll({
        where: { userId },
        include: [
          {
            model: Biodata,
            as: "bioData",
          },
          {
            model: AcademicSession,
            as: "academicSession",
          },
          {
            model: AdmissionOfficer,
            as: "admissionOfficer",
          },
        ],
        order: [["createdAt", "DESC"]],
      })

      return applications
    } catch (error) {
      logger.error("Error fetching user applications", { error, userId })
      throw new AppError("Failed to fetch applications", 500)
    }
  }

  // Get all applications with filters and pagination
  static async getAllApplications(filters: ApplicationFilters) {
    try {
      const { status, academicSessionId, admissionOfficerId, page, limit } = filters
      const offset = (page - 1) * limit

      const whereClause: any = {}
      if (status) whereClause.status = status
      if (academicSessionId) whereClause.academicSessionId = academicSessionId
      if (admissionOfficerId) whereClause.admissionOfficerId = admissionOfficerId

      const { count, rows } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: Biodata,
            as: "bioData",
          },
          {
            model: AcademicSession,
            as: "academicSession",
          },
          {
            model: AdmissionOfficer,
            as: "admissionOfficer",
          },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      })

      return {
        applications: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    } catch (error) {
      logger.error("Error fetching all applications", { error })
      throw new AppError("Failed to fetch applications", 500)
    }
  }

  // Update application status
  static async updateApplicationStatus(id: number, status: ApplicationStatus, comments?: string) {
    try {
      const application = await Application.findByPk(id)
      if (!application) {
        throw new AppError("Application not found", 404)
      }

      await application.update({ status })

      // Log the status change
      logger.info("Application status updated", {
        applicationId: id,
        oldStatus: application.status,
        newStatus: status,
        comments,
      })

      return application
    } catch (error) {
      logger.error("Error updating application status", { error })
      throw error instanceof AppError ? error : new AppError("Failed to update status", 500)
    }
  }

  // Assign application to admission officer
  static async assignToOfficer(applicationId: number, officerId: number) {
    try {
      const application = await Application.findByPk(applicationId)
      if (!application) {
        throw new AppError("Application not found", 404)
      }

      const officer = await AdmissionOfficer.findByPk(officerId)
      if (!officer) {
        throw new AppError("Admission officer not found", 404)
      }

      await application.update({ admissionOfficerId: officerId })

      logger.info("Application assigned to officer", { applicationId, officerId })
      return application
    } catch (error) {
      logger.error("Error assigning application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to assign application", 500)
    }
  }

  // Submit application for review
  static async submitApplication(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [{ model: Biodata, as: "bioData" }],
      })

      if (!application) {
        throw new AppError("Application not found", 404)
      }

      // Validate that required sections are completed
      if (!await application.getBioData()) {
        throw new AppError("Biodata must be completed before submission", 400)
      }

      // Update status to submitted
      await application.update({ status: "SUBMITTED" })

      logger.info("Application submitted for review", { applicationId: id })
      return application
    } catch (error) {
      logger.error("Error submitting application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to submit application", 500)
    }
  }
}

export default ApplicationService
