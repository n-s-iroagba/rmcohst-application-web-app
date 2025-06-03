export interface StaffAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type StaffCreationAttributes = Omit<StaffAttributes, 'id'  | 'createdAt' | 'updatedAt'>