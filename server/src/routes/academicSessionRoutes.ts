import express from 'express'
import { validateQuery, validateParams, validateBody } from '../middleware/validation'

import {
  academicSessionCreationSchema,
  academicSessionUpdateSchema,
} from '../validation/academicSession.validationSchemas'
import AdmissionSessionController from '../controllers/AdmissionSessionController'

const router = express.Router()
const academicSessionController = new AdmissionSessionController()

// GET ALL ACADEMIC SESSIONS WITH PAGINATION
router.get(
  '/',
  // validateQuery(paginationQuerySchema),
  academicSessionController.getAll
)

// CREATE SINGLE ACADEMIC SESSION
router.post('/', validateBody(academicSessionCreationSchema), academicSessionController.create)

// UPDATE ACADEMIC SESSION
router.patch(
  '/:id',
  // validateParams(idParamSchema),
  validateBody(academicSessionUpdateSchema),
  academicSessionController.update
)

router.get('/current', academicSessionController.getCurrent)

// SET AS CURRENT SESSION
router.patch(
  '/:id/set-current',
  // validateParams(idParamSchema),
  academicSessionController.setCurrent
)

// DELETE ACADEMIC SESSION
router.delete(
  '/:id',
  // validateParams(idParamSchema),
  academicSessionController.delete
)

export default router
