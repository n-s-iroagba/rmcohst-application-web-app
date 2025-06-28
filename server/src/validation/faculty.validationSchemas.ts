import { z } from 'zod'

export const createFacultySchema = z.array(
  z.object({
    name: z.string().min(2, 'Faculty name must be at least 2 characters long'),
  })
)

export const updateFacultySchema = z.object({
  name: z.string().min(2, 'Faculty name must be at least 2 characters long'),
})

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
})

export const getFacultiesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  includeDepartments: z
    .string()
    .transform(v => v === 'true')
    .optional(),
})
