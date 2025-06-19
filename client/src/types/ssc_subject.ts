export interface SSCSubject {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
export type SSCSubjectCreationAttributes = Omit<SSCSubject, 'id' | 'createdAt' | 'updatedAt'>
