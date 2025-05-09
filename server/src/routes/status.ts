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

router.put('/applications/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update application status
    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });

    // Send email notification based on status
    const applicant = application.applicantId;

    switch (status) {
      case 'Submitted':
        await emailService.sendEmail(applicant.email, 'APPLICATION_SUBMITTED', { name: applicant.name });
        break;
      case 'Under Review':
        await emailService.sendEmail(applicant.email, 'APPLICATION_UNDER_REVIEW', { name: applicant.name });
        break;
      case 'Decision Made':
        await emailService.sendEmail(applicant.email, 'DECISION_MADE', { name: applicant.name });
        break;
    }

    res.json(application);
  } catch (error) {
    logger.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});


export default router;