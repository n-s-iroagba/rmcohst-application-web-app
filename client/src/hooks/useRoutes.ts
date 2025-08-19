'use client'

import { INTERNAL_ROUTES } from '@/constants/routes'
import { UserRole } from '@/types/auth.types'
import { useRouter } from 'next/navigation'

export const useRoutes = () => {
  const router = useRouter()

  const navigateToHome = () => {
    router.push(INTERNAL_ROUTES.HOME)
  }

  const navigateToLogin = () => {
    router.push(INTERNAL_ROUTES.AUTH.LOGIN)
  }

  const navigateToSignup = () => {
    router.push(INTERNAL_ROUTES.AUTH.SIGNUP)
  }

  const navigateToVerifyEmail = (token: string, id: number) => {
    router.push(INTERNAL_ROUTES.AUTH.VERIFY_EMAIL(token, id))
  }

  const navigateToResetPassword = (token: string) => {
    router.push(INTERNAL_ROUTES.AUTH.RESET_PASSWORD(token))
  }

  const navigateToDashboard = (role: UserRole) => {
    router.push(INTERNAL_ROUTES.DASHBOARD(role))
  }

  const navigateToDepartmentDetails = (id: number) => {
    router.push(INTERNAL_ROUTES.DEPARTMENT.GET_BY_ID(id))
  }
  const navigateToFacultyDetails = (id: number) => {
    router.push(INTERNAL_ROUTES.FACULTY.GET_BY_ID(id))
  }
  const navigateToEditDepartment = (id: number) => {
    router.push(INTERNAL_ROUTES.DEPARTMENT.EDIT(id))
  }
  const navigateToEditFaculty = (id: number) => {
    router.push(INTERNAL_ROUTES.FACULTY.EDIT(id))
  }

  const navigateToAdmissionSessionDetails = (id: number) => {
    router.push(INTERNAL_ROUTES.ACADEMIC_SESSION.GET_BY_ID(id))
  }

  const navigateToProgramSSCRequirementDetails = (id: number) => {
    router.push(INTERNAL_ROUTES.PROGRAM_SSC_REQUIREMENT.GET_BY_ID(id))
  }

  const navigateToProgramSpecificRequirementDetails = (id: number) => {
    router.push(INTERNAL_ROUTES.PROGRAM_SPECIFIC_REQUIREMENT.GET_BY_ID(id))
  }
  const navigateToSelectProgram = () => {
    router.push(INTERNAL_ROUTES.APPLICATION.SELECT_PROGRAM)
  }
  return {
    navigateToHome,
    navigateToLogin,
    navigateToSignup,
    navigateToVerifyEmail,
    navigateToResetPassword,
    navigateToDashboard,
    navigateToDepartmentDetails,
    navigateToFacultyDetails,
    navigateToEditDepartment,
    navigateToEditFaculty,
    navigateToAdmissionSessionDetails,
    navigateToProgramSSCRequirementDetails,
    navigateToProgramSpecificRequirementDetails,
    navigateToSelectProgram
  }
}
