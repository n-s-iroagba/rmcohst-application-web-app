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

    logger.info(`Decision fetched for application ${applicationId}`);
    res.json(decision);
  } catch (error) {
    logger.error('Error fetching decision:', error);
    res.status(500).json({ error: 'Failed to fetch decision' });
  }
});

export default router;