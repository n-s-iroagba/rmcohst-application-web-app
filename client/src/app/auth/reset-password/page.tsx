'use client';

import React, { useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CustomForm } from '@/components/CustomForm';
import { useFieldConfigContext } from '@/context/FieldConfigContext';
import { ResetPasswordRequestDto } from '@/types/auth.types';
import { useSearchParams } from 'next/navigation';
import { resetPasswordFormConfig } from '@/utils/loginFormConfig';
import { testIdContext } from '@/test/utils/testIdContext';
import { resetPasswordTestIds } from '@/utils/formTestIds';
import { useRoutes } from '@/hooks/useRoutes';

function ResetPasswordInner() {
  const { resetPasswordRequest, resetPassword, loading, error, resetPasswordChangeHandlers } = useAuth();
  const { navigateToLogin } = useRoutes();
  const searchParams = useSearchParams();
  const resetPasswordToken = searchParams.get('token');

  const { createFieldsConfig } = useFieldConfigContext<Partial<ResetPasswordRequestDto>>();

  useEffect(() => {
    createFieldsConfig(resetPasswordFormConfig, resetPasswordChangeHandlers);
  }, [createFieldsConfig, resetPasswordChangeHandlers]);

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
