import type { Request, Response } from "express"

import { AppError } from "../utils/error/AppError"
import { AuditService } from "../services/AuditLogService"

export class AuditController {
  private auditService: AuditService

  constructor() {
    this.auditService = new AuditService()
  }

  getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 50, action, status, startDate, endDate } = req.query

      const filters = {
        action: action as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
      }

      const logs = await this.auditService.getAuditLogs(Number(page), Number(limit), filters)

      res.status(200).json({
        success: true,
        data: logs,
        message: "Audit logs retrieved successfully",
      })
    } catch (error) {
      throw new AppError("Failed to retrieve audit logs", 500)
    }
  }

  exportAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, format = "csv" } = req.query

      const exportData = await this.auditService.exportLogs(startDate as string, endDate as string, format as string)

      res.setHeader("Content-Type", "text/csv")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.csv"`,
      )
      res.send(exportData)
    } catch (error) {
      throw new AppError("Failed to export audit logs", 500)
    }
  }
}
