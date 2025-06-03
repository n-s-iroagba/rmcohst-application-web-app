import type { Request, Response } from "express"

import { AppError } from "../utils/error/AppError"
import { CapacityService } from "../services/CapacityService"

export class CapacityController {
  private capacityService: CapacityService

  constructor() {
    this.capacityService = new CapacityService()
  }

  getDepartmentCapacities = async (req: Request, res: Response): Promise<void> => {
    try {
      const capacities = await this.capacityService.getDepartmentCapacities()

      res.status(200).json({
        success: true,
        data: capacities,
        message: "Department capacities retrieved successfully",
      })
    } catch (error) {
      throw new AppError("Failed to retrieve capacities", 500)
    }
  }

  updateDepartmentCapacity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { departmentId } = req.params
      const { totalCapacity } = req.body

      const updatedCapacity = await this.capacityService.updateDepartmentCapacity(departmentId, totalCapacity)

      res.status(200).json({
        success: true,
        data: updatedCapacity,
        message: "Department capacity updated successfully",
      })
    } catch (error) {
      throw new AppError("Failed to update capacity", 500)
    }
  }

  getProgramCapacities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { departmentId } = req.params

      const capacities = await this.capacityService.getProgramCapacities(departmentId)

      res.status(200).json({
        success: true,
        data: capacities,
        message: "Program capacities retrieved successfully",
      })
    } catch (error) {
      throw new AppError("Failed to retrieve program capacities", 500)
    }
  }
}
