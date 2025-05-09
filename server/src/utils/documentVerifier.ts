
import { logger } from './logger';
import { driveService } from './driveService';

export interface Document {
  type: string;
  fileType: string;
  size: number;
  driveFileId?: string;
}

export interface VerificationResult {
  isValid: boolean;
  error?: string;
  metadata?: {
    documentType: string;
    verifiedAt: Date;
    fileSize: number;
    driveFileId?: string;
    driveUrl?: string;
  };
}

const ALLOWED_FILE_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function verifyDocument(document: Document): Promise<VerificationResult> {
  try {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(document.fileType)) {
      return {
        isValid: false,
        error: 'Invalid file type'
      };
    }

    // Check file size
    if (document.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size exceeds limit'
      };
    }

    let driveUrl;
    if (document.driveFileId) {
      driveUrl = await driveService.getFileUrl(document.driveFileId);
    }

    // Additional document-specific validations
    switch (document.type) {
      case 'WAEC':
      case 'BIRTH_CERT':
        return {
          isValid: true,
          metadata: {
            documentType: document.type,
            verifiedAt: new Date(),
            fileSize: document.size,
            driveFileId: document.driveFileId,
            driveUrl
          }
        };
      default:
        return {
          isValid: false,
          error: 'Unsupported document type'
        };
    }
  } catch (error) {
    logger.error('Document verification error:', error);
    return {
      isValid: false,
      error: 'Verification process failed'
    };
  }
}

export async function getVerificationStatus(applicationId: string): Promise<Record<string, VerificationResult>> {
  try {
    const documents = await prisma.document.findMany({
      where: { applicationId }
    });

    const results: Record<string, VerificationResult> = {};
    for (const doc of documents) {
      results[doc.type] = await verifyDocument({
        type: doc.type,
        fileType: doc.fileType,
        size: doc.size,
        driveFileId: doc.driveFileId
      });
    }

    return results;
  } catch (error) {
    logger.error('Error getting verification status:', error);
    throw error;
  }
}
