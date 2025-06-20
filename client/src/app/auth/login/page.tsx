'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import DynamicFormTextFields from '@/helpers/formFields'
import ErrorAlert from '@/components/ErrorAlert'

const LoginPage = () => {
  const {
    submitting,
    login,
    handleChangeLoginData,
    loginData,
    error: apiError,
    validationErrors
  } = useAuth()

  return (
    <form onSubmit={login}>
      <h2>Login</h2>

      <DynamicFormTextFields
        data={loginData}
        errors={validationErrors}
        onChange={handleChangeLoginData}
      />

      {apiError && <ErrorAlert message={apiError} />}

      <button disabled={submitting} type="submit">
        {submitting ? 'Submitting' : 'Submit'}
      </button>
    </form>
  )
}

export default LoginPage
