// server/src/services/AdmissionLetterService.ts
import { google } from "googleapis"
import { Readable } from "stream"
import appConfig from "../config" // Default import
import logger from "../utils/logger/logger" // Assuming logger is default export
// import { generatePdfFromHtml } from '../utils/pdfGenerator'; // Assuming you have a PDF generator

class AdmissionLetterServiceImpl {
  // Renamed to avoid conflict if class is also named AdmissionLetterService
  private drive

  constructor() {
    if (!appConfig.googleDrive.credentials || appConfig.googleDrive.credentials === "{}") {
      logger.warn("Google Drive credentials are not configured. AdmissionLetterService may not function fully.")
      // Fallback or limited functionality if credentials are not set
      this.drive = null
      return
    }
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(appConfig.googleDrive.credentials),
        scopes: ["https://www.googleapis.com/auth/drive.file"],
      })
      this.drive = google.drive({ version: "v3", auth })
    } catch (error) {
      logger.error("Failed to initialize Google Drive auth for AdmissionLetterService:", error)
      this.drive = null
    }
  }

  public async generateAndUploadLetter(
    applicationId: string,
    studentName: string,
    programName: string,
  ): Promise<string | null> {
    if (!this.drive) {
      logger.error("Drive service not initialized in AdmissionLetterService.")
      return null
    }
    // 1. Generate PDF content (e.g., from an HTML template)
    // const htmlContent = `<h1>Admission Letter</h1><p>Dear ${studentName}, ... for ${programName}</p>`;
    // const pdfBuffer = await generatePdfFromHtml(htmlContent);
    const pdfBuffer = Buffer.from("Dummy PDF content for " + studentName) // Placeholder

    // 2. Upload to Google Drive
    const fileName = `Admission_Letter_${studentName.replace(/\s+/g, "_")}_${applicationId}.pdf`
    const fileMetadata = {
      name: fileName,
      parents: appConfig.googleDrive.admissionLettersFolderId
        ? [appConfig.googleDrive.admissionLettersFolderId]
        : undefined,
    }
    const media = {
      mimeType: "application/pdf",
      body: Readable.from(pdfBuffer),
    }

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id,webViewLink",
      })
      logger.info(`Admission letter uploaded: ${fileName}, ID: ${response.data.id}`)
      return response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view` // Return the view link
    } catch (error) {
      logger.error("Failed to upload admission letter to Google Drive:", error)
      return null
    }
  }
}

// Export an instance or the class itself as named export
export const AdmissionLetterService = new AdmissionLetterServiceImpl()
