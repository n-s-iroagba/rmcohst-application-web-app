interface ProgramSpecificRequirementAttributes {
  id: number;
  programId: number;
  qualificationType: string;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
export type ProgramSpecificRequirementCreationDto= Omit<ProgramSpecificRequirementAttributes, 'id' | 'createdAt' | 'programId'|'updatedAt'>
