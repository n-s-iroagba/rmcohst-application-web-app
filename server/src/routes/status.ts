import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

// Mock email service (replace with actual implementation)
const emailService = {
  sendEmail: async (email, template, data) => {
    logger.info(`Sending email to ${email} with template ${template} and data ${JSON.stringify(data)}`);
    // In a real app, this would send an email
    return Promise.resolve();
  }
};

// Mock Application model (replace with actual database model)
const Application = {
  findByIdAndUpdate: async (id, update, options) => {
    logger.info(`Updating application ${id} with ${JSON.stringify(update)}`);
    // In a real app, this would update the database
    return Promise.resolve({ _id: id, ...update, applicantId: { name: 'Test User', email: 'test@example.com' } }); // Mock data
  }
};

const router = Router();

router.get('/:applicationId', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;

    // In a real app, this would fetch from database
    const mockTimeline = [
      { status: 'Submitted', date: new Date().toISOString() },
      { status: 'Under Review', date: new Date().toISOString() }
    ];

    logger.info(`Status fetched for application ${applicationId}`);

    res.json({
      currentStatus: 'Under Review',
      timeline: mockTimeline
    });
  } catch (error) {
    logger.error('Error fetching application status:', error);
    res.status(500).json({ error: 'Failed to fetch application status' });
  }
});

router.get('/notifications', authMiddleware, (req, res) => {
  const userId = req.user.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  notificationService.addClient(userId, res);

  req.on('close', () => {
    notificationService.removeClient(userId, res);
  });
});

router.put('/applications/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    const applicant = application.applicantId;

    // Send both email and real-time notifications
    switch (status) {
      case 'Submitted':
        await emailService.sendEmail(applicant.email, 'APPLICATION_SUBMITTED', { name: applicant.name });
        notificationService.sendNotification(applicant._id, 'status_update', { 
          status, 
          message: 'Your application has been submitted successfully' 
        });
        break;
      case 'Under Review':
        await emailService.sendEmail(applicant.email, 'APPLICATION_UNDER_REVIEW', { name: applicant.name });
        notificationService.sendNotification(applicant._id, 'status_update', { 
          status, 
          message: 'Your application is now under review' 
        });
        break;
      case 'Decision Made':
        await emailService.sendEmail(applicant.email, 'DECISION_MADE', { name: applicant.name });
        notificationService.sendNotification(applicant._id, 'status_update', { 
          status, 
          message: 'A decision has been made on your application' 
        });
        break;
    }

    res.json(application);
  } catch (error) {
    logger.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});


export default router;
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import prisma from '../utils/db';
import { emailService } from '../utils/emailService';
import logger from '../utils/logger';

const router = Router();

router.post('/submit/:applicationId', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, documents: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.documents.length < 2) {
      return res.status(400).json({ error: 'Required documents not uploaded' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'Submitted',
        submittedAt: new Date(),
      }
    });

    await emailService.sendEmail(
      application.user.email,
      'APPLICATION_SUBMITTED',
      {
        name: `${application.user.firstName} ${application.user.lastName}`,
        status: 'Submitted'
      }
    );

    logger.info('Application submitted successfully', {
      applicationId,
      userId: application.userId
    });

    res.json(updatedApplication);
  } catch (error) {
    logger.error('Application submission error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

export default router;
