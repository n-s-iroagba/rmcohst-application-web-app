export interface AdmissionOfficerAttributes {
  id: number
  staffId: number
  portalUsername: string

  createdAt?: Date
  updatedAt?: Date
}

export type AdmissionOfficerCreationAttributes = Omit<
  AdmissionOfficerAttributes,
  'id' | 'createdAt' | 'updatedAt'
>
