import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';
import prisma from '../utils/db';

const router = Router();

router.get('/:applicationId/letter', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        applicant: true,
        program: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const pdfPath = await PDFGenerator.generateAdmissionLetter({
      studentName: `${application.applicant.firstName} ${application.applicant.lastName}`,
      studentId: application.studentId,
      program: application.program.name,
      startDate: application.startDate,
      academicYear: '2024/2025',
      requirements: [
        'Original WAEC Certificate',
        'Medical Examination Report',
        'Two Passport Photographs',
        'Proof of Payment of Acceptance Fee'
      ]
    });

    // Create application-specific folder in Google Drive
    const folderMetadata = {
      name: `RMCOHST_${application.studentId}_documents`,
      mimeType: 'application/vnd.google-apps.folder',
      description: `Archive folder for student ${application.studentId}`
    };

    const folder = await driveService.drive.files.create({
      requestBody: folderMetadata,
      fields: 'id'
    });

    // Upload admission letter to the folder
    const fileStream = fs.createReadStream(pdfPath);
    const fileName = `admission_letter_${application.studentId}_${new Date().toISOString()}.pdf`;
    
    const fileMetadata = {
      name: fileName,
      parents: [folder.data.id],
      description: `Admission letter for ${application.applicant.firstName} ${application.applicant.lastName}`
    };

    const driveFileId = await driveService.uploadFile(
      fileStream,
      fileName,
      'application/pdf',
      fileMetadata
    );

    const letterUrl = await driveService.getFileUrl(driveFileId);

    // Save reference in database
    await prisma.document.create({
      data: {
        type: 'ADMISSION_LETTER',
        driveFileId,
        driveFolderId: folder.data.id,
        applicationId: application.id,
        version: 1,
        status: 'ACTIVE'
      }
    });

    const letterData = {
      letterUrl,
      studentId: application.studentId,
      studentId: 'RMC' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      generatedDate: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      program: 'Bachelor of Science in Health Sciences',
      startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      academicYear: '2024/2025',
      scholarshipAwarded: false,
      requirements: [
        'Original WAEC Certificate',
        'Medical Examination Report',
        'Two Passport Photographs',
        'Proof of Payment of Acceptance Fee'
      ]
    };

    logger.info(`Admission letter accessed for application ${applicationId}`);
    res.json(letterData);
  } catch (error) {
    logger.error('Error generating admission letter:', error);
    res.status(500).json({ error: 'Failed to generate admission letter' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { program, startDate } = req.body;
    const userId = req.user.id;

    const application = await prisma.application.create({
      data: {
        program,
        startDate,
        applicantId: userId
      }
    });

    res.status(201).json(application);
  } catch (error) {
    logger.error('Error creating application:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

export default router;