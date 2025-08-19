'use client'

import { CustomForm } from '@/components/CustomForm'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { useAuth } from '@/hooks/useAuth'
import { useRoutes } from '@/hooks/useRoutes'
import { signUpFormConfig } from '@/test/config/loginFormConfig'
import { signUpFormTestIds } from '@/test/testIds/formTestIds'
import { SignUpRequestDto } from '@/types/auth.types'
import React, { useEffect } from 'react'

const SignupForm: React.FC = () => {
  const { signUpRequest, signUp, loading, signupChangeHandlers, error } = useAuth()

  const { navigateToHome } = useRoutes()
  const { createFieldsConfig } = useFieldConfigContext<SignUpRequestDto>()

  useEffect(() => {
    createFieldsConfig(signUpFormConfig, signupChangeHandlers)
  }, [createFieldsConfig, signupChangeHandlers])


  testIdContext.setContext(signUpFormTestIds)

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
