
import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { prisma } from '../config/database';
import logger from '../utils/logger';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      }
    });
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { firstName, lastName, email, phone },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true
      }
    });
    res.json(updatedUser);
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
