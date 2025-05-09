
import { Application } from '../models';
import { emailService } from './emailService';
import { DocumentVerifier } from './documentVerifier';
import { prisma } from '../config/database';
import logger from './logger';

export class BatchProcessor {
  static async processBatchApplications(applicationIds: string[]) {
    const results = {
      processed: 0,
      failed: 0,
      details: [] as { id: string; status: string; error?: string }[]
    };

    for (const id of applicationIds) {
      try {
        const application = await prisma.application.findUnique({
          where: { id },
          include: { documents: true, applicant: true }
        });

        if (!application) {
          results.failed++;
          results.details.push({ id, status: 'failed', error: 'Application not found' });
          continue;
        }

        // Verify all documents
        const docsVerified = await DocumentVerifier.verifyAllDocuments(application.documents);
        
        // Update application status
        const newStatus = docsVerified ? 'ReadyForDecision' : 'DocumentsIncomplete';
        await prisma.application.update({
          where: { id },
          data: { status: newStatus }
        });

        // Send notification email
        await emailService.sendStatusUpdate(
          application.applicant.email,
          newStatus,
          application.id
        );

        results.processed++;
        results.details.push({ id, status: 'success' });

      } catch (error) {
        logger.error(`Batch processing failed for application ${id}:`, error);
        results.failed++;
        results.details.push({ 
          id, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return results;
  }
}
