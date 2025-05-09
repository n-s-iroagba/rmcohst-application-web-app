import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { TaskPriorityCalculator } from '../utils/taskPriority';
import prisma from '../config/database';
import logger from '../utils/logger';

const router = express.Router();

router.get('/tasks/prioritized', authMiddleware, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: {
        status: 'Submitted',
        assignedTo: null
      }
    });

    const prioritizedTasks = await Promise.all(
      applications.map(async (app) => {
        const priority = await TaskPriorityCalculator.calculatePriority(app);
        return {
          ...app,
          priority
        };
      })
    );

    // Sort by priority score
    prioritizedTasks.sort((a, b) => b.priority.score - a.priority.score);

    res.json(prioritizedTasks);
  } catch (error) {
    logger.error('Error fetching prioritized tasks:', error);
    res.status(500).json({ error: 'Failed to fetch prioritized tasks' });
  }
});

router.get('/workload/metrics', authMiddleware, async (req, res) => {
  try {
    const officers = await prisma.user.findMany({
      where: { roles: { has: 'officer' } },
      include: {
        assignedApplications: true
      }
    });

    const workloadMetrics = officers.map(officer => ({
      officerId: officer.id,
      name: officer.name,
      assignedCount: officer.assignedApplications.length,
      averageProcessingTime: calculateAverageProcessingTime(officer.assignedApplications)
    }));

    res.json(workloadMetrics);
  } catch (error) {
    logger.error('Error fetching workload metrics:', error);
    res.status(500).json({ error: 'Failed to fetch workload metrics' });
  }
});

router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.application.findMany({
      where: {
        status: {
          in: ['Submitted', 'UnderReview']
        }
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        assignedTo: true,
        priority: true
      },
      orderBy: {
        priority: 'asc'
      }
    });

    res.json(tasks);
  } catch (error) {
    logger.error('Error fetching admin tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const [totalTasks, completedTasks, avgReviewTime, tasksByPriority] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({
        where: { status: 'Completed' }
      }),
      prisma.application.aggregate({
        _avg: {
          reviewTime: true
        },
        where: { status: 'Completed' }
      }),
      prisma.application.groupBy({
        by: ['priority'],
        _count: true
      })
    ]);

    res.json({
      totalTasks,
      completedTasks,
      averageReviewTime: Math.round(avgReviewTime._avg.reviewTime || 0),
      tasksByPriority: tasksByPriority.reduce((acc, curr) => ({
        ...acc,
        [curr.priority]: curr._count
      }), {})
    });
  } catch (error) {
    logger.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

function calculateAverageProcessingTime(applications: any[]) {
  if (applications.length === 0) {
    return 0;
  }

  const totalProcessingTime = applications.reduce((sum, app) => {
    if (!app.createdAt || !app.updatedAt) return sum;

    const createdAt = new Date(app.createdAt).getTime();
    const updatedAt = new Date(app.updatedAt).getTime();
    return sum + (updatedAt - createdAt);
  }, 0);

  return Math.round(totalProcessingTime / applications.length);
}

// Batch processing endpoint
router.post('/applications/batch', authMiddleware, async (req, res) => {
  try {
    const { applicationIds } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty applicationIds array' });
    }

    const results = await BatchProcessor.processBatchApplications(applicationIds);
    res.json(results);

  } catch (error) {
    logger.error('Batch processing error:', error);
    res.status(500).json({ error: 'Failed to process batch applications' });
  }
});

export default router;