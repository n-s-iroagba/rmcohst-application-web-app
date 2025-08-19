'use client'
import { CustomForm } from '@/components/CustomForm'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { useAuth } from '@/hooks/useAuth'
import { useRoutes } from '@/hooks/useRoutes'
import { loginFormConfig } from '@/test/config/loginFormConfig'
import { loginFormTestIds } from '@/test/testIds/formTestIds'
import { LoginRequestDto } from '@/types/auth.types'
import React, { useEffect } from 'react'


const LoginForm: React.FC = () => {
  const { loginRequest, login, loading, loginChangeHandlers, error } = useAuth()

  const { navigateToHome, navigateToSignup } = useRoutes()
  const { createFieldsConfig } = useFieldConfigContext<LoginRequestDto>()

  useEffect(() => {
    createFieldsConfig(loginFormConfig, loginChangeHandlers)
  }, [createFieldsConfig, loginChangeHandlers])


  testIdContext.setContext(loginFormTestIds)


  return (
    <CustomForm
      data={loginRequest}
      submitHandler={login}
      formLabel={'Login'}
      onCancel={navigateToHome}
      submiting={loading}
      error={error}
      additionalActions={[
        {
          label: "Don't have an account? Sign up",
          onClick: navigateToSignup,
          type: 'link'
        }
      ]}
    />
  )
}

export default LoginForm
