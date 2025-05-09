import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import logger from '../utils/logger';
import prisma from '../config/database';
import { StudentIdGenerator } from '../utils/studentIdGenerator';
import { emailService } from '../utils/emailService';

const router = Router();

const DEPARTMENT_CAPACITY: Record<string, number> = {
  'Health Sciences': 100,
  'Medical Laboratory': 80,
  'Nursing': 120,
  'Pharmacy': 90
};

async function checkDepartmentCapacity(department: string): Promise<boolean> {
  const currentCount = await prisma.student.count({
    where: { department }
  });
  return currentCount < (DEPARTMENT_CAPACITY[department] || 0);
}

router.post('/generate-profile', authMiddleware, async (req, res) => {
  try {
    const { applicationId, department } = req.body;

    // Check department capacity
    if (!await checkDepartmentCapacity(department)) {
      return res.status(400).json({
        error: 'Department capacity reached',
        alternativeDepartments: await getAvailableDepartments()
      });
    }

    // Generate student ID
    const studentId = StudentIdGenerator.generate(department);

    // Create student profile
    const student = await prisma.student.create({
      data: {
        studentId,
        department,
        applicationId,
        userId: req.user.id,
        status: 'active'
      }
    });

    // Send welcome email
    await emailService.sendEmail(req.user.email, 'ENROLLMENT_CONFIRMED', {
      name: req.user.name,
      studentId
    });

    logger.info('Student profile generated', { studentId, department });
    res.status(201).json(student);
  } catch (error) {
    logger.error('Failed to generate student profile:', error);
    res.status(500).json({ error: 'Failed to generate student profile' });
  }
});

async function getAvailableDepartments() {
  const departments = Object.keys(DEPARTMENT_CAPACITY);
  const available = [];

  for (const dept of departments) {
    if (await checkDepartmentCapacity(dept)) {
      available.push(dept);
    }
  }

  return available;
}

router.get('/departments/capacity', authMiddleware, async (req, res) => {
  try {
    const capacityStatus = {};
    for (const [dept, maxCapacity] of Object.entries(DEPARTMENT_CAPACITY)) {
      const currentCount = await prisma.student.count({
        where: { department: dept }
      });
      capacityStatus[dept] = {
        total: maxCapacity,
        current: currentCount,
        available: maxCapacity - currentCount
      };
    }
    res.json(capacityStatus);
  } catch (error) {
    logger.error('Failed to fetch department capacity:', error);
    res.status(500).json({ error: 'Failed to fetch department capacity' });
  }
});

export default router;