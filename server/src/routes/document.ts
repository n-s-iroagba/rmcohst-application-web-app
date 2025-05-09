
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// Configure multer for document upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/upload/:type', authMiddleware, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const documentType = req.params.type;
    const validTypes = ['waec', 'birthCertificate'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    const fileStream = fs.createReadStream(req.file.path);
    const driveFileId = await driveService.uploadFile(
      fileStream,
      `${documentType}_${req.body.applicationId}`,
      'application/pdf'
    );

    const driveUrl = await driveService.getFileUrl(driveFileId);

    logger.info('Document uploaded', {
      type: documentType,
      driveFileId,
      user: req.user?.email
    });

    const document = await prisma.document.create({
      data: {
        type: documentType,
        url: driveUrl,
        driveFileId,
        status: 'pending',
        applicationId: req.body.applicationId
      }
    });

    // Cleanup local file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      ...document,
      message: 'Document uploaded successfully'
    });
  } catch (error) {
    logger.error('Document upload error:', error);
    res.status(500).json({ error: 'Document upload failed' });
  }
});

router.get('/status/:type', authMiddleware, (req, res) => {
  try {
    const documentType = req.params.type;
    // TODO: Get document status from database
    res.json({
      type: documentType,
      status: 'pending'
    });
  } catch (error) {
    logger.error('Document status check error:', error);
    res.status(500).json({ error: 'Failed to check document status' });
  }
});

router.put('/:documentId/verify', authMiddleware, async (req, res) => {
  try {
    const { documentId } = req.params;
    const { verificationStatus, remarks } = req.body;
    const officerId = req.user.id;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    const result = await DocumentVerifier.verifyDocument(
      documentId,
      officerId,
      verificationStatus,
      remarks
    );

    res.json(result);
  } catch (error) {
    logger.error('Error in document verification:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

import { documentAccessMiddleware } from '../middleware/documentAccess';

// Get document by ID with access control
router.get('/:documentId', 
  authMiddleware,
  documentAccessMiddleware,
  async (req, res) => {
    try {
      const document = await prisma.document.findUnique({
        where: { id: req.params.documentId }
      });
      res.json(document);
    } catch (error) {
      logger.error('Error fetching document:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
});

// Update document access permissions
router.put('/:documentId/permissions',
  authMiddleware,
  async (req, res) => {
    try {
      const { roles, users } = req.body;
      const document = await prisma.document.update({
        where: { id: req.params.documentId },
        data: {
          accessControl: {
            roles,
            users
          }
        }
      });
      res.json(document);
    } catch (error) {
      logger.error('Error updating document permissions:', error);
      res.status(500).json({ error: 'Failed to update document permissions' });
    }
});

router.get('/application/:applicationId/verification-status', 
  authMiddleware, 
  async (req, res) => {
  try {
    const { applicationId } = req.params;
    const status = await DocumentVerifier.getVerificationStatus(applicationId);
    res.json(status);
  } catch (error) {
    logger.error('Error fetching verification status:', error);
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
});

export default router;
