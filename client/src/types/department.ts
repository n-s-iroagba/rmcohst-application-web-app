import { Faculty } from './faculty'

export interface Department {
  id: number
  name: string
  code: string
  description?: string
  isActive: boolean
  facultyId: number
  faculty?: Faculty
}

export type DepartmentCreationDto = Omit<Department, 'id' | 'isActive' | 'faculty'>
