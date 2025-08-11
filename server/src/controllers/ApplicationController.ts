
import { Request, Response, NextFunction } from 'express'
import ApplicationService from '../services/ApplicationService'
const applicationService = new ApplicationService()
export class ApplicationController {
 static async getApplicationPaymentStatus(req:Request, res:Response,next:NextFunction){
  try{
    const {applicantUserId} = req.params
    const statusAndMostRecentPayment =await applicationService.getApplcationPaymentStatus(applicantUserId)
    console.log(statusAndMostRecentPayment)
    res.status(200).json(statusAndMostRecentPayment)
  }catch(error){
    next(error)
  }
 }

  static async getApplicationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const application = await applicationService.getApplicationById(id)
      res.json(application)
    } catch (error) {
      next(error)
    }
  }

  static async getApplicationByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantUserId } = req.params
      const application = await applicationService.getApplicationByUserId(applicantUserId)
      if(application){
          res.json(application)
    
      }
        res.end()
    } catch (error) {
      next(error)
    }
  }
  static async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query
      const result = await  applicationService.getAllApplicationsFiltered(filters)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  static async submitApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params
      const { applicantUserId } = req.body

      const submission = await applicationService.finalizeApplicantSubmission(
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
      const result = await applicationService.assignToOfficer(applicationId, officerId)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  static async getStatusCounts(req: Request, res: Response, next: NextFunction) {
    try {
      const { academicSessionId } = req.query
      const result = await applicationService.getApplicationCountsByStatus(
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
      const updated = applicationService.updateApplicationStatus(id, status, comments)
      res.json(updated)
    } catch (error) {
      next(error)
    }
  }
}
