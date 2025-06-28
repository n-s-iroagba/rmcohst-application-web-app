import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import { CustomForm } from './CustomForm'
import { FieldType } from '@/types/fields_config'
import { UserCircleIcon } from 'lucide-react'

type SignupFormProps = {
  signupRole: SignUpRole

}

const SignupForm: React.FC<SignupFormProps> = ({ signupRole }) => {
  const {
    handleCancel,
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
      formLabel="Create An Account to Apply"
      icon={<UserCircleIcon/>}
      onSubmit={() => handleSubmitSignup(signupRole)} onCancel={handleCancel}    />
  )
}

export default SignupForm
