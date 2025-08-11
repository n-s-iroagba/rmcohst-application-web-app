import { Router } from 'express'
import { PaymentController } from '../controllers/PaymentController'

const router = Router()


router.post('/initialize', PaymentController.initializePayment)
router.get('/verify/:reference', PaymentController.verifyTransaction)
router.get('/:applicantUserId/current-session-payments', PaymentController.getPaymentsByApplicantUserId)
router.get('/by-date', PaymentController.getPaymentsByDate)

router.post('/webhook', PaymentController.handleWebhook);
export default router
