import { Router } from 'express'
import BiodataController from '../controllers/BiodataController'
import { upload } from '../middleware/upload'

const router = Router()

router.patch('/:id', upload.single('passportPhotograph'), BiodataController.updateBiodataById)

export default router
