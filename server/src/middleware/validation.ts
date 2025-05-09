
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import logger from '../utils/logger';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      logger.error('Validation error:', error);
      return res.status(400).json({ error: 'Validation failed', details: error });
    }
};
