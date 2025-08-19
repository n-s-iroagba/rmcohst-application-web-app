'use client'
import { CustomForm } from '@/components/CustomForm'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { testIdContext } from '@/context/testIdContext'
import { useAuth } from '@/hooks/useAuth'
import { useRoutes } from '@/hooks/useRoutes'
import { forgotPasswordFormConfig } from '@/test/config/loginFormConfig'
import { forgotPasswordTestIds } from '@/test/testIds/formTestIds'
import { ForgotPasswordRequestDto } from '@/types/auth.types'
import React, { useEffect } from 'react'



const ForgotPasswordForm: React.FC = () => {
  const { forgotPasswordRequest, forgotPassword, forgotPasswordChangeHandler, loading, error } =
    useAuth()

  const { navigateToLogin } = useRoutes()
  const { createFieldsConfig } = useFieldConfigContext<ForgotPasswordRequestDto>()

  useEffect(() => {
    createFieldsConfig(forgotPasswordFormConfig, forgotPasswordChangeHandler)
  }, [createFieldsConfig, forgotPasswordChangeHandler])


  testIdContext.setContext(forgotPasswordTestIds)



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
