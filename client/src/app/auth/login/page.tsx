'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { FieldRenderer } from '@/components/FieldRenderer'
import { FieldType } from '@/types/fields_config'

const LoginPage = () => {
  const {
    submitting,
    login,
    handleChangeLoginData,
    loginData,
    
    error: apiError,
    validationErrors
  } = useAuth()

 const fieldsConfig = {
      email: { type: 'text' as FieldType, onChangeHandler: handleChangeLoginData },
    
     
      password: { type: 'date' as FieldType, onChangeHandler: handleChangeLoginData },
  
    }
  return (
    <FieldRenderer fieldsConfig={fieldsConfig}/>
  )

export default LoginPage
