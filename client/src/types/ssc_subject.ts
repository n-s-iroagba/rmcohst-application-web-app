export interface SSCSubjectAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes
export type SSCSubjectCreationAttributes = Omit<SSCSubjectAttributes, 'id' | 'createdAt' | 'updatedAt'>