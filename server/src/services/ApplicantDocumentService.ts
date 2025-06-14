import { ApplicantDocument, type ApplicantDocumentCreationAttributes } from "../models/ApplicantDocument"
import { Application, ApplicationStatus } from "../models/Application" // Assuming Application model exists
import { driveService, type DriveService } from "./DriveService" // Assuming DriveService exists
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"
import { type ApplicantDocumentType, isValidApplicantDocumentType } from "../config/documentTypes"

class ApplicantDocumentService {
  private driveServiceInstance: DriveService

  constructor() {
    this.driveServiceInstance = driveService // Use the singleton instance
  }

  async createDocument(
    applicantUserId: string, // To verify ownership of application
    applicationId: string,
    documentType: string, // Comes from client as string
    file: Express.Multer.File, // Multer file object
  ): Promise<ApplicantDocument> {
    // 1. Validate Application and User
    const application = await Application.findOne({
      where: { id: applicationId, applicantUserId },
    })
    if (!application) {
      throw new AppError("Application not found or user mismatch.", 404)
    }
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Documents can only be uploaded to applications in DRAFT status.", 400)
    }

    // 2. Validate Document Type
    if (!isValidApplicantDocumentType(documentType)) {
      throw new AppError(`Invalid document type: ${documentType}`, 400)
    }
    const validDocType = documentType as ApplicantDocumentType

    // 3. Upload to Google Drive (or other storage)
    const folderId = process.env.GOOGLE_DRIVE_APPLICANT_DOCUMENTS_FOLDER_ID
    if (!folderId) {
      logger.error("GOOGLE_DRIVE_APPLICANT_DOCUMENTS_FOLDER_ID is not set.")
      throw new AppError("File storage configuration error.", 500)
    }

    let driveResponse
    try {
      // Sanitize filename or create a unique one
      const uniqueFileName = `${applicationId}_${validDocType.replace(/\s+/g, "_")}_${Date.now()}_${file.originalname}`
      driveResponse = await this.driveServiceInstance.uploadFile(
        uniqueFileName,
        file.buffer, // Assuming file is in buffer from multer memoryStorage
        file.mimetype,
        folderId,
      )
    } catch (uploadError: any) {
      logger.error("Failed to upload document to Drive", { applicationId, documentType, error: uploadError })
      throw new AppError(`Failed to upload file: ${uploadError.message}`, 500)
    }

    if (!driveResponse || !driveResponse.id || !driveResponse.webContentLink) {
      // webContentLink is often better for direct download/linking if permissions allow
      // webViewLink is for viewing in Google Drive UI
      throw new AppError("Failed to get necessary file details from Drive upload.", 500)
    }

    // 4. Create ApplicantDocument record in database
    const documentData: ApplicantDocumentCreationAttributes = {
      applicationId,
      documentType: validDocType,
      fileName: file.originalname, // Store original filename for user display
      fileUrl: driveResponse.webContentLink, // Or webViewLink depending on desired behavior
      googleDriveFileId: driveResponse.id,
      fileSize: file.size,
      mimeType: file.mimetype,
    }

    try {
      const newDocument = await ApplicantDocument.create(documentData)
      logger.info("Applicant document record created", { documentId: newDocument.id, applicationId })
      return newDocument
    } catch (dbError: any) {
      logger.error("Failed to save document record to database after Drive upload", {
        applicationId,
        documentType,
        driveFileId: driveResponse.id,
        error: dbError,
      })
      // Attempt to delete the orphaned file from Drive if DB save fails
      try {
        await this.driveServiceInstance.deleteFile(driveResponse.id)
        logger.info("Orphaned file deleted from Drive after DB error", { driveFileId: driveResponse.id })
      } catch (cleanupError) {
        logger.error("Failed to cleanup orphaned Drive file", { driveFileId: driveResponse.id, cleanupError })
      }
      throw new AppError("Failed to save document information.", 500)
    }
  }

  async getDocumentsByApplicationId(applicationId: string, applicantUserId: string): Promise<ApplicantDocument[]> {
    // Verify user owns the application
    const application = await Application.findOne({
      where: { id: applicationId, applicantUserId },
    })
    if (!application) {
      throw new AppError("Application not found or access denied.", 404)
    }

    return ApplicantDocument.findAll({
      where: { applicationId },
      order: [["createdAt", "ASC"]],
    })
  }

  async deleteDocument(documentId: string, applicantUserId: string): Promise<void> {
    const document = await ApplicantDocument.findByPk(documentId, {
      include: [{ model: Application, as: "application" }],
    })

    if (!document) {
      throw new AppError("Document not found.", 404)
    }
    if (document.application?.applicantUserId !== applicantUserId) {
      throw new AppError("User not authorized to delete this document.", 403)
    }
    if (document.application?.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Documents can only be deleted from applications in DRAFT status.", 400)
    }

    // Delete from Google Drive first
    if (document.googleDriveFileId) {
      try {
        await this.driveServiceInstance.deleteFile(document.googleDriveFileId)
      } catch (driveError: any) {
        logger.error("Failed to delete document from Drive, but proceeding to delete DB record", {
          documentId,
          driveFileId: document.googleDriveFileId,
          error: driveError,
        })
        // Decide on policy: throw error and stop, or just log and delete DB record?
        // For now, log and proceed.
      }
    }

    // Delete from database
    await document.destroy()
    logger.info("Applicant document deleted", { documentId, applicationId: document.applicationId })
  }

  // For Admin view - does not check applicantUserId
  async getDocumentsByApplicationIdForAdmin(applicationId: string): Promise<ApplicantDocument[]> {
    return ApplicantDocument.findAll({
      where: { applicationId },
      order: [["createdAt", "ASC"]],
    })
  }
}

export default new ApplicantDocumentService()
