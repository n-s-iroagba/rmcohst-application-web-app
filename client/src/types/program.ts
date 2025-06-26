import { ProgramSpecificRequirement, ProgramSpecificRequirementCreationDto } from './program_specific_requirement'
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
  sscRequirement: SSCSubjectMinimumGradeCreationDto
  programSpecificRequirements: ProgramSpecificRequirement[]
  description?: string
  sscRequirementId: number
  programSpecificRequirementsId: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
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
  sscRequirementId: number
  programSpecificRequirementsId: number
}


export interface ProgramFilters {
  faculty?: string
  department?: string
  level?: ProgramLevel
  searchTerm?: string
}
