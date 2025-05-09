
import { Application } from '@prisma/client';
import prisma from '../config/database';
import logger from './logger';

export interface TaskPriority {
  applicationId: string;
  score: number;
  factors: {
    waitingTime: number;
    documentsComplete: boolean;
    departmentQuota: boolean;
  }
}

export class TaskPriorityCalculator {
  static async calculatePriority(application: Application): Promise<TaskPriority> {
    try {
      const waitingTime = Date.now() - new Date(application.submittedAt).getTime();
      const waitingDays = Math.floor(waitingTime / (1000 * 60 * 60 * 24));
      
      // Check document completeness
      const documents = await prisma.document.findMany({
        where: { applicationId: application.id }
      });
      const documentsComplete = documents.length >= 2; // Minimum required docs
      
      // Check department quota
      const departmentApplications = await prisma.application.count({
        where: {
          departmentId: application.departmentId,
          status: 'Accepted'
        }
      });
      const departmentQuota = departmentApplications < 100; // Example quota
      
      // Calculate priority score
      const score = (waitingDays * 10) + 
                    (documentsComplete ? 50 : 0) + 
                    (departmentQuota ? 30 : -20);
      
      return {
        applicationId: application.id,
        score,
        factors: {
          waitingTime: waitingDays,
          documentsComplete,
          departmentQuota
        }
      };
    } catch (error) {
      logger.error('Error calculating task priority:', error);
      throw error;
    }
  }
}
