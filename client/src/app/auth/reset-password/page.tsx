'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { ResetPasswordRequestDto } from '@/types/auth.types'
import { RESET_PASSWORD_DEFAULT_DATA } from '@/constants/auth'
import { testIdContext } from '@/test/utils/testIdContext'

const ResetPasswordForm: React.FC = () => {
  const { resetPasswordRequest, resetPassword, loading, error } = useAuth()

  const { navigateToLogin } = useRoutes()
  const { setFieldConfigInput, setChangeHandlers } =
    useFieldConfigContext<Partial<ResetPasswordRequestDto>>()

  useEffect(() => {
    setFieldConfigInput({
      password: 'password',
      confirmPassword: 'password'
    })
  }, [setFieldConfigInput, setChangeHandlers])

  const TEST_ID_BASE = 'reset-password-form'
  testIdContext.setContext(RESET_PASSWORD_DEFAULT_DATA, TEST_ID_BASE)

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
      </div>

      <CustomForm
        data={resetPasswordRequest}
        submitHandler={resetPassword}
        formLabel={'Reset Password'}
        onCancel={navigateToLogin}
        submiting={loading}
        error={error}
      />
    </div>
  )
}

export default ResetPasswordForm
