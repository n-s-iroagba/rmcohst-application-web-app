import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import DynamicFormTextFields from '@/helpers/formFields'
import ErrorAlert from '@/components/ErrorAlert'

const ResetPasswordFormPage = () => {
  const {
    submitting,
    resetPasswordFormData,
    handleChangeForgotPasswordData,
    resetPassword,
    error: apiError,
    validationErrors
  } = useAuth()

  return (
    <form onSubmit={resetPassword}>
      <h2>Enter Registration Email</h2>

      <DynamicFormTextFields
        data={resetPasswordFormData}
        errors={validationErrors}
        onChange={handleChangeForgotPasswordData}
      />

      {apiError && <ErrorAlert message={apiError} />}

      <button disabled={submitting} type="submit">
        {submitting ? 'Submitting' : 'Submit'}
      </button>
    </form>
  )
}

export default ResetPasswordFormPage
