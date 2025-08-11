'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { ForgotPasswordRequestDto } from '@/types/auth.types'
import { FORGOT_PASSWORD_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'

const ForgotPasswordForm: React.FC = () => {
  const { forgotPasswordRequest, forgotPassword, forgotPasswordChangeHandler, loading, error } =
    useAuth()

  const { navigateToLogin } = useRoutes()
  const { setFieldConfigInput, setChangeHandlers } =
    useFieldConfigContext<ForgotPasswordRequestDto>()

  useEffect(() => {
    setFieldConfigInput({
      email: 'email'
    })
    setChangeHandlers(forgotPasswordChangeHandler)
  }, [setFieldConfigInput, setChangeHandlers, forgotPasswordChangeHandler])

  const TEST_ID_BASE = 'forgot-password-form'
  testIdContext.setContext(FORGOT_PASSWORD_DEFAULT_DATA, TEST_ID_BASE)

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <CustomForm
        data={forgotPasswordRequest}
        submitHandler={forgotPassword}
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
