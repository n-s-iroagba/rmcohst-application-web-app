export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    APPLICANT_SIGNUP: '/auth/applicant/signup',
    SIGNUP_SUPER_ADMIN: '/auth/signup/super-admin',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token'
  },
  ADMIN: {
    USERS: {
      INVITE: `/admin/users/invite`,
      STATUS: (id: string) => `/admin/users/${id}/status`,
      ROLE: (id: string) => `/admin/users/${id}/role`,
      LOGS: (id: string) => `/admin/users/${id}/logs`
    }
  },
  APPLICATION: {
    GET_BY_ID: (id: string) => `/applications/${id}`,
    GET_BY_APPLICANT_ID: `/applications/applicant/`,

  },
  PAYMENT: {
    LIST: '/payments',
    GET_ACCEPTANCE_FEE_PAYMENTS: (id: number | string) => `payments/acceptance-fees/${id}`,
    GET_CURRENT_SESSION_APPLICATION_PAYMENTS: (applicantUserId: number | string) => `/payments/${applicantUserId}/current-session-payments`,
    INITIALIZE_GATEWAY: '/payments/initialize',
    VERIFY: (reference: string) => `/payments/verify/${reference}`,
    APPLICANT_PAYMENTS: (applicantId: number): string => `/payments/applicant/${applicantId}`
  },
  SSC_QUALIFICATION: {
    UPDATE: (id: string | number) => `/ssc-qualifications/${id}`
  },
  PROGRAM_QUALIFICATION: {
    UPDATE: (id: string | number) => `/program-qualifications/${id}`
  },
  PROGRAM: {
    LIST: '/programs',
    GET_BY_ID: (id: string) => `/programs/${id}`
  },
  SESSION: {
    LIST: '/sessions',
    BY_ID: (id: string) => `/sessions/${id}`,
    CREATE: (sessionID: string) => `/sessions/${sessionID}/create`,
    CURRENT: '/sessions/current'
  },
  BIODATA: {
    UPDATE: (id: number) => `/biodata/${id}`
  },
  SSC_REQUIREMENT: {
    LIST: '/ssc-requirement',
    BY_ID: (id: string) => `/ssc-requirement/${id}`,
    CREATE: (requirementId: string) => `/ssc-requirement/${requirementId}/create`
  },
  SUBJECT: {
    LIST: '/subjects'
  }
}