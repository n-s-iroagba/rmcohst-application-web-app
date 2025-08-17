import {
  AdmissionSession,
  ApplicantProgramSpecificQualification,
  Application,
  Biodata,
  Department,
  Program,
  ProgramSpecificRequirement,
  ProgramSSCRequirement,
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