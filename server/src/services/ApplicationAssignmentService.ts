import { Op } from 'sequelize'
import { Application, ApplicationStatus } from '../models/Application'
import { Staff } from '../models/Staff'
import { Program } from '../models/Program'
import { Department } from '../models/Department'
import { Faculty } from '../models/Faculty'
import { User } from '../models/User'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'
import { EmailService } from './EmailService'

export enum AssignmentType {
  FACULTY = 'faculty',
  DEPARTMENT = 'department',
  PROGRAM = 'program',
  RANDOM = 'random'
}

export interface AssignmentRequest {
  officerId: string
  assignmentType: AssignmentType
  count: number
  targetId?: string // faculty/department/program ID (not needed for random)
  academicSessionId?: string
}

export interface AssignmentResult {
  success: boolean
  assignedCount: number
  totalRequested: number
  assignedApplications: Application[]
  errors: string[]
}

export interface AssignmentFilters {
  facultyId?: string
  departmentId?: string
  programId?: string
  excludeAssigned?: boolean
  academicSessionId?: string
}

class ApplicationAssignmentService {
  private emailService: EmailService

  constructor() {
    this.emailService = new EmailService()
  }

  /**
   * Get all available admission officers
   */
  public async getAvailableOfficers(): Promise<Staff[]> {
    try {
      const officers = await Staff.findAll({
        where: {
          role: 'ADMISSION_OFFICER', // Adjust based on your role system
          isActive: true
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          }
        ],
        order: [['user', 'firstName', 'ASC']]
      })

      return officers
    } catch (error) {
      logger.error('Error fetching admission officers', { error })
      throw new AppError('Failed to fetch admission officers', 500)
    }
  }

  /**
   * Get assignment statistics for preview
   */
  public async getAssignmentPreview(
    assignmentType: AssignmentType,
    targetId?: string,
    academicSessionId?: string
  ): Promise<{
    totalAvailable: number
    assignedCount: number
    unassignedCount: number
    targetName?: string
  }> {
    try {
      const filters = this.buildAssignmentFilters(assignmentType, targetId, academicSessionId)
      
      const totalAvailable = await this.getApplicationCount(filters)
      const assignedCount = await this.getApplicationCount({
        ...filters,
        excludeAssigned: false
      })
      const unassignedCount = await this.getApplicationCount({
        ...filters,
        excludeAssigned: true
      })

      let targetName: string | undefined
      if (targetId) {
        targetName = await this.getTargetName(assignmentType, targetId)
      }

      return {
        totalAvailable,
        assignedCount,
        unassignedCount,
        targetName
      }
    } catch (error) {
      logger.error('Error getting assignment preview', { error })
      throw new AppError('Failed to get assignment preview', 500)
    }
  }

  /**
   * Assign applications to an officer
   */
  public async assignApplications(request: AssignmentRequest): Promise<AssignmentResult> {
    try {
      // Validate officer exists
      const officer = await Staff.findByPk(request.officerId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName', 'email']
          }
        ]
      })

      if (!officer) {
        throw new AppError('Admission officer not found', 404)
      }

      // Get applications to assign
      const applications = await this.getApplicationsForAssignment(request)

      if (applications.length === 0) {
        return {
          success: false,
          assignedCount: 0,
          totalRequested: request.count,
          assignedApplications: [],
          errors: ['No applications available for assignment']
        }
      }

      // Assign applications
      const assignedApplications: Application[] = []
      const errors: string[] = []

      for (const application of applications) {
        try {
          await this.assignSingleApplication(application.id, request.officerId)
          assignedApplications.push(application)
        } catch (error) {
          errors.push(`Failed to assign application ${application.id}: ${error.message}`)
          logger.error('Error assigning single application', { 
            applicationId: application.id, 
            error 
          })
        }
      }

      // Send notification emails
      try {
        await this.sendAssignmentNotifications(officer, assignedApplications, request)
      } catch (error) {
        logger.error('Error sending assignment notifications', { error })
        errors.push('Applications assigned but failed to send notifications')
      }

      logger.info('Applications assigned successfully', {
        officerId: request.officerId,
        assignedCount: assignedApplications.length,
        totalRequested: request.count,
        assignmentType: request.assignmentType
      })

      return {
        success: assignedApplications.length > 0,
        assignedCount: assignedApplications.length,
        totalRequested: request.count,
        assignedApplications,
        errors
      }
    } catch (error) {
      logger.error('Error in assignment process', { error })
      throw error instanceof AppError ? error : new AppError('Failed to assign applications', 500)
    }
  }

  /**
   * Get applications for assignment based on criteria
   */
  private async getApplicationsForAssignment(request: AssignmentRequest): Promise<Application[]> {
    const filters = this.buildAssignmentFilters(
      request.assignmentType,
      request.targetId,
      request.academicSessionId
    )

    const whereClause = this.buildWhereClause(filters)
    const includeClause = this.buildIncludeClause(request.assignmentType)

    const applications = await Application.findAll({
      where: {
        ...whereClause,
        assignedOfficerId: null, // Only unassigned applications
        status: {
          [Op.in]: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW]
        }
      },
      include: includeClause,
      limit: request.count,
      order: [['submittedAt', 'ASC']] // FIFO order
    })

    return applications
  }

  /**
   * Assign a single application to an officer
   */
  private async assignSingleApplication(applicationId: string, officerId: string): Promise<void> {
    const application = await Application.findByPk(applicationId)
    
    if (!application) {
      throw new Error('Application not found')
    }

    if (application.assignedOfficerId) {
      throw new Error('Application is already assigned')
    }

    application.assignedOfficerId = officerId
    if (application.status === ApplicationStatus.SUBMITTED) {
      application.status = ApplicationStatus.UNDER_REVIEW
    }
    application.assignedAt = new Date()

    await application.save()
  }

  /**
   * Build assignment filters based on type
   */
  private buildAssignmentFilters(
    assignmentType: AssignmentType,
    targetId?: string,
    academicSessionId?: string
  ): AssignmentFilters {
    const filters: AssignmentFilters = {
      excludeAssigned: true
    }

    if (academicSessionId) {
      filters.academicSessionId = academicSessionId
    }

    switch (assignmentType) {
      case AssignmentType.FACULTY:
        if (targetId) filters.facultyId = targetId
        break
      case AssignmentType.DEPARTMENT:
        if (targetId) filters.departmentId = targetId
        break
      case AssignmentType.PROGRAM:
        if (targetId) filters.programId = targetId
        break
      case AssignmentType.RANDOM:
        // No specific filters for random assignment
        break
    }

    return filters
  }

  /**
   * Build WHERE clause for database query
   */
  private buildWhereClause(filters: AssignmentFilters): any {
    const whereClause: any = {}

    if (filters.academicSessionId) {
      whereClause.academicSessionId = filters.academicSessionId
    }

    if (filters.excludeAssigned) {
      whereClause.assignedOfficerId = null
    }

    return whereClause
  }

  /**
   * Build INCLUDE clause for database query
   */
  private buildIncludeClause(assignmentType: AssignmentType): any[] {
    const baseInclude = [
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ]

    switch (assignmentType) {
      case AssignmentType.FACULTY:
        return [
          ...baseInclude,
          {
            model: Program,
            as: 'program',
            include: [
              {
                model: Department,
                as: 'department',
                include: [{ model: Faculty, as: 'faculty' }]
              }
            ]
          }
        ]
      case AssignmentType.DEPARTMENT:
        return [
          ...baseInclude,
          {
            model: Program,
            as: 'program',
            include: [{ model: Department, as: 'department' }]
          }
        ]
      case AssignmentType.PROGRAM:
        return [
          ...baseInclude,
          { model: Program, as: 'program' }
        ]
      default:
        return baseInclude
    }
  }

  /**
   * Get count of applications matching filters
   */
  private async getApplicationCount(filters: AssignmentFilters): Promise<number> {
    const whereClause = this.buildWhereClause(filters)
    const includeClause = this.buildIncludeClause(AssignmentType.RANDOM)

    return await Application.count({
      where: whereClause,
      include: includeClause
    })
  }

  /**
   * Get target name for display
   */
  private async getTargetName(assignmentType: AssignmentType, targetId: string): Promise<string> {
    switch (assignmentType) {
      case AssignmentType.FACULTY:
        const faculty = await Faculty.findByPk(targetId)
        return faculty?.name || 'Unknown Faculty'
      case AssignmentType.DEPARTMENT:
        const department = await Department.findByPk(targetId)
        return department?.name || 'Unknown Department'
      case AssignmentType.PROGRAM:
        const program = await Program.findByPk(targetId)
        return program?.name || 'Unknown Program'
      default:
        return 'Random Assignment'
    }
  }

  /**
   * Send assignment notifications
   */
  private async sendAssignmentNotifications(
    officer: Staff,
    applications: Application[],
    request: AssignmentRequest
  ): Promise<void> {
    // Send email to the assigned officer
    await this.emailService.sendAssignmentNotification(
      officer.user.email,
      {
        officerName: `${officer.user.firstName} ${officer.user.lastName}`,
        applicationCount: applications.length,
        assignmentType: request.assignmentType,
        applications: applications.map(app => ({
          id: app.id,
          applicantName: app.applicant ? `${app.applicant.firstName} ${app.applicant.lastName}` : 'Unknown',
          programName: app.program?.name || 'Unknown Program'
        }))
      }
    )

    // Send emails to applicants (optional)
    for (const application of applications) {
      if (application.applicant?.email) {
        await this.emailService.sendApplicationAssignedNotification(
          application.applicant.email,
          {
            applicantName: `${application.applicant.firstName} ${application.applicant.lastName}`,
            officerName: `${officer.user.firstName} ${officer.user.lastName}`,
            applicationId: application.id
          }
        )
      }
    }
  }

  /**
   * Get assignment history for an officer
   */
  public async getOfficerAssignments(
    officerId: string,
    filters?: {
      status?: ApplicationStatus
      academicSessionId?: string
      page?: number
      limit?: number
    }
  ): Promise<{
    applications: Application[]
    total: number
    page: number
    limit: number
  }> {
    try {
      const whereClause: any = { assignedOfficerId: officerId }
      
      if (filters?.status) {
        whereClause.status = filters.status
      }
      
      if (filters?.academicSessionId) {
        whereClause.academicSessionId = filters.academicSessionId
      }

      const page = filters?.page || 1
      const limit = filters?.limit || 10
      const offset = (page - 1) * limit

      const { count, rows } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'applicant',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Program,
            as: 'program',
            include: [
              {
                model: Department,
                as: 'department',
                include: [{ model: Faculty, as: 'faculty' }]
              }
            ]
          }
        ],
        order: [['assignedAt', 'DESC']],
        limit,
        offset
      })

      return {
        applications: rows,
        total: count,
        page,
        limit
      }
    } catch (error) {
      logger.error('Error fetching officer assignments', { error, officerId })
      throw new AppError('Failed to fetch officer assignments', 500)
    }
  }
}

export default ApplicationAssignmentService