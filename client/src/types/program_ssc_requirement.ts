import { Program } from './program'
import { SSCSubject } from './ssc_subject'

export interface ProgramSSCRequirement {
  id: number
  maximumNumberOfSittings: number
  programs: Program[]
  subjectAndGrades: SSCSubjectMinimumGrade[]
  createdAt?: Date
  updatedAt?: Date
}

export type ProgramSSCRequirementCreationDto = Omit<ProgramSSCRequirement,'id'|'subjectAndGrades'|'createAt'|'updateAt'|'programs'> & {
  
}

export type SSCSubjectMinimumGradeCreationDto = Omit<
  SSCSubjectMinimumGrade,
  'id' | 'createdAt' | 'updatedAt'
>
export interface Grade {
  id: number
  type: string
  grade: string

  gradePoint: number

  readonly createdAt: Date
  readonly updatedAt: Date
}
export interface SSCSubjectMinimumGrade {
  subject: SSCSubject
  grade: Grade
}
