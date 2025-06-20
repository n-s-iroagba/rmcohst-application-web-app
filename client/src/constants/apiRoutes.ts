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
    update: `/subjects/:id`,
    delete: `/subjects/:id`
  },
  grade: {
    all: `/grades`,
    create: `/grades`,
    update: `/grades/:id`,
    delete: `/grades/:id`
  },
  biodata: {
    update: (id: number): string => `/biodata/${id}`
  },
  application: {
    myCurrentApplication: '/application/my-current-application'
  }
}
