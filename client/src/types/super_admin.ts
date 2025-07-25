export interface SuperAdminAttributes {
  id: number
  lastName: string
  firstName: string
  userId: number
  createdAt?: Date
  updatedAt?: Date
}

// Creation attributes (omit id, createdAt, updatedAt)
export type SuperAdminCreationAttributes = Omit<
  SuperAdminAttributes,
  'id' | 'createdAt' | 'updatedAt'
>
