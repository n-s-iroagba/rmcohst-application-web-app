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
  FEEDS: {
    BULK: `/feeds`,

    ITEMS: `/feeds/items`,
  },
  HEALTH: {
    DETAIL: (id: string) => `/admin/feeds/${id}/health`,
    DAILY_COUNT: (id: string) => `/admin/feeds/${id}/daily-count`,
    BROKEN_IMAGES: (id: string) => `/admin/feeds/${id}/broken-images`,
  },
  ADS: {
    SUBSCRIPTION: `/admin/subscription-plans`,
    FALLBACK: `/admin/fallback-ads`,
    CTR: (id: string) => `/admin/ads/${id}/ctr`,
    SUSPICIOUS: `/admin/alerts/suspicious-clicks`,
    INVENTORY: `/admin/alerts/fallback-inventory`,
  },

  AD_PLACER: {
    CAMPAIGNS: `/ad-placer/campaigns`,
    CAMPAIGN: (id: string) => `/ad-placer/campaigns/${id}`,
    BUDGET: (id: string) => `/ad-placer/campaigns/${id}/budget`,
    TARGETING: (id: string) => `/ad-placer/campaigns/${id}/targeting`,
    ANALYTICS: (id: string) => `/ad-placer/campaigns/${id}/analytics`,
    CONVERSIONS: (id: string) => `/ad-placer/campaigns/${id}/conversions`,
  },
  TRACKING: {
    VIEW: (id: string) => `/content/${id}/views`,
    TIME_SPENT: (id: string) => `/content/${id}/time-spent`,
    AD_IMPRESSION: (id: string) => `/ads/${id}/impressions`,
    AD_CLICK: (id: string) => `/ads/${id}/clicks`,
  },
  ARTICLE: {
    VIEW: (id: string) => `/article/${id}/view`,
    CREATE: `/article`,
    MUTATE: (id: string) => `/article/${id}`,
  },
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
