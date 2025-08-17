'use client'
import React, { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { CustomForm } from '@/components/CustomForm'
import { useRoutes } from '@/hooks/useRoutes'
import { useFieldConfigContext } from '@/context/FieldConfigContext'
import { ForgotPasswordRequestDto } from '@/types/auth.types'
import { testIdContext } from '@/test/utils/testIdContext'
import { forgotPasswordFormConfig } from '@/utils/loginFormConfig'
import { forgotPasswordTestIds } from '@/utils/formTestIds'



const ForgotPasswordForm: React.FC = () => {
  const { forgotPasswordRequest, forgotPassword, forgotPasswordChangeHandler, loading, error } =
    useAuth()

  const { navigateToLogin } = useRoutes()
  const { createFieldsConfig  } = useFieldConfigContext<ForgotPasswordRequestDto>()

  useEffect(() => {
    createFieldsConfig(forgotPasswordFormConfig,forgotPasswordChangeHandler)
  }, [createFieldsConfig,forgotPasswordChangeHandler])


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
