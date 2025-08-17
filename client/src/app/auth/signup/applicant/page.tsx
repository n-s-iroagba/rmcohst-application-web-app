'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SignUpRequestDto } from '@/types/auth.types'
import { testIdContext } from '@/test/utils/testIdContext'
import { signUpFormConfig } from '@/utils/loginFormConfig'
import { signUpFormTestIds } from '@/utils/formTestIds'

const SignupForm: React.FC = () => {
  const { signUpRequest, signUp, loading, signupChangeHandlers, error } = useAuth()

  const { navigateToHome } = useRoutes()
  const { createFieldsConfig  } = useFieldConfigContext<SignUpRequestDto>()

  useEffect(() => {
    createFieldsConfig(signUpFormConfig,signupChangeHandlers)
  }, [createFieldsConfig,signupChangeHandlers])


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
