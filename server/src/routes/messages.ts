import { Router } from "express"
import { MessageController } from "../controllers/MessageController"
import { authMiddleware, requireRole } from "../middleware/auth"

const router = Router()
const messageController = new MessageController()

// Apply authMiddleware
router.use(authMiddleware)

// Example: Applicants can see messages for their applications, admins/hoa can see messages too.
// The controller logic would need to ensure users only see messages relevant to them.
router.get("/:applicationId", requireRole(["applicant", "admin", "hoa"]), messageController.getMessages)
router.post("/:applicationId", requireRole(["applicant", "admin", "hoa"]), messageController.sendMessage)
router.patch("/:messageId/read", requireRole(["applicant", "admin", "hoa"]), messageController.markAsRead)

export default router
