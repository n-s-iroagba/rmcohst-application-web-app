import { ProgramSpecificRequirementCreationDto } from './program_specific_requirement'
import { SSCSubjectMinimumGradeCreationDto } from './program_ssc_requirement'


export type ProgramLevel = 'OND' | 'HND' | 'Certificate'
type DurationType =  'WEEK' | 'MONTH' | 'YEAR'
 
export interface Program {
  id: number
  departmentId: number
  name: string
  level: ProgramLevel
  durationType:DurationType
  duration: number
  applicationFeeInNaira: number
  acceptanceFeeInNaira: number
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProgramFilters {
  faculty?: string
  department?: string
  level?: ProgramLevel
  searchTerm?: string
}

export type ProgramCreationDto = {
  name: string
  awardType: string
  durationType:DurationType
  duration: number
  applicationFeeInNaira: number
  acceptanceFeeInNaira: number
  description?: string
  isUsingPreexistingSSCRequirements: boolean
  isUsingPreexistingProgramSpecificRequirements: boolean
  sscRequirements?: SSCSubjectMinimumGradeCreationDto[]
  programSpecificRequirements?: ProgramSpecificRequirementCreationDto[]
}
