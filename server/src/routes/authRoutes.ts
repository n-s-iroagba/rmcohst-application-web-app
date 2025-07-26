import express from 'express'


import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailCodeSchema,
  resendCodeSchema,
} from '../validation/auth.validation'
import { validateBody } from '../middleware/validation'
import { AuthController } from '../controllers/AuthController'

const router = express.Router()
const authController = new AuthController()

router.post('/applicant/signup',validateBody(registerSchema), authController.signUpApplicant)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword)
router.post(
  '/reset-password',

  validateBody(resetPasswordSchema),
  authController.resetPassword
)
router.post('/verify-email', validateBody(verifyEmailCodeSchema), authController.verifyEmail)
router.post(
  '/resend-verification-code',
  validateBody(resendCodeSchema),
  authController.resendCode
)

export default router
