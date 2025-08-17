import { Router } from 'express'
import ProgramController from '../controllers/ProgramController'
import { bulkProgramSchema, updateProgramSchema } from '../validation/programSchema'
import { validateBody } from '../middleware/validation'

const router = Router()

router.post('/bulk', validateBody(bulkProgramSchema), ProgramController.createBulk)
router.get('/', ProgramController.getAll)
router.get('/:id', ProgramController.getOne)
router.get('/faculty/:facultyId', ProgramController.getByFaculty)
router.get('/department/:departmentId', ProgramController.getByDepartment)
router.patch('/:id', validateBody(updateProgramSchema), ProgramController.update)
router.patch('/:id/inactive', ProgramController.makeInactive)
router.delete('/:id', ProgramController.delete)

export default router
