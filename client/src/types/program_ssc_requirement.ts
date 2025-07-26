
export enum Grade{
  A1='A1',
  B2='B2',
  B3='B3',
  C4='C4',
  C5='C5',
  C6='C6',
  D7='D7',
  E8='E8',
}

export interface ProgramSSCRequirement {
  id: number
  tag:string
  maximumNumberOfSittings: number
  qualificationTypes: string[]
  firstSubjectId: number
  firstSubjectGrade: Grade
  secondSubjectId: number
  secondSubjectGrade: Grade
  thirdSubjectId: number
  alternateThirdSubjectId: number|null
  thirdSubjectGrade: Grade
  fourthSubjectId: number
  alternateFourthSubjectId: number|null
  fourthSubjectGrade: Grade
  fifthSubjectId: number
  alternateFifthSubjectId: number|null
  fifthSubjectGrade: Grade
  createdAt?: Date
  updatedAt?: Date
}

export type ProgramSSCRequirementCreationDto = Omit<ProgramSSCRequirement,'id'|'createAt'|'updateAt'> 
