import { Router } from 'express'
import ApplicantSSCQualificationController from '../controllers/ApplicationSSCQualificationController'


const router = Router()


router.put('/:id', ApplicantSSCQualificationController.update)

export default router