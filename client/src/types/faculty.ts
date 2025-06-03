import { DepartmentAttributes } from "./department";

interface FacultyAttributes {
  id: number;
  name: string;
  departments?:DepartmentAttributes[]
}

export type FacultyCreationAttributes = Omit<FacultyAttributes, 'id'|"departments">