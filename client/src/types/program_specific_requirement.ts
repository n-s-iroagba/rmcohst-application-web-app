export interface ProgramSpecificRequirement {
  id: number
  programId: number
  qualificationType: string
  minimumGrade: string
  createdAt?: Date
  updatedAt?: Date
}

// Define creation attributes
export type ProgramSpecificRequirementCreationDto = Omit<
  ProgramSpecificRequirement,
  'id' | 'createdAt' | 'programId' | 'updatedAt'
>
