
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required')
});

export const applicationSchema = z.object({
  program: z.string().min(1, 'Program selection is required'),
  startDate: z.string().min(1, 'Start date is required'),
  educationLevel: z.string().min(1, 'Education level is required'),
  documents: z.array(z.string()).min(1, 'At least one document is required')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
