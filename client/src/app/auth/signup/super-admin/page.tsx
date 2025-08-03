'use client'

import { CustomForm } from "@/components/CustomForm"
import { SIGNUP_FORM_DEFAULT_DATA } from "@/constants/auth"
import { useFieldConfigContext } from "@/context/FieldConfigContext"
import { useAuth } from "@/hooks/useAuth"
import { useRoutes } from "@/hooks/useRoutes"
import { testIdContext } from "@/test/utils/testIdContext"
import { SignUpRequestDto } from "@/types/auth.types"
import { useEffect } from "react"

const SuperAdminSignupForm: React.FC = () => {
  const {
    superAdminSignUpRequest,
    signUpSuperAdmin,
    loading,
    error
  } = useAuth()

  const { navigateToHome, navigateToLogin } = useRoutes()
  const { setFieldConfigInput, setChangeHandlers } = useFieldConfigContext<SignUpRequestDto>()

  useEffect(() => {
    setFieldConfigInput({
      username: 'text',
      email: 'email',
      password: 'password',
      confirmPassword: 'password'
    })
    // Note: No change handlers provided for super admin signup in the hook
  }, [setFieldConfigInput, setChangeHandlers])

  const TEST_ID_BASE = 'super-admin-signup-form'
  testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, TEST_ID_BASE)

  return (
    <CustomForm
      data={superAdminSignUpRequest}
      submitHandler={signUpSuperAdmin}
      formLabel={'Super Admin Sign Up'}
      onCancel={navigateToHome}
      submiting={loading}
      error={error}
    />
  )
}

export default SuperAdminSignupForm