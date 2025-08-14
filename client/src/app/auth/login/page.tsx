'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { LoginRequestDto } from '@/types/auth.types'
import { LOGIN_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'
import { loginFormTestIds } from '@/utils/formTestIds'


const LoginForm: React.FC = () => {
  const { loginRequest, login, loading, loginChangeHandlers, error } = useAuth()

  const { navigateToHome, navigateToSignup } = useRoutes()
  const { setFieldConfigInput, setChangeHandlers } = useFieldConfigContext<LoginRequestDto>()

  useEffect(() => {
    setFieldConfigInput({
      email: 'email',
      password: 'password'
    })
   
    setChangeHandlers(loginChangeHandlers)
  }, [setFieldConfigInput, setChangeHandlers])
  console.log('testIds',loginFormTestIds)
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
