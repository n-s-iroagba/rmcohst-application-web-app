import { Router } from "express"
import { CapacityController } from "../controllers/CapacityController"
import { authMiddleware } from "../middleware/auth"

const router = Router()
const capacityController = new CapacityController()

router.use(authMiddleware)

router.get("/departments", capacityController.getDepartmentCapacities)
router.put("/departments/:departmentId", capacityController.updateDepartmentCapacity)
router.get("/departments/:departmentId/programs", capacityController.getProgramCapacities)

export default router
