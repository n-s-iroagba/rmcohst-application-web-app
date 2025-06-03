export interface DepartmentAttributes {
  id: number;
  name: string;
  facultyId: number;
}
export type DepartmentCreationAttributes = Omit<DepartmentAttributes, 'id'> 
