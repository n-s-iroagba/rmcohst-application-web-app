interface ProgramSSCRequirementAttributes {
  id: number;
  programId: number;
  acceptedCertificateTypes: string[];
  maximumNumberOfSittings: number | null;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type ProgramSSCRequirementCreationAttributes = Omit<ProgramSSCRequirementAttributes, 'id' | 'createdAt' | 'updatedAt'>
