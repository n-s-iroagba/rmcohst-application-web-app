
import { google } from 'googleapis';
import { Readable } from 'stream';
import { AppError } from '../utils/error/AppError';

interface DriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
}

export class DriveService {
  private drive: any;
  private oauth2Client: any;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const config: DriveConfig = {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
    };

    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    this.oauth2Client.setCredentials({
      refresh_token: config.refreshToken,
    });

    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async uploadFile(
    fileName: string, 
    fileContent: Buffer | Readable, 
    mimeType: string,
    folderId?: string
  ): Promise<string> {
    try {
      // Convert Buffer to Readable stream if necessary
      let mediaBody: Readable;
      
      if (Buffer.isBuffer(fileContent)) {
        mediaBody = new Readable();
        mediaBody.push(fileContent);
        mediaBody.push(null);
      } else {
        mediaBody = fileContent;
      }

      const fileMetadata: any = {
        name: fileName,
      };

      // If folderId is provided, set the parent folder
      if (folderId) {
        fileMetadata.parents = [folderId];
      }

      const media = {
        mimeType,
        body: mediaBody,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink',
      });

      // Make file publicly readable (optional - adjust permissions as needed)
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return response.data.id;
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      throw new AppError('Failed to upload file',500);
    }
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    try {
      const fileMetadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
      }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id,name',
      });

      return response.data.id;
    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      throw new AppError('Failed to create folder',500);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      throw new AppError('Failed to delete file',500);
    }
  }

  async getFileMetadata(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id,name,mimeType,size,createdTime,modifiedTime,webViewLink,webContentLink',
      });

      return response.data;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new AppError('Failed to get file metadata',500);
    }
  }

  async listFiles(folderId?: string, pageSize: number = 10) {
    try {
      let query = "trashed=false";
      
      if (folderId) {
        query += ` and '${folderId}' in parents`;
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize: pageSize,
        fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime)',
      });

      return response.data.files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new AppError('Failed to list files',500);
    }
  }
}

export const driveService = new DriveService();
