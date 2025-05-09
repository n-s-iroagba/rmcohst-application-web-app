import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

router.get('/:applicationId', authMiddleware, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    // Mock decision data - in real app, fetch from database
    const decision = {
      status: 'Accepted',
      details: 'Congratulations! You have been accepted to Remington College.',
      acceptanceFeeAmount: 50000,
      nextSteps: [
        'Pay acceptance fee within 7 days',
        'Submit medical records',
        'Attend orientation'
      ]
    };

    // Send email notification
    const application = await Application.findByPk(applicationId, {
      include: ['applicant']
    });

    if (!application) {
      throw new Error('Application not found');
    }

    await emailService.sendEmail(application.applicant.email, 'DECISION_MADE', {
      name: application.applicant.name,
      decision: decision.status,
      acceptanceFeeAmount: decision.status === 'Accepted' ? decision.acceptanceFeeAmount : undefined
    });

    logger.info(`Decision fetched and notification sent for application ${applicationId}`);
    res.json({
      ...decision,
      paymentUrl: decision.status === 'Accepted' ? 
        `/application/acceptance-fee?id=${applicationId}` : 
        undefined
    });
  } catch (error) {
    logger.error('Error fetching decision:', error);
    res.status(500).json({ error: 'Failed to fetch decision' });
  }
});

export default router;