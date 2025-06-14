import { Op, WhereOptions } from "sequelize"
import { AuditLog, AuditLogAttributes } from "../models/AuditLog"
import sequelize from "sequelize/types/sequelize"
import { AppError } from "../utils/error/AppError"

// AuditService implementation
interface AuditFilters {
  action?: string
  status?: string
  startDate?: string
  endDate?: string
  userId?: string
  resource?: string
}

interface PaginatedAuditLogs {
  logs: AuditLogAttributes[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface CreateAuditLogData {
  userId?: string
  userEmail?: string
  action: string
  resource: string
  resourceId?: string
  status?: 'SUCCESS' | 'FAILED' | 'PENDING'
  ipAddress?: string
  userAgent?: string
  requestData?: object
  responseData?: object
  errorMessage?: string
  duration?: number
}

export class AuditService {
  async getAuditLogs(page: number = 1, limit: number = 50, filters: AuditFilters = {}): Promise<PaginatedAuditLogs> {
    try {
      const offset = (page - 1) * limit
      const whereClause: WhereOptions = {}

      // Apply filters
      if (filters.action) {
        whereClause.action = { [Op.iLike]: `%${filters.action}%` }
      }

      if (filters.status) {
        whereClause.status = filters.status
      }

      if (filters.userId) {
        whereClause.userId = filters.userId
      }

      if (filters.resource) {
        whereClause.resource = { [Op.iLike]: `%${filters.resource}%` }
      }

      if (filters.startDate || filters.endDate) {
        const dateFilter: any = {}
        if (filters.startDate) {
          dateFilter[Op.gte] = new Date(filters.startDate)
        }
        if (filters.endDate) {
          dateFilter[Op.lte] = new Date(filters.endDate)
        }
        whereClause.createdAt = dateFilter
      }

      const { count, rows } = await AuditLog.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      })

      const totalPages = Math.ceil(count / limit)

      return {
        logs: rows.map(log => log.toJSON()),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      throw new AppError('Failed to retrieve audit logs', 500)
    }
  }

  async createAuditLog(data: CreateAuditLogData): Promise<AuditLogAttributes> {
    try {
      const auditLog = await AuditLog.create({
        ...data,
        status: data.status || 'SUCCESS'
      })

      return auditLog.toJSON()
    } catch (error) {
      throw new AppError('Failed to create audit log', 500)
    }
  }

  async exportLogs(startDate?: string, endDate?: string, format: string = 'csv'): Promise<string> {
    try {
      const whereClause: WhereOptions = {}

      if (startDate || endDate) {
        const dateFilter: any = {}
        if (startDate) {
          dateFilter[Op.gte] = new Date(startDate)
        }
        if (endDate) {
          dateFilter[Op.lte] = new Date(endDate)
        }
        whereClause.createdAt = dateFilter
      }

      const logs = await AuditLog.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
      })

      if (format.toLowerCase() === 'csv') {
        return this.convertToCSV(logs.map(log => log.toJSON()))
      } else if (format.toLowerCase() === 'json') {
        return JSON.stringify(logs.map(log => log.toJSON()), null, 2)
      } else {
        throw new AppError('Unsupported export format', 400)
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to export audit logs', 500)
    }
  }

  async getAuditStatistics(startDate?: string, endDate?: string): Promise<object> {
    try {
      const whereClause: WhereOptions = {}

      if (startDate || endDate) {
        const dateFilter: any = {}
        if (startDate) {
          dateFilter[Op.gte] = new Date(startDate)
        }
        if (endDate) {
          dateFilter[Op.lte] = new Date(endDate)
        }
        whereClause.createdAt = dateFilter
      }

      const [
        totalLogs,
        successCount,
        failedCount,
        actionStats,
        resourceStats
      ] = await Promise.all([
        AuditLog.count({ where: whereClause }),
        AuditLog.count({ where: { ...whereClause, status: 'SUCCESS' } }),
        AuditLog.count({ where: { ...whereClause, status: 'FAILED' } }),
        AuditLog.findAll({
          where: whereClause,
          attributes: [
            'action',
            [sequelize.fn('COUNT', sequelize.col('action')), 'count']
          ],
          group: ['action'],
          raw: true
        }),
        AuditLog.findAll({
          where: whereClause,
          attributes: [
            'resource',
            [sequelize.fn('COUNT', sequelize.col('resource')), 'count']
          ],
          group: ['resource'],
          raw: true
        })
      ])

      return {
        summary: {
          totalLogs,
          successCount,
          failedCount,
          successRate: totalLogs > 0 ? ((successCount / totalLogs) * 100).toFixed(2) : 0
        },
        actionBreakdown: actionStats,
        resourceBreakdown: resourceStats
      }
    } catch (error) {
      throw new AppError('Failed to get audit statistics', 500)
    }
  }

  async deleteOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const deletedCount = await AuditLog.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate
          }
        }
      })

      // Log the cleanup action
      await this.createAuditLog({
        action: 'CLEANUP',
        resource: 'AUDIT_LOG',
        status: 'SUCCESS',
        responseData: { deletedCount, cutoffDate }
      })

      return deletedCount
    } catch (error) {
      throw new AppError('Failed to delete old audit logs', 500)
    }
  }

  private convertToCSV(data: AuditLogAttributes[]): string {
    if (data.length === 0) {
      return 'No data available'
    }

    const headers = [
      'ID',
      'User ID',
      'User Email',
      'Action',
      'Resource',
      'Resource ID',
      'Status',
      'IP Address',
      'Duration (ms)',
      'Error Message',
      'Created At'
    ]

    const csvRows = [
      headers.join(','),
      ...data.map(log => [
        log.id,
        log.userId || '',
        log.userEmail || '',
        log.action,
        log.resource,
        log.resourceId || '',
        log.status,
        log.ipAddress || '',
        log.duration || '',
        (log.errorMessage || '').replace(/,/g, ';'), // Replace commas to avoid CSV issues
        log.createdAt.toISOString()
      ].map(field => `"${field}"`).join(','))
    ]

    return csvRows.join('\n')
  }

  // Helper method to log common actions
  async logUserAction(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId?: string,
    additionalData?: object,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.createAuditLog({
      userId,
      userEmail,
      action,
      resource,
      resourceId,
      ipAddress,
      userAgent,
      requestData: additionalData
    })
  }

  async logError(
    action: string,
    resource: string,
    errorMessage: string,
    userId?: string,
    additionalData?: object
  ): Promise<void> {
    await this.createAuditLog({
      userId,
      action,
      resource,
      status: 'FAILED',
      errorMessage,
      requestData: additionalData
    })
  }
}
