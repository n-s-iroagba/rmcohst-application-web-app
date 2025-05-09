
import { Application } from '../models/application';
import prisma from '../config/database';

export interface ScoreWeights {
  academicScore: number;
  documentCompleteness: number;
  programFit: number;
  entranceExam: number;
}

export interface EvaluationCriteria {
  minimumWAECScore: number;
  requiredDocuments: string[];
  programPrerequisites: Record<string, string[]>;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  academicScore: 0.4,
  documentCompleteness: 0.2,
  programFit: 0.3,
  entranceExam: 0.1
};

const EVALUATION_CRITERIA: EvaluationCriteria = {
  minimumWAECScore: 180,
  requiredDocuments: ['WAEC', 'BIRTH_CERT', 'PASSPORT'],
  programPrerequisites: {
    'Medical Laboratory': ['Biology', 'Chemistry'],
    'Nursing': ['Biology', 'Chemistry', 'Physics'],
    'Pharmacy': ['Chemistry', 'Mathematics']
  }
};

export class ApplicationScoring {
  static async evaluateApplication(applicationId: string, weights: ScoreWeights = DEFAULT_WEIGHTS): Promise<{
    totalScore: number;
    breakdown: Record<string, number>;
    recommendations: string[];
  }> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        documents: true,
        academicRecords: true
      }
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const academicScore = this.calculateAcademicScore(application);
    const documentScore = this.evaluateDocuments(application.documents);
    const programScore = this.evaluateProgramFit(application);
    const examScore = this.getEntranceExamScore(application);

    const totalScore = (
      academicScore * weights.academicScore +
      documentScore * weights.documentCompleteness +
      programScore * weights.programFit +
      examScore * weights.entranceExam
    );

    const recommendations = this.generateRecommendations(
      academicScore,
      documentScore,
      programScore,
      examScore
    );

    return {
      totalScore,
      breakdown: {
        academicScore,
        documentScore,
        programScore,
        examScore
      },
      recommendations
    };
  }

  private static calculateAcademicScore(application: any): number {
    // Calculate based on WAEC scores and other academic records
    const waecScore = application.academicRecords?.waecScore || 0;
    return Math.min(waecScore / EVALUATION_CRITERIA.minimumWAECScore, 1);
  }

  private static evaluateDocuments(documents: any[]): number {
    const submittedDocs = new Set(documents.map(doc => doc.type));
    const requiredCount = EVALUATION_CRITERIA.requiredDocuments.length;
    const submittedCount = EVALUATION_CRITERIA.requiredDocuments.filter(
      doc => submittedDocs.has(doc)
    ).length;
    
    return submittedCount / requiredCount;
  }

  private static evaluateProgramFit(application: any): number {
    const program = application.program;
    const prerequisites = EVALUATION_CRITERIA.programPrerequisites[program] || [];
    const userSubjects = application.academicRecords?.subjects || [];
    
    const matchingPrereqs = prerequisites.filter(
      prereq => userSubjects.includes(prereq)
    );
    
    return prerequisites.length ? matchingPrereqs.length / prerequisites.length : 1;
  }

  private static getEntranceExamScore(application: any): number {
    return application.entranceExamScore ? 
      Math.min(application.entranceExamScore / 100, 1) : 0;
  }

  private static generateRecommendations(
    academicScore: number,
    documentScore: number,
    programScore: number,
    examScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (academicScore < 0.6) {
      recommendations.push('Academic scores below threshold');
    }
    if (documentScore < 1) {
      recommendations.push('Missing required documents');
    }
    if (programScore < 0.7) {
      recommendations.push('Program prerequisites not fully met');
    }
    if (examScore < 0.5) {
      recommendations.push('Entrance exam score needs improvement');
    }

    return recommendations;
  }
}
