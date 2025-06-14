import { Router } from "express"
import ApplicantDocumentController from "../controllers/ApplicantDocumentController"
import { protect, authorize } from "../middleware/auth" // Assuming auth middleware
import { multerUpload } from "../middleware/upload" // Assuming multer setup

const router = Router()

// Applicant routes (protected)
router.post(
  "/:applicationId", // applicationId in path
  protect,
  authorize(["APPLICANT"]),
  multerUpload.single("documentFile"), // "documentFile" is the field name in FormData
  ApplicantDocumentController.uploadDocument,
)

router.get(
  "/:applicationId", // applicationId in path
  protect,
  authorize(["APPLICANT"]),
  ApplicantDocumentController.getMyApplicationDocuments,
)

router.delete(
  "/:documentId", // documentId in path
  protect,
  authorize(["APPLICANT"]),
  ApplicantDocumentController.deleteMyDocument,
)

// Admin/HOA routes (protected and role-specific)
router.get(
  "/admin/:applicationId", // Differentiate admin route
  protect,
  authorize(["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"]),
  ApplicantDocumentController.getApplicationDocumentsForAdmin,
)

export default router
