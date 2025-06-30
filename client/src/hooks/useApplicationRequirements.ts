import { useState } from 'react'
import {
  
  handleArrayOfObjectsChange,
  handleChange,

} from '@/helpers/handleChange'

import { AcademicSessionCreationDto } from '@/types/academic_session'
import { DepartmentCreationDto } from '@/types/department'
import { FacultyCreationDto } from '@/types/faculty'
import { ProgramCreationDto } from '@/types/program'
import { ProgramSpecificRequirementCreationDto } from '@/types/program_specific_requirement'
import { ProgramSSCRequirement } from '@/types/program_ssc_requirement'
import  { post } from '@/utils/apiClient'
import { apiRoutes } from '@/constants/apiRoutes'
import { useRouter } from 'next/navigation'
import { GradeCreationDto } from '@/types/grade'
import { SSCSubject, SSCSubjectCreationAttributes } from '@/types/ssc_subject'

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

const tempGradeData:GradeCreationDto = {

  grade:'',

  gradePoint: 0
}
export const useApplicationRequirements = () => {
  const [sessionData, setSessionData] = useState<AcademicSessionCreationDto>({
    name: '',
    applicationStartDate: new Date(),
    applicationEndDate: new Date()
  })
  const [error, setError] = useState('')
  const [facultyData, setFacultyData] = useState<FacultyCreationDto[]>([tempFacultyData])
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
  const [gradeData, setGradeData] = useState<GradeCreationDto[]>([tempGradeData])
  const [subject, setSubjects] = useState<SSCSubjectCreationAttributes[]>([{name:''}])
  const router = useRouter()
  const handleCancel = ()=>{
    router.push('/')
  }
  const handleChangeSubject = (e:React.ChangeEvent<HTMLInputElement>)=>{
    handleChange(setSubjects,e)
  }
  const handleSubmitSubject = ()=>{}
  // ========== SESSION MANAGEMENT ==========
  const handleChangeSessionData = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(setSessionData, e)
  }

  const handleSubmitSession = async () => {
    const payload = {
  ...sessionData,
  applicationStartDate: new Date(sessionData.applicationStartDate).toISOString(),
  applicationEndDate: new Date(sessionData.applicationEndDate).toISOString(),
}

    try {
    await post(apiRoutes.academicSession.create, payload)
 
      window.location.reload()
    } catch (error:any) {
      console.error('Error creating session:', error)
       const message = error.response?.data?.message||'Error creating session'
      setError(message)
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
       await post(apiRoutes.faculty.create,facultyData)
     
      
    } catch (error) {
      console.error('Error creating faculties:', error)
      
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
      
    }
  }

  const addSSCRequirement = (newRequirement: ProgramSSCRequirement) => {
    setSCCRequirementsData([...sscRequirementsData, newRequirement])
  }

  const removeSSCRequirement = (index: number) => {
    setSCCRequirementsData((prev) => prev.filter((_, i) => i !== index))
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
      
    }
  }

  const addProgramSpecificRequirment = (parentIndex: number) => {
    console.log(parentIndex)
    // handleAddToArrayOfArrays(parentIndex, setProgramData, 'programSpecificRequirements', {
    //   ...tempProgramSpecificRequirement
    // })
  }

  const removeProgramSpecificRequirment = (parentIndex: number, childIndex: number) => {
    // handleRemoveFromArrayOfArrays(
    //   parentIndex,
    //   childIndex,
    //   setProgramData,
    //   'programSpecificRequirements'
    // )
    console.log(parentIndex,childIndex)
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
      
    }
  }
  const handleSubmitGrade = ()=>{}
  const handleChangeGrade = (e: React.ChangeEvent<HTMLInputElement>)=>{
    handleChange(setGradeData,e)
  }
  const addProgram = (newProgram: ProgramCreationDto) => {
    setProgramData([...programData, newProgram])
  }

  const removeProgram = (index: number) => {
    setProgramData((prev) => prev.filter((_, i) => i !== index))
  }

  return {
    error,
    handleCancel,
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

    subject,
    handleChangeSubject,
    handleSubmitSubject,

    gradeData,
    handleSubmitGrade,
    handleChangeGrade,

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
