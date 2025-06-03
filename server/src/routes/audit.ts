import { Router } from "express"
import { AuditController } from "../controllers/AuditController"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const auditController = new AuditController()

router.use(authMiddleware)

router.get("/logs", auditController.getAuditLogs)
router.get("/logs/export", auditController.exportAuditLogs)

export default router
