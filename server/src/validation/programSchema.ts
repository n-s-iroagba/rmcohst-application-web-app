// src/validators/programValidator.ts
import { z } from 'zod'

export const programSchema = z.object({
  departmentId: z.number(),
  name: z.string().max(100),
  code: z.string().max(100),
  level: z.enum(['OND', 'HND', 'Certificate']),
  durationType: z.enum(['WEEK', 'MONTH', 'YEAR']),
  duration: z.number().min(1),
  applicationFeeInNaira: z.number().nonnegative(),
  acceptanceFeeInNaira: z.number().nonnegative(),
  description: z.string().optional(),
})

export const bulkProgramSchema = z.array(programSchema)

export const updateProgramSchema = programSchema.partial()
