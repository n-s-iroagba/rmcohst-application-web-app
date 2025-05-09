
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';

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

export default router;
