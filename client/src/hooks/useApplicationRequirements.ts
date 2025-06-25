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
import { post } from '@/utils/apiClient'
import { apiRoutes } from '@/constants/apiRoutes'

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

  // ========== SESSION MANAGEMENT ==========
  const handleChangeSessionData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSessionData, e)
  }

  const handleSubmitSession = async () => {
    try {
      const response = await post(apiRoutes.academicSession.create, sessionData)
      console.log('Session created successfully:', response)
      return response
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  // ========== FACULTY MANAGEMENT ==========
  const handleChangeFaculty = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setFacultyData, e, index)
    } else {
      handleChange(setFacultyData, e)
    }
  }

  const handleSubmitFaculty = async () => {
    try {
      const promises = facultyData.map((faculty) => post(apiRoutes.faculty.create, faculty))
      const responses = await Promise.all(promises)
      console.log('Faculties created successfully:', responses)
      return responses
    } catch (error) {
      console.error('Error creating faculties:', error)
      throw error
    }
  }

  const addFaculty = () => {
    setFacultyData([...facultyData, { ...tempFacultyData }])
  }

  const removeFaculty = (index: number) => {
    setFacultyData((prev) => prev.filter((_, i) => i !== index))
  }

  // ========== DEPARTMENT MANAGEMENT ==========
  const handleChangeDepartment = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setDepartmentData, e, index)
    } else {
      handleChange(setDepartmentData, e)
    }
  }

  const handleSubmitDepartment = async () => {
    try {
      const promises = departmentData.map((department) =>
        post(apiRoutes.department.create, department)
      )
      const responses = await Promise.all(promises)
      console.log('Departments created successfully:', responses)
      return responses
    } catch (error) {
      console.error('Error creating departments:', error)
      throw error
    }
  }

  const addDepartment = () => {
    setDepartmentData([...departmentData, { ...tempDeptData }])
  }

  const removeDepartment = (index: number) => {
    setDepartmentData((prev) => prev.filter((_, i) => i !== index))
  }

  // ========== SSC REQUIREMENTS MANAGEMENT ==========
  const handleChangeSSCRequirement = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    handleArrayOfObjectsChange(setSCCRequirementsData, e, index)
  }

  const handleSubmitSSCRequirement = async () => {
    try {
      const promises = sscRequirementsData.map((requirement) =>
        post(apiRoutes.sscRequirement.create, requirement)
      )
      const responses = await Promise.all(promises)
      console.log('SSC requirements created successfully:', responses)
      return responses
    } catch (error) {
      console.error('Error creating SSC requirements:', error)
      throw error
    }
  }

  const addSSCRequirement = (newRequirement: ProgramSSCRequirement) => {
    setSCCRequirementsData([...sscRequirementsData, newRequirement])
  }

  const removeSSCRequirement = (index: number) => {
    setSCCRequirementsData((prev) => prev.filter((_, i) => i !== index))
  }

  // ========== PROGRAM SSC REQUIREMENTS MANAGEMENT ==========
  const handleChangeProgramSSCRequirement = (
    e: React.ChangeEvent<HTMLSelectElement>,
    programIndex: number,
    sscIndex: number
  ) => {
    handleChangeArrayInArray(e, setProgramData, programIndex, sscIndex)
  }

  const addProgramSSCRequirement = (parentIndex: number, requirement: ProgramSSCRequirement) => {
    handleAddToArrayOfArrays(parentIndex, setProgramData, 'sscRequirements', requirement)
  }

  const removeProgramSSCRequirement = (parentIndex: number, childIndex: number) => {
    handleRemoveFromArrayOfArrays(parentIndex, childIndex, setProgramData, 'sscRequirements')
  }

  // ========== PROGRAM SPECIFIC REQUIREMENTS MANAGEMENT ==========
  const handleChangeProgramSpecificRequirementsData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    handleArrayOfObjectsChange(setProgramSpecificRequirementsData, e, index)
  }

  const handleSubmitProgramSpecificRequirements = async () => {
    try {
      const promises = programSpecificRequirementsData.map((requirement) =>
        post(apiRoutes.programSpecificRequirement.create, requirement)
      )
      const responses = await Promise.all(promises)
      console.log('Program specific requirements created successfully:', responses)
      return responses
    } catch (error) {
      console.error('Error creating program specific requirements:', error)
      throw error
    }
  }

  const addProgramSpecificRequirment = (parentIndex: number) => {
    handleAddToArrayOfArrays(parentIndex, setProgramData, 'programSpecificRequirements', {
      ...tempProgramSpecificRequirement
    })
  }

  const removeProgramSpecificRequirment = (parentIndex: number, childIndex: number) => {
    handleRemoveFromArrayOfArrays(
      parentIndex,
      childIndex,
      setProgramData,
      'programSpecificRequirements'
    )
  }

  const addStandaloneProgramSpecificRequirement = () => {
    setProgramSpecificRequirementsData([
      ...programSpecificRequirementsData,
      { ...tempProgramSpecificRequirement }
    ])
  }

  const removeStandaloneProgramSpecificRequirement = (index: number) => {
    setProgramSpecificRequirementsData((prev) => prev.filter((_, i) => i !== index))
  }

  // ========== PROGRAM MANAGEMENT ==========
  const handleChangeProgramData = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (index !== undefined) {
      handleArrayOfObjectsChange(setProgramData, e, index)
    } else {
      handleChange(setProgramData, e)
    }
  }

  const handleSubmitProgram = async () => {
    try {
      const promises = programData.map((program) => post(apiRoutes.program.create, program))
      const responses = await Promise.all(promises)
      console.log('Programs created successfully:', responses)
      return responses
    } catch (error) {
      console.error('Error creating programs:', error)
      throw error
    }
  }

  const addProgram = (newProgram: ProgramCreationDto) => {
    setProgramData([...programData, newProgram])
  }

  const removeProgram = (index: number) => {
    setProgramData((prev) => prev.filter((_, i) => i !== index))
  }

  return {
    // ========== SESSION ==========
    sessionData,
    handleChangeSessionData,
    handleSubmitSession,

    // ========== FACULTY ==========
    facultyData,
    handleChangeFaculty,
    addFaculty,
    removeFaculty,
    handleSubmitFaculty,

    // ========== DEPARTMENT ==========
    departmentData,
    handleChangeDepartment,
    handleSubmitDepartment,
    addDepartment,
    removeDepartment,

    // ========== SSC REQUIREMENTS ==========
    sscRequirementsData,
    handleChangeSSCRequirement,
    handleSubmitSSCRequirement,
    addSSCRequirement,
    removeSSCRequirement,

    // ========== PROGRAM SSC REQUIREMENTS ==========
    handleChangeProgramSSCRequirement,
    addProgramSSCRequirement,
    removeProgramSSCRequirement,

    // ========== PROGRAM SPECIFIC REQUIREMENTS ==========
    programSpecificRequirementsData,
    handleChangeProgramSpecificRequirementsData,
    handleSubmitProgramSpecificRequirements,
    addProgramSpecificRequirment,
    removeProgramSpecificRequirment,
    addStandaloneProgramSpecificRequirement,
    removeStandaloneProgramSpecificRequirement,

    // ========== PROGRAM ==========
    programData,
    handleChangeProgramData,
    handleSubmitProgram,
    addProgram,
    removeProgram,

    // ========== FLAGS ==========
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
