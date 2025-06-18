interface SSCSubjectMinimumGrade {
  id: number;
  sscSubjectId: number;
  minimumGradeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SSCSubjectMinimumGradeCreationDto = Omit<SSCSubjectMinimumGrade, 'id' | 'createdAt' | 'updatedAt'>
