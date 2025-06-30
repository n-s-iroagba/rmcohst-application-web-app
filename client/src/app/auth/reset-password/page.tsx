
'use client'
import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { FieldType } from '@/types/fields_config'

const ResetPasswordFormPage = () => {
  const {
    submitting,
    resetPasswordFormData,
    handleChangeForgotPasswordData,
    resetPassword,
    error,
  } = useAuth()
 const fieldsConfig = {
    
    
     
      password: { type: 'date' as FieldType, onChangeHandler: handleChangeForgotPasswordData},
      confirmPassword: { type: 'text' as FieldType, onChangeHandler: handleChangeForgotPasswordData},
  
    }
  return (
    <CustomForm data={resetPasswordFormData} fieldsConfig={fieldsConfig} onSubmit={resetPassword} formLabel={''} onCancel={function (): void {
      throw new Error('Function not implemented.')
    } } submiting={submitting} error={error}/>
  )
}

export default ResetPasswordFormPage