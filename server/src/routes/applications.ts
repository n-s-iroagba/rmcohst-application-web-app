import { Router } from "express"
import ApplicationController from "../controllers/ApplicationController"
import { authMiddleware } from "../middleware/auth"

import { body, param, query } from "express-validator"

const router = Router()

// All routes require authentication
// router.use(authMiddleware)

// Create application
router.post(
  "/",
  [body("academicSessionId").isInt().withMessage("Academic session ID must be an integer")],

  ApplicationController.create,
)

// Get my applications
router.get("/my", ApplicationController.getMyApplications)

// Get all applications (admin only)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  ],

  ApplicationController.getAll,
)

// Get application by ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("Application ID must be an integer")],

  ApplicationController.getById,
)

// Update application status
router.patch(
  "/:id/status",
  [
    param("id").isInt().withMessage("Application ID must be an integer"),
    body("status")
      .isIn([
        "APPLICATION_PAID",
        "BIODATA",
        "SSC_QUALIFICATION",
        "PROGRAM_SPECIFIC_QUALIFICATION",
        "SUBMITTED",
        "ADMISSION_OFFICER_REVIEWED",
        "ADMITTED",
        "REJECTED",
        "OFFERED",
        "ACCEPTED",
        "ACCEPTANCE_PAID",
      ])
      .withMessage("Invalid status"),
  ],

  ApplicationController.updateStatus,
)

// Assign to officer
router.patch(
  "/:id/assign",
  [
    param("id").isInt().withMessage("Application ID must be an integer"),
    body("admissionOfficerId").isInt().withMessage("Officer ID must be an integer"),
  ],

  ApplicationController.assignToOfficer,
)

// Submit application
router.post(
  "/:id/submit",
  [param("id").isInt().withMessage("Application ID must be an integer")],

  ApplicationController.submit,
)

export default router
