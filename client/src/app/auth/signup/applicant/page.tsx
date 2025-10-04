'use client'

import { CustomForm } from '@/components/CustomForm'
import { useAuth } from '@/hooks/useAuth'
import { useRoutes } from '@/hooks/useRoutes'
import React from 'react'
import { useFieldConfigContext } from '../../../../context/FieldConfigContext'
import { testIdContext } from '../../../../context/testIdContext'
import { createFieldsConfig } from '../../../../helpers/createFieldConfig'
import { signUpFormConfig } from '../../../../test/config/loginFormConfig'
import { signUpFormTestIds } from '../../../../test/testIds/formTestIds'

const SignupForm: React.FC = () => {
  const { signUpRequest, signUp, loading, error, googleLogin, signupChangeHandlers } = useAuth()
  const { setFieldsConfig } = useFieldConfigContext()
  const { navigateToHome } = useRoutes()

  React.useEffect(() => {
    setFieldsConfig(createFieldsConfig(signUpFormConfig, signupChangeHandlers))
  }, [])
  testIdContext.setContext(signUpFormTestIds)

  return (
    <>
      <CustomForm
        data={signUpRequest}
        submitHandler={signUp}
        formLabel={'Applicant Sign Up'}
        onCancel={navigateToHome}
        submiting={loading}
        error={error}
      />

      {/* Google Sign-In Button */}
      <div className="mt-4">
        <button
          onClick={googleLogin}
          type="button"
          className="flex items-center justify-center w-full gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        >
          {/* Official Google G Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.85-6.85C35.5 2.58 30.3 0 24 0 14.62 0 6.68 5.9 2.68 14.34l7.98 6.21C12.22 13.71 17.66 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.64-.15-3.21-.44-4.71H24v9.02h12.72c-.55 2.96-2.18 5.46-4.65 7.14l7.1 5.51c4.16-3.85 6.53-9.54 6.53-16.96z"
            />
            <path
              fill="#FBBC05"
              d="M10.66 28.55A14.47 14.47 0 0 1 9.5 24c0-1.57.27-3.08.75-4.55l-7.98-6.21A23.892 23.892 0 0 0 0 24c0 3.91.93 7.6 2.57 10.86l8.09-6.31z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.1-5.51C30.9 38.78 27.68 40 24 40c-6.34 0-11.78-4.21-13.34-9.95l-8.09 6.31C6.68 42.1 14.62 48 24 48z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </>
  )
}

export default SignupForm

