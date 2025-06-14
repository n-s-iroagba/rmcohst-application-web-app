import { Router } from "express"
import BiodataController from "../controllers/BiodataController"
import { authMiddleware, requireRole } from "../middleware/auth"
import upload from "../middleware/upload" // Multer middleware for file uploads

const router = Router()

// All biodata routes require authentication and applicant role
router.use(authMiddleware)
router.use(requireRole(["applicant"])) // Or any other roles that can manage biodata

// Get biodata for a specific application
router.get("/application/:applicationId", BiodataController.getByApplicationId)

// Create or Update biodata for a specific application
// Using PUT for idempotent update/create. POST could also be used for creation.
router.put(
  "/application/:applicationId",
  upload.single("passportPhotograph"), // Middleware to handle single file upload for 'passportPhotograph' field
  BiodataController.createOrUpdateByApplicationId,
)

export default router
