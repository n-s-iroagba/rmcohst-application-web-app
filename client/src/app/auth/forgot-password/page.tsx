import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import DynamicFormTextFields from '@/helpers/formFields'
import ErrorAlert from '@/components/ErrorAlert'


const ForgotPasswordFormPage = () => {
  const {
    submitting,
    forgotPasswordData,
    handleChangeForgotPasswordData,
    forgotPassword,
    error: apiError,
    validationErrors
  } = useAuth()

  return (
    <form onSubmit={forgotPassword}>
      <h2>Enter Registration Email</h2>

   <DynamicFormTextFields
        data={forgotPasswordData}
        errors={validationErrors}
        onChange={handleChangeForgotPasswordData}
      />

      {apiError && <ErrorAlert message={apiError} />}

      <button disabled={submitting} type="submit">{submitting?'Submitting':'Submit'}</button>
    </form>
  )
}

export default ForgotPasswordFormPage
