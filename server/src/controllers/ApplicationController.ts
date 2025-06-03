import type { Response } from "express"
import ApplicationService from "../services/ApplicationService"
import type { AuthRequest } from "../middleware/auth"
import logger from "../utils/logger/logger"

class ApplicationController {
  // Create new application
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { academicSessionId, programId } = req.body
      const userId = req.user?.id

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" })
        return
      }

      const application = await ApplicationService.createApplication({
        userId,
        academicSessionId,
        status: "APPLICATION_PAID",
        programId
      })

      logger.info("Application created", { applicationId: application.id, userId })
      res.status(201).json({ data: application })
    } catch (error) {
      logger.error("Error creating application", { error })
      res.status(500).json({ error: "Failed to create application" })
    }
  }

  // Get application by ID
  static async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const application = await ApplicationService.getApplicationById(Number.parseInt(id))

      res.json({ data: application })
    } catch (error) {
      logger.error("Error fetching application", { error, id: req.params.id })
      res.status(404).json({ error: "Application not found" })
    }
  }

  // Get applications for current user
  static async getMyApplications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" })
        return
      }

      const applications = await ApplicationService.getApplicationsByUserId(userId)
      res.json({ data: applications })
    } catch (error) {
      logger.error("Error fetching user applications", { error })
      res.status(500).json({ error: "Failed to fetch applications" })
    }
  }

  // Get all applications (admin only)
  static async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, academicSessionId, admissionOfficerId, page = 1, limit = 10 } = req.query

      const filters = {
        status: status as string,
        academicSessionId: academicSessionId ? Number.parseInt(academicSessionId as string) : undefined,
        admissionOfficerId: admissionOfficerId ? Number.parseInt(admissionOfficerId as string) : undefined,
        page: Number.parseInt(page as string),
        limit: Number.parseInt(limit as string),
      }

      const result = await ApplicationService.getAllApplications(filters)
      res.json({ data: result })
    } catch (error) {
      logger.error("Error fetching all applications", { error })
      res.status(500).json({ error: "Failed to fetch applications" })
    }
  }

  // Update application status
  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { status, comments } = req.body

      const application = await ApplicationService.updateApplicationStatus(Number.parseInt(id), status, comments)

      logger.info("Application status updated", { applicationId: id, status })
      res.json({ data: application })
    } catch (error) {
      logger.error("Error updating application status", { error })
      res.status(500).json({ error: "Failed to update application status" })
    }
  }

  // Assign to admission officer
  static async assignToOfficer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { admissionOfficerId } = req.body

      const application = await ApplicationService.assignToOfficer(Number.parseInt(id), admissionOfficerId)

      logger.info("Application assigned to officer", { applicationId: id, officerId: admissionOfficerId })
      res.json({ data: application })
    } catch (error) {
      logger.error("Error assigning application", { error })
      res.status(500).json({ error: "Failed to assign application" })
    }
  }

  // Submit application
  static async submit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const application = await ApplicationService.submitApplication(Number.parseInt(id))

      logger.info("Application submitted", { applicationId: id })
      res.json({ data: application })
    } catch (error) {
      logger.error("Error submitting application", { error })
      res.status(500).json({ error: "Failed to submit application" })
    }
  }
}

export default ApplicationController