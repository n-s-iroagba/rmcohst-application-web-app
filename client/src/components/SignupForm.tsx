import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SignUpRole } from '@/types/role.types'
import { formatCamelCase } from '@/utils/formatCamelCase'
import ErrorAlert from './ErrorAlert'

type RegisterData = {
  email: string
  password: string
  firstName: string
  lastName: string
  confirmPassword: string
}

type SignupFormProps = {
  role: SignUpRole
  formLabel: string
  submitButtonLabel: string
}

const SignupForm: React.FC<SignupFormProps> = ({ role, formLabel, submitButtonLabel }) => {
  const {
    signupData,
    handleChangeSignupData,
    handleSubmitSignup,
    error: apiError,
    validationErrors
  } = useAuth()

  return (
    <form onSubmit={(e) => handleSubmitSignup(e, role)}>
      <h2>{formLabel}</h2>

      {Object.keys(signupData).map((key) => {
        const typedKey = key as keyof RegisterData
        return (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <label htmlFor={key}>{formatCamelCase(key)}</label>
            <input
              id={key}
              name={key}
              type={key === 'password' || key === 'confirmPassword' ? 'password' : 'text'}
              onChange={handleChangeSignupData}
              value={signupData[typedKey]}
            />
            {validationErrors[typedKey] && (
              <p style={{ color: 'red', fontSize: '0.8rem' }}>{validationErrors[typedKey]}</p>
            )}
          </div>
        )
      })}

      {apiError && <ErrorAlert message={apiError} />}

      <button type="submit">{submitButtonLabel}</button>
    </form>
  )
}

export default SignupForm
