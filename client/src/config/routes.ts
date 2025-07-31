export const INTERNAL_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: (token: string,id:string) => `/auth/verify-email/${token}/${id}`,
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token',
  },
  DASHBOARD: (role: string) => `/${role}/dashboard`,

  DEPARTMENT:{
    EDIT: (id: number) => `/super-admin/departments/${id}/edit`,
    LIST: '/super-admin/departments',
    CREATE: '/super-admin/departments/create',
    GET_BY_ID: (id: number) => `/super-admin/departments/${id}`,
  },
  FACULTY:{
    EDIT: (id: number) => `/super-admin/faculties/${id}/edit`,
    LIST: '/super-admin/faculties',
    CREATE: '/super-admin/faculties/create',
    GET_BY_ID: (id: number) => `/super-admin/faculties/${id}`,
  },
  ACADEMIC_SESSION:{
    EDIT: (id: number) => `/super-admin/academic-sessions/${id}/edit`,
    LIST: '/super-admin/academic-sessions',
    CREATE: '/super-admin/academic-sessions/create',
    GET_BY_ID: (id: number) => `/super-admin/academic-sessions/${id}`
  },
  PROGRAM_SSC_REQUIREMENT:{
     EDIT: (id: number) => `/super-admin/program-ssc-requirement/${id}/edit`,
    LIST: '/super-admin/program-ssc-requirement',
    CREATE: '/super-admin/program-ssc-requirement/create',
    GET_BY_ID: (id: number) => `/super-admin/program-ssc-requirement/${id}`
  },
    PROGRAM_SPECIFIC_REQUIREMENT:{
     EDIT: (id: number) => `/super-admin/program-specific-requirement/${id}/edit`,
    LIST: '/super-admin/program-specific-requirement',
    CREATE: '/super-admin/program-specific-requirement/create',
    GET_BY_ID: (id: number) => `/super-admin/program-specific-requirement/${id}`
  },
  APPLICATION:{
    SELECT_PROGRAM:'/applicant/application/programs'
  },

  
  ACCOUNT: {
    PROFILE: '/account/profile',
  },
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/403',
  },
};

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
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token',
  },
  ADMIN: {
    USERS: {
      INVITE: `/admin/users/invite`,
      STATUS: (id: string) => `/admin/users/${id}/status`,
      ROLE: (id: string) => `/admin/users/${id}/role`,
      LOGS: (id: string) => `/admin/users/${id}/logs`,
    },
  },
  APPLICATION:{
    GET_BY_ID:(id:string) => `/applications/${id}`,
  },
  PAYMENT:{
    LIST: '/payments',
    GET_CURRENT_SESSION_APPLICATION_PAYMENT_STATUS:(applicantUserId:number|string)=>`/applications/payment-status/${applicantUserId}`,
    GET_BY_APPLICANT_USER_ID:(applicantUserId:string|number)=> `/payments/${applicantUserId}`,
    INITIALIZE_GATEWAY:'/payments/initialize',
VERIFY:(reference:string) =>`/payments/verify/${reference}`
 },
  PROGRAM:{
    LIST:'/programs',
    GET_BY_ID:(id:string)=>`/programs/${id}`
  },
  SESSION:{
    LIST:'/sessions',
    BY_ID:(id:string)=>`/sessions/${id}`,
    CREATE:(sessionID:string)=>`/sessions/${sessionID}/create`
    
  },
  BIODATA:{
    UPDATE:(id:number)=>`/biodata/${id}`
  },
  SSC_REQUIREMENT:{
    LIST:'/ssc-requirement',
    BY_ID:(id:string)=>`/ssc-requirement/${id}`,
    CREATE:(requirementId:string)=>`/ssc-requirement/${requirementId}/create`
    
  }
};

// Utility types for route parameters
export type RouteParams = {
  auth: {
    invite: { token: string };
  };
  admin: {
    users: { id: string };
    feeds: { id: string };
    health: { id: string };
    categories: { id: string };
  };
  viewer: {
    article: { id: string };
  };
  editor: {};
  adPlacer: {
    campaign: { id: string };
    analytics: { id: string };
  };
};

// Type-safe path generator
export const buildPath = <T extends keyof RouteParams>(
  base: T,
  path: string,
  params: RouteParams[T]
): string => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, value.toString()),
    path
  );
};
