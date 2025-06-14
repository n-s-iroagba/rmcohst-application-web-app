import { Router } from "express"
import { CapacityController } from "../controllers/CapacityController"
import { authMiddleware, requireRole } from "../middleware/auth"

const router = Router()
const capacityController = new CapacityController()

router.use(authMiddleware)

router.get("/departments", requireRole(["super_admin", "hoa"]), capacityController.getDepartmentCapacities)
router.put(
  "/departments/:departmentId",
  requireRole(["super_admin", "hoa"]),
  capacityController.updateDepartmentCapacity,
)
router.get(
  "/departments/:departmentId/programs",
  requireRole(["super_admin", "hoa"]),
  capacityController.getProgramCapacities,
)

export default router
