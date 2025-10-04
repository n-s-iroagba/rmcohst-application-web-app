'use client'
import { CustomForm } from '@/components/CustomForm'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { useAuth } from '@/hooks/useAuth'
import { useRoutes } from '@/hooks/useRoutes'
import { forgotPasswordFormConfig } from '@/test/config/loginFormConfig'
import { forgotPasswordTestIds } from '@/test/testIds/formTestIds'
import { ForgotPasswordRequestDto } from '@/types/auth.types'
import React, { useEffect, useState } from 'react'
import { createFieldsConfig } from '../../../helpers/createFieldConfig'
import { ApiError, handleError } from '../../../helpers/handleError'

const ForgotPasswordForm: React.FC = () => {
  const { forgotPasswordRequest, forgotPassword, forgotPasswordChangeHandler, loading } =

    useAuth()
  const [error, setError] = useState<string>('')
  const { navigateToLogin } = useRoutes()
  const { setFieldsConfig } = useFieldConfigContext<ForgotPasswordRequestDto>()
  const [emailSent, setEmailSent] = useState(false)
  const [sentToEmail, setSentToEmail] = useState('')

  useEffect(() => {
    setFieldsConfig(createFieldsConfig(forgotPasswordFormConfig, forgotPasswordChangeHandler))
  }, [])

  testIdContext.setContext(forgotPasswordTestIds)

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await forgotPassword(e)
      // If successful, store the email and show success view
      setSentToEmail(forgotPasswordRequest.email || '')
      setEmailSent(true)
    } catch (error) {


      console.error('Forgot password failed:', error)
      handleError(error as ApiError, setError)
    }
  }

  const handleBackToForm = () => {
    setEmailSent(false)
    setSentToEmail('')
    setError('')
  }

  // Email sent confirmation view
  if (emailSent) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a password reset link to:
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-6">
              {sentToEmail}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your email and follow the instructions to reset your password.
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={navigateToLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Back to Login
            </button>
            <button
              onClick={handleBackToForm}
              className="w-full text-blue-600 hover:text-blue-800 py-2 px-4 text-sm underline"
            >
              Send to a different email
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Original form view
  return (
    <div className="max-w-md mx-auto">
      <CustomForm
        data={forgotPasswordRequest}
        submitHandler={handleForgotPassword}
        formLabel={'Send Reset Link'}
        onCancel={navigateToLogin}
        submiting={loading}
        error={error}
        additionalActions={[
          {
            label: 'Remember your password? Login',
            onClick: navigateToLogin,
            type: 'link'
          }
        ]}
      />
    </div>
  )
}

export default ForgotPasswordForm