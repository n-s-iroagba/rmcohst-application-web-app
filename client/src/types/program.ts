import { Department } from './department'
import { ProgramSpecificRequirement } from './program_specific_requirement'
import { ProgramSSCRequirement } from './program_ssc_requirement'

export type ProgramLevel = 'OND' | 'HND' | 'Certificate'
type DurationType = 'WEEK' | 'MONTH' | 'YEAR'

export interface Program {
  id: number
  departmentId: number
  name: string
  level: ProgramLevel
  durationType: DurationType
  duration: number
  department: Department
  applicationFeeInNaira: number
  acceptanceFeeInNaira: number
  sscRequirement: ProgramSSCRequirement
  programSpecificRequirements: ProgramSpecificRequirement
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
  durationType: DurationType
  duration: number
  applicationFeeInNaira: number
  acceptanceFeeInNaira: number
  description?: string
  sscRequirementId: number
  programSpecificRequirementsId: number
}

export interface ProgramFilters {
  faculty?: string
  department?: string
  level?: ProgramLevel
  searchTerm?: string
}
