
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import logger from '../utils/logger';

interface DocumentRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

export async function documentAccessMiddleware(
  req: DocumentRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const documentId = req.params.documentId;
    const userId = req.user?.id;
    const userRoles = req.user?.roles || [];

    // Super admin has access to all documents
    if (userRoles.includes('superadmin')) {
      return next();
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        application: {
          select: {
            applicantId: true,
            assignedTo: true,
            departmentId: true
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Applicant can access their own documents
    if (document.application.applicantId === userId) {
      return next();
    }

    // Admission officer can access documents they're assigned to
    if (userRoles.includes('officer') && document.application.assignedTo === userId) {
      return next();
    }

    // Department head can access documents in their department
    if (userRoles.includes('hod') && 
        await prisma.departmentHead.findFirst({
          where: {
            userId,
            departmentId: document.application.departmentId
          }
        })) {
      return next();
    }

    logger.warn(`Unauthorized document access attempt by user ${userId} for document ${documentId}`);
    res.status(403).json({ error: 'Unauthorized access to document' });
  } catch (error) {
    logger.error('Error in document access middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
