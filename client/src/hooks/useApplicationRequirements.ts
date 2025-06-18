import { handleArrayChange, handleChange } from "@/helpers/handleChange";
import { AcademicSessionCreationDto } from "@/types/academic_session";
import { DepartmentCreationDto, DepartmentWithProgramsCreationDto } from "@/types/department";
import { FacultyCreationAttributes, FacultyCreationDto } from "@/types/faculty";
import { ProgramSpecificRequirementCreationDto } from "@/types/program_specific_qualification";
import { ProgramSSCRequirementCreationDto } from "@/types/program_ssc_requirement";
import { useState } from "react";
const tempDeptData:DepartmentCreationDto = {
        name: "",
        code: "",
        description: "",
}

const tempFacultyData:FacultyCreationAttributes ={
   name: '',
  code: '',
  description: '',
  nameOfDean:'',
}
export const useApplicationRequirments = ()=>{
    const [sessionData, setSessionData] = useState<AcademicSessionCreationDto[]>([]);
    const [facultyData, setFacultyData] = useState<FacultyCreationAttributes[]>([]);
    const [departmentData, setDepartmentData] = useState<DepartmentCreationDto[]>([tempDeptData]);
    const [sscRequirmentsData, setSCCRequirementsData] = useState<ProgramSSCRequirementCreationDto[]>([]);
    const [programSpecificRequirementsData, setProgramSpecificRequirementsData] = useState<ProgramSpecificRequirementCreationDto[]>([]);
    const [preexistingSSCRequirements, setPreexistingSSCRequirements] = useState<boolean>(false);
    const [preexistingProgamSpecificRequirements, setPreexistingProgamSpecificRequirements] = useState<boolean>(false);
   const [preexistingSSCRequirementsId, setPreexistingSSCRequirementsId] = useState<number>(0);
    const [preexistingProgamSpecificRequirementsId, setPreexistingProgamSpecificRequirementsId] = useState<number>(0);
  const handleChangeFaculty = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setFacultyData,e,index)
  }

  const addFaculty = ()=>{
   setFacultyData([...facultyData,tempFacultyData])
  }
const removeFaculty = (index: number) => {
  setFacultyData(prev => prev.filter((_, i) => i !== index));
};

    const handleChangeDepartment = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setDepartmentData,e,index)
  }

  const addDepartment = ()=>{
     setDepartmentData([...departmentData, tempDeptData])
  }

    const handleChangeSSCRequirements = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setSCCRequirementsData,e,index)
  }

     const handleChangeProgramSpecificRequirementsData = ( e: React.ChangeEvent<HTMLInputElement>,index:number) => {
     handleArrayChange(setProgramSpecificRequirementsData,e,index)
  }
  return {
   facultyData,
   handleChangeFaculty,
   addFaculty,
   removeFaculty,
   departmentData,
   handleChangeDepartment,
   addDepartment
  }
   
}