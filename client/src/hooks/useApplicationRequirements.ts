import { handleArrayChange, handleChange } from "@/helpers/handleChange";
import { AcademicSessionCreationDto } from "@/types/academic_session";
import { DepartmentWithProgramsCreationDto } from "@/types/department";
import { FacultyCreationDto } from "@/types/faculty";
import { ProgramSpecificRequirementCreationDto } from "@/types/program_specific_qualification";
import { ProgramSSCRequirementCreationDto } from "@/types/program_ssc_requirement";
import { useState } from "react";

export const useApplicationRequirments = ()=>{
    const [sessionData, setSessionData] = useState<AcademicSessionCreationDto[]>([]);
    const [facultyData, setFacultyData] = useState<FacultyCreationDto[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentWithProgramsCreationDto[]>([]);
    const [sscRequirmentsData, setSCCRequirementsData] = useState<ProgramSSCRequirementCreationDto[]>([]);
    const [programSpecificRequirementsData, setProgramSpecificRequirementsData] = useState<ProgramSpecificRequirementCreationDto[]>([]);
     
  const handleChangeFaculty = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setFacultyData,e,index)
  }
    const handleChangeDepartment = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setDepartmentData,e,index)
  }

    const handleChangeSSCRequirements = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setSCCRequirementsData,e,index)
  }

     const handleChangeProgramSpecificRequirementsData = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setProgramSpecificRequirementsData,e,index)
  }
  return {departmentData}
   
}