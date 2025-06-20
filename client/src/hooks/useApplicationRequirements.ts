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
import { SSCSubjectMinimumGradeCreationDto } from '@/types/ssc_subject_minimum_grade' // Assumed correct import path
import { ProgramCreationDto } from '@/types/program'
import { ProgramSpecificRequirementCreationDto } from '@/types/program_specific_requirement'

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

const tempSSCRequirement: SSCSubjectMinimumGradeCreationDto = {
  sscSubjectId: 0,
  minimumGradeId: ''
}

const tempProgramSpecificRequirement: ProgramSpecificRequirementCreationDto = {
  qualificationType: '',
  minimumGrade: ''
}

export const useApplicationRequirments = () => {
  const [sessionData, setSessionData] = useState<AcademicSessionCreationDto[]>([])
  const [facultyData, setFacultyData] = useState<FacultyCreationDto[]>([])
  const [departmentData, setDepartmentData] = useState<DepartmentCreationDto[]>([tempDeptData])
  const [sscRequirmentsData, setSCCRequirementsData] = useState<
    SSCSubjectMinimumGradeCreationDto[]
  >([])
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
  const handleChangeSession = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSessionData, e)
  }
  // FACULTY
  const handleChangeFaculty = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setFacultyData, e, index)
    } else {
      handleChange(setFacultyData, e)
    }
  }

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

  const addProgramSSCRequirement = (parentIndex: number) => {
    handleAddToArrayOfArrays(parentIndex, setProgramData, 'sscRequirements', tempSSCRequirement)
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

  const addSSCRequirement = () => {
    setSCCRequirementsData((prev) => [...prev, tempSSCRequirement])
  }

  const removeSSCRequirement = (index: number) => {
    setSCCRequirementsData((prev) => prev.filter((_, i) => i !== index))
  }

  // PROGRAM SPECIFIC
  const handleChangeProgramData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setProgramData, e)
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
    handleChangeSession,
    // FACULTY
    facultyData,
    handleChangeFaculty,
    addFaculty,
    removeFaculty,

    // DEPARTMENT
    departmentData,
    handleChangeDepartment,
    addDepartment,

    // SSC
    sscRequirmentsData,
    handleChangeSSCRequirement,
    addSSCRequirement,
    removeSSCRequirement,
    handleChangeProgramSSCRequirement,
    addProgramSSCRequirement,
    removeProgramSSCRequirement,
    // PROGRAM
    programData,
    handleChangeProgramData,
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
