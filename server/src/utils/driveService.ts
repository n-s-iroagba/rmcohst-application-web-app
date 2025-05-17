
import { google } from 'googleapis';
import { Readable } from 'stream';
import logger from './logger/logger';


class DriveService {
  private drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async uploadFile(
    fileStream: Readable, 
    fileName: string, 
    mimeType: string, 
    metadata?: { name?: string; parents?: string[]; description?: string }
  ): Promise<string> {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: mimeType,
          ...metadata
        },
        media: {
          mimeType: mimeType,
          body: fileStream
        },
        fields: 'id,webViewLink'
      });

      logger.info('File uploaded to Google Drive', { fileName, fileId: response.data.id });
      return response.data.id || '';
    } catch (error) {
      logger.error('Google Drive upload failed:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    try {
      await this.drive.files.get({
        fileId: fileId,
        fields: 'webViewLink'
      });
      return `https://drive.google.com/file/d/${fileId}/view`;
    } catch (error) {
      logger.error('Failed to get file URL:', error);
      throw new Error('Failed to get file URL');
    }
  }
}

export const driveService = new DriveService();
