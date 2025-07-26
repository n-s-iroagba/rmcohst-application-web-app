// validation/schemas.validation.ts
import { z } from 'zod'

export const departmentCreationSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters long')
    .max(100, 'Department name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s&\-']+$/,
      'Department name can only contain letters, spaces, ampersands, hyphens, and apostrophes'
    ),
  code: z
    .string()
    .min(2, 'Department code must be at least 2 characters long')
    .max(10, 'Department code must be less than 10 characters')
    .regex(/^[A-Z0-9]+$/, 'Department code must be uppercase letters and numbers only'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  facultyId: z
    .number()
    .int('Faculty ID must be an integer')
    .positive('Faculty ID must be positive'),
})

export const departmentUpdateSchema = departmentCreationSchema.partial()

// ========== PROGRAM VALIDATION ==========
const programLevelEnum = z.enum(['OND', 'HND', 'Certificate'], {
  errorMap: () => ({ message: 'Program level must be OND, HND, or Certificate' }),
})

const durationTypeEnum = z.enum(['WEEK', 'MONTH', 'YEAR'], {
  errorMap: () => ({ message: 'Duration type must be WEEK, MONTH, or YEAR' }),
})

export const programCreationSchema = z.object({
  name: z
    .string()
    .min(3, 'Program name must be at least 3 characters long')
    .max(150, 'Program name must be less than 150 characters'),
  awardType: z
    .string()
    .min(2, 'Award type must be at least 2 characters long')
    .max(50, 'Award type must be less than 50 characters'),
  durationType: durationTypeEnum,
  duration: z
    .number()
    .int('Duration must be an integer')
    .positive('Duration must be positive')
    .max(10, 'Duration cannot exceed 10 units'),
  applicationFeeInNaira: z
    .number()
    .nonnegative('Application fee cannot be negative')
    .max(1000000, 'Application fee cannot exceed ₦1,000,000'),
  acceptanceFeeInNaira: z
    .number()
    .nonnegative('Acceptance fee cannot be negative')
    .max(10000000, 'Acceptance fee cannot exceed ₦10,000,000'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  isUsingPreexistingSSCRequirements: z.boolean(),
  isUsingPreexistingProgramSpecificRequirements: z.boolean(),
  sscRequirementId: z
    .number()
    .int('SSC requirement ID must be an integer')
    .nonnegative('SSC requirement ID cannot be negative'),
  programSpecificRequirementsId: z
    .number()
    .int('Program specific requirements ID must be an integer')
    .nonnegative('Program specific requirements ID cannot be negative'),
})

export const programUpdateSchema = programCreationSchema.partial()

// ========== SSC REQUIREMENT VALIDATION ==========
const gradeEnum = z.enum(['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'], {
  errorMap: () => ({ message: 'Grade must be a valid SSC grade (A1-F9)' }),
})

export const sscSubjectMinimumGradeSchema = z.object({
  subjectId: z
    .number()
    .int('Subject ID must be an integer')
    .positive('Subject ID must be positive'),
  minimumGrade: gradeEnum,
})

export const sscRequirementCreationSchema = z.object({
  name: z
    .string()
    .min(3, 'SSC requirement name must be at least 3 characters long')
    .max(100, 'SSC requirement name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  minimumNumberOfSittings: z
    .number()
    .int('Minimum number of sittings must be an integer')
    .min(1, 'Minimum number of sittings must be at least 1')
    .max(3, 'Minimum number of sittings cannot exceed 3'),
  minimumNumberOfCredits: z
    .number()
    .int('Minimum number of credits must be an integer')
    .min(1, 'Minimum number of credits must be at least 1')
    .max(15, 'Minimum number of credits cannot exceed 15'),
  subjectMinimumGrades: z
    .array(sscSubjectMinimumGradeSchema)
    .min(1, 'At least one subject requirement is required')
    .max(15, 'Cannot have more than 15 subject requirements'),
})

export const sscRequirementUpdateSchema = sscRequirementCreationSchema.partial()

// ========== PROGRAM SPECIFIC REQUIREMENT VALIDATION ==========
export const programSpecificRequirementCreationSchema = z.object({
  qualificationType: z
    .string()
    .min(2, 'Qualification type must be at least 2 characters long')
    .max(100, 'Qualification type must be less than 100 characters'),
  minimumGrade: z
    .string()
    .min(1, 'Minimum grade is required')
    .max(10, 'Minimum grade must be less than 10 characters')
    .regex(
      /^[A-F][0-9]?$|^[0-9](\.[0-9]{1,2})?$|^(PASS|MERIT|DISTINCTION|CREDIT)$/i,
      'Invalid grade format'
    ),
})

export const programSpecificRequirementUpdateSchema =
  programSpecificRequirementCreationSchema.partial()

// ========== COMMENT VALIDATION ==========
const commentTypeEnum = z.enum(['GENERAL', 'BIODATA', 'QUALIFICATION', 'DECISION'], {
  errorMap: () => ({
    message: 'Comment type must be GENERAL, BIODATA, QUALIFICATION, or DECISION',
  }),
})

export const commentCreationSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment content must be less than 2000 characters'),
  type: commentTypeEnum,
  applicationId: z.string().uuid('Application ID must be a valid UUID').optional(),
})

export const commentUpdateSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment content must be less than 2000 characters')
    .optional(),
  type: commentTypeEnum.optional(),
})

// ========== BIODATA VALIDATION ==========
const genderEnum = z.enum(['MALE', 'FEMALE'], {
  errorMap: () => ({ message: 'Gender must be MALE or FEMALE' }),
})

const maritalStatusEnum = z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'], {
  errorMap: () => ({ message: 'Marital status must be SINGLE, MARRIED, DIVORCED, or WIDOWED' }),
})
const biodataCreationSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s\-']+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  middleName: z
    .string()
    .max(50, 'Middle name must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s\-']*$/,
      'Middle name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .optional(),
  surname: z
    .string()
    .min(2, 'Surname must be at least 2 characters long')
    .max(50, 'Surname must be less than 50 characters')
    .regex(
      /^[a-zA-Z\s\-']+$/,
      'Surname can only contain letters, spaces, hyphens, and apostrophes'
    ),
  gender: genderEnum,
  dateOfBirth: z
    .string()
    .datetime('Invalid date of birth format')
    .or(z.date())
    .refine(
      data => {
        const birthDate = new Date(data)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age >= 16 && age <= 65
      },
      {
        message: 'Age must be between 16 and 65 years',
      }
    ),
  maritalStatus: maritalStatusEnum,
  phoneNumber: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number format'),
  emailAddress: z.string().email('Invalid email address format'),
  homeAddress: z
    .string()
    .min(10, 'Home address must be at least 10 characters long')
    .max(200, 'Home address must be less than 200 characters'),
  nationality: z
    .string()
    .min(2, 'Nationality must be at least 2 characters long')
    .max(50, 'Nationality must be less than 50 characters'),
  stateOfOrigin: z
    .string()
    .min(2, 'State of origin must be at least 2 characters long')
    .max(50, 'State of origin must be less than 50 characters'),
  lga: z
    .string()
    .min(2, 'LGA must be at least 2 characters long')
    .max(50, 'LGA must be less than 50 characters'),
  homeTown: z
    .string()
    .min(2, 'Home town must be at least 2 characters long')
    .max(50, 'Home town must be less than 50 characters'),
  nextOfKinFullName: z
    .string()
    .min(2, 'Next of kin full name must be at least 2 characters long')
    .max(100, 'Next of kin full name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s\-']+$/,
      'Next of kin name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  nextOfKinPhoneNumber: z
    .string()
    .regex(/^(\+234|0)[789][01]\d{8}$/, 'Invalid Nigerian phone number format'),
  relationshipWithNextOfKin: z
    .string()
    .min(2, 'Relationship must be at least 2 characters long')
    .max(50, 'Relationship must be less than 50 characters'),
  nextOfKinAddress: z
    .string()
    .min(10, 'Next of kin address must be at least 10 characters long')
    .max(200, 'Next of kin address must be less than 200 characters'),
})

export const biodataUpdateSchema = biodataCreationSchema.partial()

// ========== APPLICATION STATUS VALIDATION ==========
const applicationStatusEnum = z.enum(
  ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED'],
  {
    errorMap: () => ({
      message: 'Status must be PENDING, UNDER_REVIEW, APPROVED, REJECTED, or WAITLISTED',
    }),
  }
)

export const applicationStatusUpdateSchema = z.object({
  status: applicationStatusEnum,
  comments: z.string().max(1000, 'Comments must be less than 1000 characters').optional(),
})

// ========== PARAMETER VALIDATION ==========
export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a valid number')
    .transform(val => parseInt(val, 10)),
})

export const uuidParamSchema = z.object({
  id: z.string().uuid('ID must be a valid UUID'),
})

export const paginationQuerySchemaFixed = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().max(100).optional(),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const idParamSchemaFixed = z.object({
  id: z.coerce.number().positive(),
})

// Solution 3: Use preprocess for more control
export const paginationQuerySchemaPreprocess = z.preprocess(
  (input: any) => ({
    ...input,
    page: input.page ? Math.max(1, parseInt(input.page, 10)) : 1,
    limit: input.limit ? Math.min(100, Math.max(1, parseInt(input.limit, 10))) : 10,
  }),
  z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    search: z.string().max(100).optional(),
    sortBy: z.string().max(50).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
)
