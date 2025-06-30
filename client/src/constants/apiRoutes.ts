export const apiRoutes = {
  auth: {
    login: `/auth/login`,
    logout: `/auth/logout`,
    superAdminSignup: '/auth/super-admin/signup',
    applicantSignup: '/auth/applicant/signup',
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
    verifyEmailCode: `/auth/verify-email-code`,
    resendVerificationEmail: `/auth/resend-verification-token`,
    me: `/auth/me`
  },
  subject: {
    all: `/subjects`,
    create: `/subjects`,
    update: (id: number): string => `/subjects/${id}`,
    delete: (id: number): string => `/subjects/${id}`
  },
  grade: {
    all: `/grades`,
    create: `/grades`,
    update: (id: number): string => `/grades/${id}`,
    delete: (id: number): string => `/grades/${id}`
  },
  biodata: {
    update: (id: number): string => `/biodata/${id}`
  },
  application: {
    myCurrentApplication: '/application/my-current-application',
    addComment: (id: string): string => `/applications/${id}/comments`,
    review:(id:string):string =>`applications/review/${id}`
  },
  academicSession: {
    all: `/academic-sessions`,
    create: `/academic-sessions`,
    update: (id: number): string => `/academic-sessions/${id}`,
    delete: (id: number): string => `/academic-sessions/${id}`,
    getById: (id: number): string => `/academic-sessions/${id}`
  },
  faculty: {
    all: `/faculties`,
    create: `/faculties`,
    update: (id: number): string => `/faculties/${id}`,
    delete: (id: number): string => `/faculties/${id}`,
    getById: (id: number): string => `/faculties/${id}`
  },
  department: {
    all: `/departments`,
    create: `/departments`,
    update: (id: number): string => `/departments/${id}`,
    delete: (id: number): string => `/departments/${id}`,
    getById: (id: number): string => `/departments/${id}`,
    getByFaculty: (facultyId: number): string => `/departments/faculty/${facultyId}`
  },
  program: {
    all: `/programs`,
    create: `/programs`,
    update: (id: number): string => `/programs/${id}`,
    delete: (id: number): string => `/programs/${id}`,
    getById: (id: number): string => `/programs/${id}`,
    getByDepartment: (departmentId: number): string => `/programs/department/${departmentId}`
  },
  sscRequirement: {
    all: `/ssc-requirements`,
    create: `/ssc-requirements`,
    update: (id: number): string => `/ssc-requirements/${id}`,
    delete: (id: number): string => `/ssc-requirements/${id}`,
    getById: (id: number): string => `/ssc-requirements/${id}`
  },
  programSpecificRequirement: {
    all: `/program-specific-requirements`,
    create: `/program-specific-requirements`,
    update: (id: number): string => `/program-specific-requirements/${id}`,
    delete: (id: number): string => `/program-specific-requirements/${id}`,
    getById: (id: number): string => `/program-specific-requirements/${id}`,
    getByProgram: (programId: number): string =>
      `/program-specific-requirements/program/${programId}`
  }
}
