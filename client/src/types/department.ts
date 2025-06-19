import { Faculty } from './faculty'

export interface DepartmentAttributes {
  id: number
  name: string
  code: string
  description?: string
  isActive: boolean
  facultyId?: number
  faculty?: Faculty
}

export type DepartmentCreationDto = Omit<DepartmentAttributes, 'id' | 'isActive' | 'faculty'>
