import { useState } from 'react'
import {
  handleAddToArrayOfArrays,
  handleArrayOfObjectsChange,
  handleChange,
  handleChangeArrayInArray,
  handleRemoveFromArrayOfArrays
} from '@/helpers/handleChange'
import { AcademicSessionCreationDto } from '@/types/academic_session'
import { DepartmentCreationDto } from '@/types/department'
import { FacultyCreationDto } from '@/types/faculty'
import { ProgramCreationDto } from '@/types/program'
import { ProgramSpecificRequirementCreationDto } from '@/types/program_specific_requirement'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'

const tempDeptData: DepartmentCreationDto = {
  name: '',
  code: '',
  description: ''
}

const tempFacultyData: FacultyCreationDto = {
  name: '',
  code: '',
  description: '',
  nameOfDean: ''
}

const tempProgramSpecificRequirement: ProgramSpecificRequirementCreationDto = {
  qualificationType: '',
  minimumGrade: ''
}

export const useApplicationRequirements = () => {
  const [sessionData, setSessionData] = useState<AcademicSessionCreationDto>({
    name: '',
    applicationStartDate: new Date(),
    applicationEndDate: new Date()
  })
  const [facultyData, setFacultyData] = useState<FacultyCreationDto[]>([])
  const [departmentData, setDepartmentData] = useState<DepartmentCreationDto[]>([tempDeptData])
  const [sscRequirementsData, setSCCRequirementsData] = useState<ProgramSSCRequirement[]>([])
  const [programSpecificRequirementsData, setProgramSpecificRequirementsData] = useState<
    ProgramSpecificRequirementCreationDto[]
  >([])
  const [programData, setProgramData] = useState<ProgramCreationDto[]>([])
  const [preexistingSSCRequirements, setPreexistingSSCRequirements] = useState<boolean>(false)
  const [preexistingProgamSpecificRequirements, setPreexistingProgamSpecificRequirements] =
    useState<boolean>(false)
  const [preexistingSSCRequirementsId, setPreexistingSSCRequirementsId] = useState<number>(0)
  const [preexistingProgamSpecificRequirementsId, setPreexistingProgamSpecificRequirementsId] =
    useState<number>(0)

  // SeSSION
  const handleChangeSessionData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSessionData, e)
  }

  const handleSubmitSession = () => {}
  // FACULTY
  const handleChangeFaculty = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setFacultyData, e, index)
    } else {
      handleChange(setFacultyData, e)
    }
  }

  const handleSubmitFaculty = () => {}
  const addFaculty = () => {
    setFacultyData([...facultyData, tempFacultyData])
  }

  const removeFaculty = (index: number) => {
    setFacultyData((prev) => prev.filter((_, i) => i !== index))
  }

  // DEPARTMENT
  const handleChangeDepartment = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setDepartmentData, e, index)
    } else {
      handleChange(setDepartmentData, e)
    }
  }
  const handleSubmitDepartment = () => {}
  const addDepartment = () => {
    setDepartmentData([...departmentData, tempDeptData])
  }

  // SSC REQUIREMENTS
  const handleChangeProgramSSCRequirement = (
    e: React.ChangeEvent<HTMLSelectElement>,
    programIndex: number,
    sscIndex: number
  ) => {
    handleChangeArrayInArray(e, setProgramData, programIndex, sscIndex)
  }

  const removeProgramSSCRequirement = (parentIndex: number, childIndex: number) => {
    handleRemoveFromArrayOfArrays(parentIndex, childIndex, setProgramData, 'sscRequirements')
  }

  const addProgramSpecificRequirment = (parentIndex: number) => {
    handleAddToArrayOfArrays(
      parentIndex,
      setProgramData,
      'programSpecificRequirements',
      tempProgramSpecificRequirement
    )
  }

  const removeProgramSpecificRequirment = (parentIndex: number, childIndex: number) => {
    handleRemoveFromArrayOfArrays(
      parentIndex,
      childIndex,
      setProgramData,
      'programSpecificRequirements'
    )
  }

  // SSC REQUIREMENTS
  const handleChangeSSCRequirement = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    handleArrayOfObjectsChange(setSCCRequirementsData, e, index)
  }

  const handleSubmitSSCRequirement = () => {}

  const removeSSCRequirement = (index: number) => {
    setSCCRequirementsData((prev) => prev.filter((_, i) => i !== index))
  }

  // PROGRAM SPECIFIC
  const handleChangeProgramData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setProgramData, e)
  }
  const handleSubmitProgram = () => {
    // Add program
  }
  const handleChangeProgramSpecificRequirementsData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    handleArrayOfObjectsChange(setProgramSpecificRequirementsData, e, index)
  }

  return {
    //SESSION
    sessionData,
    handleChangeSessionData,
    handleSubmitSession,
    // FACULTY
    facultyData,
    handleChangeFaculty,
    addFaculty,
    removeFaculty,
    handleSubmitFaculty,

    // DEPARTMENT
    departmentData,
    handleChangeDepartment,
    handleSubmitDepartment,
    addDepartment,

    // SSC
    sscRequirementsData,
    handleChangeSSCRequirement,
    handleSubmitSSCRequirement,
    removeSSCRequirement,
    handleChangeProgramSSCRequirement,

    removeProgramSSCRequirement,
    // PROGRAM
    programData,
    handleChangeProgramData,
    handleSubmitProgram,
    // PROGRAM SPECIFIC
    programSpecificRequirementsData,
    handleChangeProgramSpecificRequirementsData,
    removeProgramSpecificRequirment,
    addProgramSpecificRequirment,

    // Flags (optional if you want to expose)
    preexistingSSCRequirements,
    setPreexistingSSCRequirements,
    preexistingSSCRequirementsId,
    setPreexistingSSCRequirementsId,
    preexistingProgamSpecificRequirements,
    setPreexistingProgamSpecificRequirements,
    preexistingProgamSpecificRequirementsId,
    setPreexistingProgamSpecificRequirementsId
  }
}
