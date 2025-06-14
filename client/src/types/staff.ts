// This type represents the Staff model from the backend

export interface StaffAttributes {
  id: number
  phoneNumber: string
  userId: number // Foreign key to User model
  createdAt?: Date
  updatedAt?: Date
  // user?: UserAttributes; // If User is eager loaded with Staff
}

// For creating staff, these fields are not needed from client directly for Staff model
// They are part of UserCreationData which is handled by UserService on backend
// export type StaffCreationAttributes = Omit<StaffAttributes, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
