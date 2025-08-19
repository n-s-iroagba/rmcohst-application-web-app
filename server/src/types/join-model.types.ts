import {
  AdmissionSession,
  ApplicantProgramSpecificQualification,
  Application,
  Biodata,
  Department,
  Permission,
  Program,
  ProgramSpecificRequirement,
  ProgramSSCRequirement,
  Role,
  User,
} from '../models'
import { ApplicantSSCQualification } from '../models/ApplicantSSCQualification'
import Faculty from '../models/Faculty'
interface DepartmentAndFaculty extends Department {
  faculty: Faculty
}
interface ProgramAndDepartment extends Program {
  department: DepartmentAndFaculty
}
export interface FullApplication extends Application {
  biodata: Biodata
  program: ProgramAndDepartment

  academicSession: AdmissionSession
  sscQualification: ApplicantSSCQualification
  programSpecificQualifications?: ApplicantProgramSpecificQualification[]
}
export interface FullProgram extends Program {
  sscRequirement: ProgramSSCRequirement
  specificRequirements: ProgramSpecificRequirement
  department: DepartmentWithFaculty
}
interface DepartmentWithFaculty extends Department {
  faculty: Faculty
}

export interface UserWithRole extends User {
  role: RoleWithPermissions
}

export interface RoleWithPermissions extends Role {
  permissions?: Permission[]
}