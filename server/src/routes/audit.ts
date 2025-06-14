import { Router } from "express"
import { AuditController } from "../controllers/AuditController"
// Import requireRole
import { authMiddleware, requireRole } from "../middleware/auth" // Ensure requireRole is imported

const router = Router()
const auditController = new AuditController()

router.use(authMiddleware)

// Secure specific routes if necessary, e.g., only super_admin can export
router.get("/logs", requireRole(["super_admin", "hoa"]), auditController.getAuditLogs) // Example: HOA and Super Admin
router.get("/logs/export", requireRole(["super_admin"]), auditController.exportAuditLogs) // Example: Only Super Admin

export default router
