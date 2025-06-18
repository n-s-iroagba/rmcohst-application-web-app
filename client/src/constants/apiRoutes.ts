export const apiRoutes = {
  auth: {
    login:`/auth/login`,
    logout:  `/auth/logout`,
    superAdminSignup:  '/auth/super-admin/signup',
    applicantSignup:  '/auth/applicant/signup',
    forgotPassword:  `/auth/forgot-password`,
    resetPassword:  `/auth/reset-password`,
    verifyEmail:  `/auth/verify-email`,
    resendVerificationEmail:  `/auth/resend-verification-token`,
    me: `/auth/me`,
  }
}