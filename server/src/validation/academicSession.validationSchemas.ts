import { z } from 'zod'

const academicSessionBaseSchema = z.object({
  name: z
    .string()
    .min(3, 'Session name must be at least 3 characters long')
    .max(100, 'Session name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-\/]+$/,
      'Session name can only contain letters, numbers, spaces, hyphens, and forward slashes'
    ),
  applicationStartDate: z.string().datetime('Invalid application start date format').or(z.date()),
  applicationEndDate: z.string().datetime('Invalid application end date format').or(z.date()),
})

export const academicSessionCreationSchema = academicSessionBaseSchema.refine(
  data => {
    const startDate = new Date(data.applicationStartDate)
    const endDate = new Date(data.applicationEndDate)
    return endDate > startDate
  },
  {
    message: 'Application end date must be after start date',
    path: ['applicationEndDate'],
  }
)

export const academicSessionUpdateSchema = academicSessionBaseSchema.partial()
