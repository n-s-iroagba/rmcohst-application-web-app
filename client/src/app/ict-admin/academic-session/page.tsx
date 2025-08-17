'use client';

import ModalWrapper from '@/components/ModalWrapper';
import { useState } from 'react';

function SessionCrudPage(
  // { children }: { children: ReactNode }
) {
  const [createSession, setCreateSession] = useState(false);

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Academic Sessions</h1>
          <button
            onClick={() => setCreateSession(true)}
            className="bg-blue-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Add New Academic Session
          </button>
        </div>

        {/* Modal */}
        <ModalWrapper isOpen={createSession} onClose={() => setCreateSession(false)}>
          <></>
          {/* <CustomForm
            data={loginRequest}
            submitHandler={login}
            formLabel="Login"
            onCancel={navigateToHome}
            submiting={loading}
            error={error}
          /> */}
        </ModalWrapper>

        {/* {children} */}
      </div>
    </div>
  );
}

export default SessionCrudPage;
