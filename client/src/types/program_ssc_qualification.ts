interface ProgramSSCQualificationAttributes {
  id: number;
  programId: number;
  acceptedCertificateTypes: string[];
  maximumNumberOfSittings: number | null;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type ProgramSSCQualificationCreationAttributes = Omit<ProgramSSCQualificationAttributes, 'id' | 'createdAt' | 'updatedAt'>
