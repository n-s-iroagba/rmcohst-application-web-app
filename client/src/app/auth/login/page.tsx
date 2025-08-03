'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { LoginRequestDto } from '@/types/auth.types'
import { SIGNUP_FORM_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'



const LoginForm: React.FC = () => {
  const {
    loginRequest,
    login,
    loading,
    signupChangeHandlers,
    error
  } = useAuth()

  const { navigateToHome, navigateToLogin } = useRoutes()
  const {  setFieldConfigInput,setChangeHandlers } = useFieldConfigContext<LoginRequestDto>()

  // Move the context setters inside useEffect to prevent infinite re-renders
  useEffect(() => {
    setFieldConfigInput({
       email: 'email',
      password: 'password',
    })
    setChangeHandlers(signupChangeHandlers)
  }, [setFieldConfigInput])

// const TEST_ID_BASE = 'signup-form';
// testIdContext.setContext(SIGNUP_FORM_DEFAULT_DATA, TEST_ID_BASE);


  return (
    <CustomForm 
      data={loginRequest} 
      submitHandler={login} 
      formLabel={'Applicant Sign Up'} 
      onCancel={navigateToHome} 
      submiting={loading} 
      error={error} 
    />
  )
}

export default LoginForm
