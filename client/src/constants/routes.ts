export const INTERNAL_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: (token: string, id: number) => `/auth/verify-email/${token}/${id}`,
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token'
  },
  DASHBOARD: (role: string) => `/${role}/dashboard`,

  DEPARTMENT: {
    EDIT: (id: number) => `/super-admin/departments/${id}/edit`,
    LIST: '/super-admin/departments',
    CREATE: '/super-admin/departments/create',
    GET_BY_ID: (id: number) => `/super-admin/departments/${id}`
  },
  FACULTY: {
    EDIT: (id: number) => `/super-admin/faculties/${id}/edit`,
    LIST: '/super-admin/faculties',
    CREATE: '/super-admin/faculties/create',
    GET_BY_ID: (id: number) => `/super-admin/faculties/${id}`
  },
  ACADEMIC_SESSION: {
    EDIT: (id: number) => `/super-admin/academic-sessions/${id}/edit`,
    LIST: '/super-admin/academic-sessions',
    CREATE: '/super-admin/academic-sessions/create',
    GET_BY_ID: (id: number) => `/super-admin/academic-sessions/${id}`
  },
  PROGRAM_SSC_REQUIREMENT: {
    EDIT: (id: number) => `/super-admin/program-ssc-requirement/${id}/edit`,
    LIST: '/super-admin/program-ssc-requirement',
    CREATE: '/super-admin/program-ssc-requirement/create',
    GET_BY_ID: (id: number) => `/super-admin/program-ssc-requirement/${id}`
  },
  PROGRAM_SPECIFIC_REQUIREMENT: {
    EDIT: (id: number) => `/super-admin/program-specific-requirement/${id}/edit`,
    LIST: '/super-admin/program-specific-requirement',
    CREATE: '/super-admin/program-specific-requirement/create',
    GET_BY_ID: (id: number) => `/super-admin/program-specific-requirement/${id}`
  },
  APPLICATION: {
    SELECT_PROGRAM: '/applicant/application/programs'
  },

  ACCOUNT: {
    PROFILE: '/account/profile'
  },
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/403'
  }
}


