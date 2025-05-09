import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import logger from '../utils/logger';

const router = Router();

import { z } from 'zod';
import { validate } from '../middleware/validation';
import prisma from '../utils/db';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

router.post(
  '/register',
  validate(registerSchema),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName
        }
      });

      const token = jwt.sign(
        { email },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // TODO: Add DB integration
      // For now, just log the attempt
      logger.info('Login attempt', { email });

      const token = jwt.sign(
        { email },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

export default router;