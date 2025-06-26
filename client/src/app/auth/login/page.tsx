'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FieldType } from '@/types/fields_config'
import { CustomForm } from '@/components/CustomForm'

const LoginPage = () => {
  const {
    submitting,
    login,
    handleChangeLoginData,
    loginData,
    handleSubmitLogin,
    error: apiError,
    validationErrors
  } = useAuth()

 const fieldsConfig = {
      email: { type: 'text' as FieldType, onChangeHandler: handleChangeLoginData },
    
     
      password: { type: 'date' as FieldType, onChangeHandler: handleChangeLoginData },
  
    }
  return (
    <CustomForm
      data={loginData}
      fieldsConfig={fieldsConfig}
      submiting={submitting}
      onSubmit={() => handleSubmitLogin()}
    />
  )
}

export default LoginPage
