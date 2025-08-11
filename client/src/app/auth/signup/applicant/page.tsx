'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SignUpRequestDto } from '@/types/auth.types'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'

const SignupForm: React.FC = () => {
  const { signUpRequest, signUp, loading, signupChangeHandlers, error } = useAuth()

  const { navigateToHome, navigateToLogin } = useRoutes()
  const { setFieldConfigInput, setChangeHandlers } = useFieldConfigContext<SignUpRequestDto>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
    setFieldConfigInput({
      username: 'text',
      email: 'email',

      password: 'password',
      confirmPassword: 'password'
    })
    setChangeHandlers(signupChangeHandlers)
  }, [setFieldConfigInput])

  const TEST_ID_BASE = 'signup-form'
  testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, TEST_ID_BASE)

  return (
    <CustomForm
      data={signUpRequest}
      submitHandler={signUp}
      formLabel={'Applicant Sign Up'}
      onCancel={navigateToHome}
      submiting={loading}
      error={error}
    />
  )
}

export default SignupForm
