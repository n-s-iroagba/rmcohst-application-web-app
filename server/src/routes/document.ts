
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
    
    if (!validTypes.includes(documentType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    logger.info('Document uploaded', {
      type: documentType,
      filename: req.file.filename,
      user: req.user?.email
    });

    const document = await prisma.document.create({
      data: {
        type: documentType,
        url: req.file.filename,
        applicationId: req.body.applicationId
      }
    });

    res.status(201).json({
      ...document,
      message: 'Document uploaded successfully',
      filename: req.file.filename
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

export default router;
