import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import ErrorAlert from './ErrorAlert'
import DynamicFormTextFields from '@/helpers/formFields'

type SignupFormProps = {
  role: SignUpRole
  formLabel: string
}

const SignupForm: React.FC<SignupFormProps> = ({ role, formLabel }) => {
  const {
    submitting,
    signupData,
    handleChangeSignupData,
    handleSubmitSignup,
    error: apiError,
    validationErrors
  } = useAuth()

  return (
    <form onSubmit={(e) => handleSubmitSignup(e, role)}>
      <h2>{formLabel}</h2>
      <DynamicFormTextFields
        data={signupData}
        errors={validationErrors}
        onChange={handleChangeSignupData}
      />

      {apiError && <ErrorAlert message={apiError} />}

      <button disabled={submitting} type="submit">
        {submitting ? 'Submitting' : 'Submit'}
      </button>
    </form>
  )
}

export default SignupForm
