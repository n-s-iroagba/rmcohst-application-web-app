import { google, type drive_v3 } from "googleapis" // Import drive_v3 for types
import { Readable } from "stream"
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"

interface DriveConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  refreshToken: string
}

export class DriveService {
  private drive: drive_v3.Drive // Use specific type
  private oauth2Client: any // Consider typing this as well if possible

  constructor() {
    this.initializeAuth()
  }

  private initializeAuth() {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !GOOGLE_REFRESH_TOKEN) {
      logger.error("Google Drive API credentials are not fully configured in environment variables.")
      // Decide if this should throw an error or if the service can operate in a "disabled" mode
      // For now, let it proceed, but operations will fail.
      // throw new AppError("Google Drive API credentials are not fully configured.", 500);
    }

    const config: DriveConfig = {
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      redirectUri: GOOGLE_REDIRECT_URI!,
      refreshToken: GOOGLE_REFRESH_TOKEN!,
    }

    this.oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)
    this.oauth2Client.setCredentials({ refresh_token: config.refreshToken })
    this.drive = google.drive({ version: "v3", auth: this.oauth2Client })
  }

  // Uploads a file and returns its Google Drive ID and webViewLink (for direct access if public)
  async uploadFile(
    fileName: string,
    fileContent: Buffer | Readable,
    mimeType: string,
    folderId?: string, // Specific folder ID for this upload
  ): Promise<{ id: string; webViewLink: string | null | undefined; webContentLink: string | null | undefined }> {
    if (!this.drive) {
      logger.error("Drive service not initialized due to missing credentials.")
      throw new AppError("Drive service not available.", 503)
    }
    try {
      let mediaBody: Readable
      if (Buffer.isBuffer(fileContent)) {
        mediaBody = new Readable()
        mediaBody.push(fileContent)
        mediaBody.push(null)
      } else {
        mediaBody = fileContent
      }

      const fileMetadata: drive_v3.Params$Resource$Files$Create$RequestBody = {
        name: fileName,
      }
      if (folderId) {
        fileMetadata.parents = [folderId]
      } else {
        // Fallback to a general folder if no specific one is provided, or handle as an error
        const generalFolderId = process.env.GOOGLE_DRIVE_GENERAL_UPLOADS_FOLDER_ID
        if (generalFolderId) {
          fileMetadata.parents = [generalFolderId]
        } else {
          logger.warn("No specific or general Google Drive folder ID provided for upload.")
          // Depending on policy, this could be an error or upload to root (not recommended)
        }
      }

      const media = { mimeType, body: mediaBody }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id, name, webViewLink, webContentLink", // webContentLink for direct download if permissions allow
      })

      if (!response.data.id) {
        throw new AppError("Failed to get file ID from Google Drive response.", 500)
      }

      // Make file publicly readable (consider security implications carefully)
      // This might not be desired for all document types.
      // Permissions should be managed based on application requirements.
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: "reader",
          type: "anyone", // WARNING: Makes the file public
        },
      })
      logger.info(`File uploaded to Google Drive: ${fileName}, ID: ${response.data.id}`)
      return {
        id: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      }
    } catch (error: any) {
      logger.error("Error uploading file to Google Drive:", {
        fileName,
        folderId,
        errorMessage: error.message,
        errorStack: error.stack,
      })
      throw new AppError(`Google Drive upload failed: ${error.message}`, 500)
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    if (!this.drive) {
      logger.error("Drive service not initialized.")
      throw new AppError("Drive service not available.", 503)
    }
    try {
      await this.drive.files.delete({ fileId: fileId })
      logger.info(`File deleted from Google Drive: ${fileId}`)
    } catch (error: any) {
      logger.error("Error deleting file from Google Drive:", { fileId, errorMessage: error.message })
      throw new AppError(`Google Drive file deletion failed: ${error.message}`, 500)
    }
  }

  // Other methods (createFolder, getFileMetadata, listFiles) remain the same
  // ... (keep existing methods)
  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    if (!this.drive) {
      logger.error("Drive service not initialized.")
      throw new AppError("Drive service not available.", 503)
    }
    try {
      const fileMetadata: any = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      }

      if (parentFolderId) {
        fileMetadata.parents = [parentFolderId]
      }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: "id,name",
      })
      if (!response.data.id) {
        throw new AppError("Failed to get folder ID from Google Drive response.", 500)
      }
      return response.data.id
    } catch (error: any) {
      console.error("Error creating folder in Google Drive:", error)
      throw new AppError("Failed to create folder", 500)
    }
  }

  async getFileMetadata(fileId: string) {
    if (!this.drive) {
      logger.error("Drive service not initialized.")
      throw new AppError("Drive service not available.", 503)
    }
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: "id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink",
      })
      return response.data
    } catch (error: any) {
      console.error("Error getting file metadata:", error)
      throw new AppError("Failed to get file metadata", 500)
    }
  }

  async listFiles(folderId?: string, pageSize = 10) {
    if (!this.drive) {
      logger.error("Drive service not initialized.")
      throw new AppError("Drive service not available.", 503)
    }
    try {
      let query = "trashed=false"
      if (folderId) {
        query += ` and '${folderId}' in parents`
      }
      const response = await this.drive.files.list({
        q: query,
        pageSize: pageSize,
        fields:
          "nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink)",
      })
      return response.data.files || []
    } catch (error: any) {
      console.error("Error listing files:", error)
      throw new AppError("Failed to list files", 500)
    }
  }
}

export const driveService = new DriveService()
