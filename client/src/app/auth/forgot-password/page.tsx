'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import {  FieldType } from '@/types/fields_config'

const ForgotPasswordFormPage = () => {
  const {
    handleCancel,
    submitting,
    forgotPasswordData,
    handleChangeForgotPasswordData,
    handleSubmitForgotPassword,
    error: apiError,
    validationErrors
  } = useAuth()

  const fieldsConfig={
    email: {
      type:'text' as FieldType,
      onChangeHandler:  handleChangeForgotPasswordData
  }
  }
  return (
    <CustomForm data={forgotPasswordData} fieldsConfig={fieldsConfig} onSubmit={handleSubmitForgotPassword} formLabel={'Enter Email'}
    onCancel={handleCancel} submiting={submitting} error={apiError}/>
  )
}

export default ForgotPasswordFormPage
