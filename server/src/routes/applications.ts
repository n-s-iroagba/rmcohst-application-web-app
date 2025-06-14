import { Router } from "express"
import ApplicationController from "../controllers/ApplicationController" // Assuming default export
import { authenticate, authorize } from "../middleware/auth" // Your auth middleware

const router = Router()

// Applicant routes
router.get(
  "/my-current-detailed",
  authenticate,
  authorize(["APPLICANT"]),
  ApplicationController.getMyCurrentDetailedApplication,
)
router.post("/choose-program", authenticate, authorize(["APPLICANT"]), ApplicationController.chooseProgram)
router.post(
  "/program-specific-qualifications",
  authenticate,
  authorize(["APPLICANT"]),
  ApplicationController.saveProgramSpecificQualifications,
)
router.post(
  "/:applicationId/submit-final", // applicationId from route params
  authenticate,
  authorize(["APPLICANT"]),
  ApplicationController.submitFinalApplication,
)

// Admin / HOA / SuperAdmin routes
router.get(
  "/", // Get all applications (filtered)
  authenticate,
  authorize(["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"]),
  ApplicationController.getAllApplicationsFiltered,
)
router.get(
  "/stats/status-counts",
  authenticate,
  authorize(["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"]),
  ApplicationController.getApplicationStatusCounts,
)
router.get(
  "/:id", // Get specific application by ID
  authenticate,
  // More granular authorization can be inside the controller (e.g., applicant can only get their own)
  authorize(["APPLICANT", "ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"]),
  ApplicationController.getApplicationDetailsById,
)
router.patch(
  "/:id/status", // Update status
  authenticate,
  authorize(["ADMIN", "HEAD_OF_ADMISSIONS", "SUPER_ADMIN"]), // Or more specific roles per status change
  ApplicationController.updateApplicationStatus,
)
router.patch(
  "/:applicationId/assign", // Assign to officer
  authenticate,
  authorize(["HEAD_OF_ADMISSIONS"]),
  ApplicationController.assignApplicationToOfficer,
)

export default router
