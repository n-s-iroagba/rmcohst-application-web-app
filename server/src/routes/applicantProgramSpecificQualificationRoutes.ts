import { Router } from 'express'
import ApplicantProgramSpecificQualificationController from '../controllers/ApplicationProgramSpecificQualificationController'

const router = Router()

router.put('/:id', ApplicantProgramSpecificQualificationController.update)

export default router
