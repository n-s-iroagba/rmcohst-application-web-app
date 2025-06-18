import { Faculty } from "./faculty";
import { ProgramWithRequirementsCreationDto } from "./program";

export interface DepartmentAttributes {
  id: number;
  name: string;
  code: string
  description?: string
  isActive: boolean
  facultyId?: number;
  faculty?:Faculty
}
export type DepartmentWithProgramsCreationDto = {
    name: string
    code: string
    description?: string
    programs: ProgramWithRequirementsCreationDto[]
}
export type DepartmentCreationDto = Omit<DepartmentAttributes, 'id'|'isActive'|'faculty'>
