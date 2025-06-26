import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import { CustomForm } from './CustomForm'
import { FieldType } from '@/types/fields_config'

type SignupFormProps = {
  signupRole: SignUpRole
  formLabel: string
}

const SignupForm: React.FC<SignupFormProps> = ({ signupRole, formLabel }) => {
  const {
    submitting,
    signupData,
    handleChangeSignupData,
    handleSubmitSignup,
    error: apiError,
    validationErrors
  } = useAuth()
  const fieldsConfig = {
      email: { type: 'text' as FieldType, onChangeHandler: handleChangeSignupData },
    
      lastName: { type: 'text' as FieldType, onChangeHandler: handleChangeSignupData },
      firstName: { type: 'date' as FieldType, onChangeHandler: handleChangeSignupData },

      password: { type: 'date' as FieldType, onChangeHandler: handleChangeSignupData },
      confirmPassword: { type: 'date' as FieldType, onChangeHandler: handleChangeSignupData },
  
    }
  return (
    <CustomForm
      data={signupData}
      fieldsConfig={fieldsConfig}
      submiting={submitting}
      onSubmit={() => handleSubmitSignup(signupRole)}
    />
  )
}

export default SignupForm
