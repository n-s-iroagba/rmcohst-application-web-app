import { Router } from 'express'
import { PaymentController } from '../controllers/PaymentController'
import { PaymentGatewayController } from '../controllers/PaymentGatewayController'

const router = Router()
router.get(
  '/:applicantUserId/current-session-payments',
  PaymentController.getPaymentsByApplicantUserId
)
router.get('/by-date', PaymentController.getPaymentsByDate)

router.post('/initialize', PaymentGatewayController.initializePayment)
router.get('/verify/:reference', PaymentGatewayController.verifyTransaction)
router.post('/webhook', PaymentGatewayController.handleWebhook)

export default router
