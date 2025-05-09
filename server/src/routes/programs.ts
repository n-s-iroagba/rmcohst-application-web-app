
import { Router } from 'express';
import prisma from '../utils/db';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { faculty, department, level, search } = req.query;

    const where: any = {};
    
    if (faculty) where.faculty = faculty;
    if (department) where.department = department;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(programs);
  } catch (error) {
    console.error('Failed to search programs:', error);
    res.status(500).json({ error: 'Failed to search programs' });
  }
});

router.get('/departments', async (req, res) => {
  try {
    const { faculty } = req.query;
    
    if (!faculty) {
      return res.status(400).json({ error: 'Faculty is required' });
    }

    const departments = await prisma.program.findMany({
      where: { faculty: faculty as string },
      select: { department: true },
      distinct: ['department']
    });

    res.json(departments.map(d => d.department));
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

export default router;
