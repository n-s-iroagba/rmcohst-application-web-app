import { Router } from 'express'
import BiodataController from '../controllers/BiodataController'


const router = Router()


router.put('/:id', BiodataController.updateBiodataById)

export default router