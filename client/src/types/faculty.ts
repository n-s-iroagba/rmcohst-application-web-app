import { DepartmentAttributes, DepartmentWithProgramsCreationDto } from "./department";

export interface Faculty {
  name: string
  code: string
  description?: string
  nameOfDean?:string;
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export type FacultyCreationDto={
    name: string
  code: string
  description?: string
  nameOfDean?:string;
  departments: DepartmentWithProgramsCreationDto
}

export type FacultyCreationAttributes = Omit<Faculty, 'id'|"departments">
