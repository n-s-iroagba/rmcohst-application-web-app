import express from 'express'
import { ApplicationController } from '../controllers/ApplicationController'

const router = express.Router()



router.get('/:id', ApplicationController.getApplicationDetails)

router.get('/', ApplicationController.getAllApplications)
router.get('/payment-status/:applicantUserId',ApplicationController.getApplicationPaymentStatus)

router.post('/:applicationId/submit', ApplicationController.submitApplication)

router.post('/assign', ApplicationController.assignApplication)

router.get('/status/counts', ApplicationController.getStatusCounts)

router.patch('/:id/status', ApplicationController.updateStatus)

export default router
