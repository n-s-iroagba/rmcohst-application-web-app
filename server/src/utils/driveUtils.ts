// server/src/utils/driveService.ts
import { google, type drive_v3 } from 'googleapis'
import type { Readable } from 'stream'
import appConfig from '../config' // Default import
import logger from './logger/logger' // Assuming logger is default export

let drive: drive_v3.Drive | null = null

try {
  if (appConfig.googleDrive.credentials && appConfig.googleDrive.credentials !== '{}') {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(appConfig.googleDrive.credentials),
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })
    drive = google.drive({ version: 'v3', auth })
  } else {
    logger.warn('Google Drive credentials are not configured. DriveService will not function.')
  }
} catch (error) {
  logger.error('Failed to initialize Google Drive auth:', error)
}

export const uploadFileToDrive = async (
  fileStream: Readable,
  fileName: string,
  mimeType: string,
  folderId?: string // Optional: specific folder ID in Drive
): Promise<{ fileId: string; webViewLink: string } | null> => {
  if (!drive) {
    logger.error('Google Drive service not initialized. Cannot upload file.')
    return null
  }
  try {
    const fileMetadata: any = { name: fileName }
    if (folderId) {
      fileMetadata.parents = [folderId]
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: { mimeType: mimeType, body: fileStream },
      fields: 'id,webViewLink',
    })
    logger.info(`File uploaded to Google Drive: ${fileName}, ID: ${response.data.id}`)
    return { fileId: response.data.id!, webViewLink: response.data.webViewLink! }
  } catch (error) {
    logger.error('Google Drive upload failed:', error)
    throw new Error('Failed to upload file to Google Drive') // Re-throw or handle as needed
  }
}

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  if (!drive) {
    logger.error('Google Drive service not initialized. Cannot delete file.')
    return
  }
  try {
    await drive.files.delete({ fileId: fileId })
    logger.info(`File deleted from Google Drive: ${fileId}`)
  } catch (error) {
    logger.error('Failed to delete file from Google Drive:', error)
    throw new Error('Failed to delete file from Google Drive')
  }
}

// This function name was in the error, assuming it's for multiple files.
// This is a simplified example; true batching might be more complex.
export const uploadFilesToDrive = async (
  files: Array<{ fileStream: Readable; fileName: string; mimeType: string; folderId?: string }>
): Promise<Array<{ fileName: string; result: { fileId: string; webViewLink: string } | null }>> => {
  const results = []
  for (const file of files) {
    try {
      const uploadResult = await uploadFileToDrive(
        file.fileStream,
        file.fileName,
        file.mimeType,
        file.folderId
      )
      results.push({ fileName: file.fileName, result: uploadResult })
    } catch (error) {
      logger.error(`Failed to upload ${file.fileName} in batch:`, error)
      results.push({ fileName: file.fileName, result: null })
    }
  }
  return results
}
