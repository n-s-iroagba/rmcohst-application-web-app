import { Faculty } from './faculty'

export interface Department {
  id: number
  name: string
  code: string
  description?: string
  isActive: boolean
  facultyId: number

}

export type DepartmentCreationDto = Omit<Department, 'id' | 'isActive' | 'faculty' | 'facultyId'>
export interface DepartmentWithFaculty extends Department {
  faculty: Faculty
}