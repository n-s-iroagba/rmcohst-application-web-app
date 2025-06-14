export interface SuperAdminAttributes {
  id: number;
  firstName: string;
  lastName: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Creation attributes (omit id, createdAt, updatedAt)
export type SuperAdminCreationAttributes = Omit<SuperAdminAttributes, 'id' | 'createdAt' | 'updatedAt'>
