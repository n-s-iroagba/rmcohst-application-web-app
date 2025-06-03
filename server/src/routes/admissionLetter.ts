import { Router } from "express"
import { AdmissionLetterController } from "../controllers/AdmissionLetterController"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const admissionLetterController = new AdmissionLetterController()

router.use(authMiddleware)

router.get("/:applicationId", admissionLetterController.generateAdmissionLetter)
router.get("/:applicationId/download", admissionLetterController.downloadAdmissionLetter)
router.get("/:applicationId/verify", admissionLetterController.verifyLetter)

export default router
