'use client';

import { CustomForm } from '@/components/CustomForm';
import { useFieldConfigContext } from '@/context/FieldConfigContext';
import { testIdContext } from '@/context/testIdContext';
import { useAuth } from '@/hooks/useAuth';
import { useRoutes } from '@/hooks/useRoutes';
import { resetPasswordFormConfig } from '@/test/config/loginFormConfig';
import { resetPasswordTestIds } from '@/test/testIds/formTestIds';
import { ResetPasswordRequestDto } from '@/types/auth.types';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { createFieldsConfig } from '../../../helpers/createFieldConfig';

function ResetPasswordInner() {
  const { resetPasswordRequest, resetPassword, loading, error, resetPasswordChangeHandlers } = useAuth();
  const { navigateToLogin } = useRoutes();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get('token');

  const { setFieldsConfig } = useFieldConfigContext<Partial<ResetPasswordRequestDto>>();

  useEffect(() => {
    setFieldsConfig(createFieldsConfig(resetPasswordFormConfig, resetPasswordChangeHandlers));
  }, []);

  testIdContext.setContext(resetPasswordTestIds);

  if (!resetPasswordToken) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your new password below.</p>
      </div>

      <CustomForm
        data={resetPasswordRequest}
        submitHandler={(e) => resetPassword(e, resetPasswordToken)}
        formLabel="Reset Password"
        onCancel={navigateToLogin}
        submiting={loading}
        error={error}
      />
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
