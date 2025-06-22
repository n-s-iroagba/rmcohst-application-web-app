import express from 'express'
import { AuthController } from '../controllers/AuthController'
import { validateBody, validateParams } from '../middleware/validation/auth.validation'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailCodeSchema,
  emailVerificationCodeSchema,
} from '../validation/auth.validation'

const router = express.Router()
const authController = new AuthController()

router.post('/register', validateBody(registerSchema), authController.register)
router.post('/login', validateBody(loginSchema), authController.login)
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword)
router.post(
  '/reset-password',

  validateBody(resetPasswordSchema),
  authController.resetPassword
)
router.post('/verify-email', validateBody(verifyEmailCodeSchema), authController.verifyEmail)
router.post(
  '/resend-verification',
  validateBody(emailVerificationCodeSchema),
  authController.resendVerificationCode
)

export default router
