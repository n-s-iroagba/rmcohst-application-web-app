import { Router } from "express"
import { MessageController } from "../controllers/MessageController"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const messageController = new MessageController()

// router.use(authMiddleware)

// router.get("/:applicationId", messageController.getMessages)
// router.post("/:applicationId", messageController.sendMessage)
// router.patch("/:messageId/read", messageController.markAsRead)

export default router
