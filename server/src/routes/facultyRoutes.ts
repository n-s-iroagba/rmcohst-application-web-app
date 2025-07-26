import { Router } from 'express'
import FacultyController from '../controllers/FacultyController'
import {
  createFacultySchema,
  updateFacultySchema,
  idParamSchema,
  getFacultiesQuerySchema,
} from '../validation/faculty.validationSchemas'
import { validateBody, validateParams, validateQuery } from '../middleware/validation'

const router = Router()

router.post('/', validateBody(createFacultySchema), FacultyController.createFaculty)

router.get('/', FacultyController.getAllFaculties)

router.get('/:id', validateParams(idParamSchema), FacultyController.getFacultyById)

// router.put(
//   '/:id',
//   validateParams(idParamSchema),
//   validateBody(updateFacultySchema),
//   FacultyController.updateFaculty
// )

// router.delete('/:id', validateParams(idParamSchema), FacultyController.deleteFaculty)

export default router
