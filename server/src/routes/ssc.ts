import { Router } from "express"
import { authMiddleware, requireRole } from "../middleware/auth"
import SscController from "../controllers/SscController"
import { upload } from "../middleware/upload"

const router = Router()

router.use(authMiddleware)
router.use(requireRole(["applicant"]))

// Get SSC qualification for an application
router.get("/application/:applicationId", SscController.getByApplicationId)

// Create or update SSC qualification for an application
// Using .post() for create/update simplifies client logic
// upload.array('certificates') handles multiple file uploads with the field name 'certificates'
router.post(
  "/application/:applicationId",
  upload.array("certificates", 2), // Max 2 certificate files
  SscController.createOrUpdate,
)

export default router
