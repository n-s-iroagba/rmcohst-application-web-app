
import logger from './logger';
import { emailService } from './emailService';
import prisma from '../config/database';

export class DocumentVerifier {
  static async verifyDocument(documentId: string, officerId: string, verificationStatus: 'verified' | 'rejected', remarks?: string) {
    try {
      const document = await prisma.document.update({
        where: { id: documentId },
        data: {
          verificationStatus,
          verifiedBy: officerId,
          verificationDate: new Date(),
          remarks
        },
        include: {
          application: {
            include: {
              applicant: true
            }
          }
        }
      });

      // Send notification email based on verification status
      await emailService.sendEmail(
        document.application.applicant.email,
        verificationStatus === 'verified' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
        {
          documentType: document.type,
          remarks: remarks || '',
          name: document.application.applicant.name
        }
      );

      logger.info(`Document ${documentId} ${verificationStatus} by officer ${officerId}`);
      return document;
    } catch (error) {
      logger.error('Document verification failed:', error);
      throw error;
    }
  }

  static async getVerificationStatus(applicationId: string) {
    return prisma.document.findMany({
      where: {
        applicationId
      },
      select: {
        id: true,
        type: true,
        verificationStatus: true,
        verificationDate: true,
        remarks: true,
        verifiedBy: true
      }
    });
  }
}
