import { Request, Response, NextFunction } from 'express'
import ApplicationService from '../services/ApplicationService'
import { verifyPaystackTransaction } from '../utils/paystack'
import logger from '../utils/logger'

export class ApplicationController {
  static async createApplicationAfterPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantUserId, sessionId, programId, paymentReference } = req.body

      // Verify Paystack payment
      const isValidPayment = await verifyPaystackTransaction(paymentReference)
      if (!isValidPayment) {
        res.status(400).json({ message: 'Payment verification failed' })
      }

      const application = await new ApplicationService().createInitialApplication(applicantUserId, {
        sessionId,
        programId,
      })

      res.status(201).json(application)
    } catch (error) {
      next(error)
    }
  }

  static async getApplicationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const application = await new ApplicationService().getApplicationDetailsById(id)
      res.json(application)
    } catch (error) {
      next(error)
    }
  }

  static async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query
      const result = await new ApplicationService().getAllApplicationsFiltered(filters)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  static async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params
      const { applicantUserId } = req.body

      const submission = await new ApplicationService().finalizeApplicantSubmissionTypeSafe(
        applicationId,
        applicantUserId
      )

      res.status(200).json(submission)
    } catch (error) {
      next(error)
    }
  }

  static async assignApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId, officerId } = req.body
      const result = await new ApplicationService().assignToOfficer(applicationId, officerId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  static async getStatusCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { academicSessionId } = req.query
      const result = await new ApplicationService().getApplicationCountsByStatus(
        academicSessionId as string
      )
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status, comments } = req.body
      const updated = await new ApplicationService().updateApplicationStatus(id, status, comments)
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }
}
