interface ProgramSSCRequirementDto {
  id: number;
  programId: number;
  acceptedCertificateTypes: string[];
  maximumNumberOfSittings: number | null;
  minimumGrade: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export type ProgramSSCRequirementCreationDto = Omit<ProgramSSCRequirementDto, 'id' | 'createdAt' | 'updatedAt'>
