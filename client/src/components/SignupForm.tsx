import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import { CustomForm } from './CustomForm'

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
  const fieldsConfig = {}
  return (
    <CustomForm
      data={signupData}
      fieldsConfig={fieldsConfig}
      onSubmit={() => handleSubmitSignup(signupRole)}
    />
  )
}

export default SignupForm
