import type { Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "../middleware/auth" // Your custom request type
import ApplicantDocumentService from "../services/ApplicantDocumentService"
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"

class ApplicantDocumentController {
  // Upload a new document for an application
  public uploadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return next(new AppError("User not authenticated.", 401))
      }
      if (!req.file) {
        return next(new AppError("No file uploaded.", 400))
      }

      const { applicationId } = req.params // Assuming applicationId is in route params
      const { documentType } = req.body // Document type from form data

      if (!applicationId) {
        return next(new AppError("Application ID is required.", 400))
      }
      if (!documentType) {
        return next(new AppError("Document type is required.", 400))
      }

      const document = await ApplicantDocumentService.createDocument(req.user.id, applicationId, documentType, req.file)

      res.status(201).json({ message: "Document uploaded successfully.", data: document })
    } catch (error) {
      logger.error("Error in uploadDocument controller", {
        userId: req.user?.id,
        applicationId: req.params.applicationId,
        file: req.file?.originalname,
        error,
      })
      next(error)
    }
  }

  // Get all documents for a specific application (applicant view)
  public getMyApplicationDocuments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return next(new AppError("User not authenticated.", 401))
      }
      const { applicationId } = req.params
      if (!applicationId) {
        return next(new AppError("Application ID is required.", 400))
      }

      const documents = await ApplicantDocumentService.getDocumentsByApplicationId(applicationId, req.user.id)
      res.status(200).json({ data: documents })
    } catch (error) {
      logger.error("Error in getMyApplicationDocuments controller", {
        userId: req.user?.id,
        applicationId: req.params.applicationId,
        error,
      })
      next(error)
    }
  }

  // Delete a specific document (applicant view)
  public deleteMyDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        return next(new AppError("User not authenticated.", 401))
      }
      const { documentId } = req.params // Assuming documentId is in route params
      if (!documentId) {
        return next(new AppError("Document ID is required.", 400))
      }

      await ApplicantDocumentService.deleteDocument(documentId, req.user.id)
      res.status(200).json({ message: "Document deleted successfully." })
    } catch (error) {
      logger.error("Error in deleteMyDocument controller", {
        userId: req.user?.id,
        documentId: req.params.documentId,
        error,
      })
      next(error)
    }
  }

  // --- Admin specific methods ---

  // Get all documents for a specific application (admin view)
  public getApplicationDocumentsForAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Ensure user is an admin/HOA (add role check from req.user.role)
      if (!req.user?.role || !["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"].includes(req.user.role)) {
        return next(new AppError("Unauthorized.", 403))
      }
      const { applicationId } = req.params
      if (!applicationId) {
        return next(new AppError("Application ID is required.", 400))
      }

      const documents = await ApplicantDocumentService.getDocumentsByApplicationIdForAdmin(applicationId)
      res.status(200).json({ data: documents })
    } catch (error) {
      logger.error("Error in getApplicationDocumentsForAdmin controller", {
        adminUserId: req.user?.id,
        applicationId: req.params.applicationId,
        error,
      })
      next(error)
    }
  }
}

export default new ApplicantDocumentController()
