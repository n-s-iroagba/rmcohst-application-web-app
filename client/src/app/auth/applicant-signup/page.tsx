'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { SignUpRequestDto } from '@/types/auth.types'

type SignupFormProps = {
  signupRole: SignUpRole
}

const SignupForm: React.FC<SignupFormProps> = ({ signupRole }) => {
  const {
    signUpRequest,
    signUp,
    loading,
    signupChangeHandlers,
    error
  } = useAuth()

  const { navigateToHome, navigateToLogin } = useRoutes()
  const {  setFieldConfigInput,setChangeHandlers } = useFieldConfigContext<SignUpRequestDto>()

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