interface ProgramSpecificQualificationAttributes {
  id: number;
  programId: number;
  qualificationType: string;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
export type ProgramSpecificQualificationCreationAttribute= Omit<ProgramSpecificQualificationAttributes, 'id' | 'createdAt' | 'updatedAt'>
