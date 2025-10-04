export enum Grade {
  A1 = 'A1',
  B2 = 'B2',
  B3 = 'B3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6',
  D7 = 'D7',
  E8 = 'E8'
}

export interface ProgramSSCRequirement {
  id: string
  tag: string
  maximumNumberOfSittings: string
  qualificationTypes: string[]
  firstSubject: string
  firstSubjectGrade: Grade
  secondSubject: string
  secondSubjectGrade: Grade
  thirdSubject: string
  alternateThirdSubject: string
  thirdSubjectGrade: Grade
  fourthSubject: string
  alternateFourthSubject: string
  fourthSubjectGrade: Grade
  fifthSubject: string | null
  alternateFifthSubject: string
  fifthSubjectGrade: Grade
  createdAt?: Date
  updatedAt?: Date
}

export type ProgramSSCRequirementCreationDto = Omit<
  ProgramSSCRequirement,
  'id' | 'createAt' | 'updateAt'
>
