interface ProgramSSCSubjectAttributes {
  id: number;
  sscSubjectId: number;
  minimumGrade: string;
  programSSCQualificationId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProgramSSCSubjectCreationAttributes = Omit<ProgramSSCSubjectAttributes, 'id' | 'createdAt' | 'updatedAt'>
