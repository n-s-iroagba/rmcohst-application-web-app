'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { ForgotPasswordRequestDto } from '@/types/auth.types'



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



  return (
    <div className="max-w-md mx-auto">
     

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
