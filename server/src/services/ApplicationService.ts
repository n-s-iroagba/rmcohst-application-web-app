import sequelize from 'sequelize/types/sequelize'
import AcademicSession from '../models/AcademicSession'

import {
  ApplicationStatus,
  ApplicationCreationAttributes,
  Application,
} from '../models/Application'
import { Department } from '../models/Department'
import { Faculty } from '../models/Faculty'
import Program from '../models/Program'
import ProgramSpecificQualification from '../models/ProgramSpecificQualification'
import { Staff } from '../models/Staff'
import User from '../models/User'
import ProgramSession from '../models/ProgramSession'
import Biodata from '../models/Biodata'
import ApplicantSSCQualification from '../models/ApplicantSSCQualification'
import ApplicantProgramSpecificQualification from '../models/ApplicantProgramSpecificQualification'
import ApplicantSSCSubjectAndGrade from '../models/ApplicantSSCSubjectAndGrade'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'

interface ApplicationFilters {
  status?: string
  academicSessionId?: string // Assuming UUID
  StaffId?: string // Assuming UUID
  unassigned?: boolean
  page?: number
  limit?: number
}

class ApplicationService {
  public async createInitialApplication(
    applicantUserId: number,
    data: {
      sessionId: string
      programId?: string
    }
  ): Promise<Application> {
    try {
      const existingApplication = await Application.findOne({
        where: {
          applicantUserId,
          sessionId: data.sessionId,
        },
      })

      if (existingApplication)
        throw new AppError(
          'Application already exists for this user in this academic session.',
          409
        )

      const program = await ProgramSession.findOne({
        where: {
          programId: data.programId,
          sessionId: data.sessionId,
        },
      })

      if (!program) throw new AppError('The Program you wish to apply for in not available', 404)

      const application = await Application.create({
        ...data,
        applicantUserId,
        status: ApplicationStatus.DRAFT,
      } as unknown as ApplicationCreationAttributes)
      const applicationId = application.id
      await Biodata.create({ applicationId })
      await ApplicantSSCQualification.create({ applicationId })
      const programSpecificQualification = await ProgramSpecificQualification.findOne({
        where: { programId: program.id },
      })
      if (programSpecificQualification)
        await ApplicantProgramSpecificQualification.create({
          applicationId,
          qualificationType: programSpecificQualification.qualificationType,
        })

      logger.info('Application created successfully', { applicationId: application.id })
      return application
    } catch (error) {
      logger.error('Error creating application', { error })
      throw error instanceof AppError ? error : new AppError('Failed to create application', 500)
    }
  }

  // Get application by ID with all related data
  public async getApplicationDetailsById(id: string): Promise<Application> {
    try {
      const application = await Application.findByPk(id, {
        include: [
          {
            model: User,
            as: 'applicant',
            attributes: ['id', 'email', 'firstName', 'lastName', 'role'],
          },
          {
            model: Program,
            as: 'program',
            include: [
              { model: Department, as: 'department', include: [{ model: Faculty, as: 'faculty' }] },
            ],
          },
          { model: Biodata, as: 'biodata' },
          { model: AcademicSession, as: 'academicSession' },
          {
            model: ApplicantSSCQualification,
            as: 'sscQualifications',
            include: [{ model: ApplicantSSCSubjectAndGrade, as: 'subjects' }],
          },
          {
            model: ApplicantProgramSpecificQualification,
            as: 'programSpecificQualifications',
            include: [{ model: ProgramSpecificQualification, as: 'qualificationDefinition' }],
          },
          {
            model: Staff,
            as: 'assignedOfficer', // Ensure alias matches model association
            include: [
              {
                model: Staff,
                as: 'staff',
                include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
              },
            ],
          },
        ],
      })

      if (!application) {
        throw new AppError('Application not found', 404)
      }
      return application
    } catch (error) {
      logger.error('Error fetching application details', { error, id })
      throw error instanceof AppError
        ? error
        : new AppError('Failed to fetch application details', 500)
    }
  }

  // Get all applications with filters and pagination (for Admin/HOA)
  public async getAllApplicationsFiltered(filters: ApplicationFilters) {
    try {
      const { status, academicSessionId, StaffId, unassigned, page, limit } = filters
      // const offset = (page - 1) * limit

      const whereClause: any = {}
      if (status) whereClause.status = status
      if (academicSessionId) whereClause.academicSessionId = academicSessionId

      if (unassigned) {
        whereClause.assignedOfficerId = null // Corrected field name
      } else if (StaffId) {
        whereClause.assignedOfficerId = StaffId // Corrected field name
      }

      const { count, rows } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: 'applicant', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: Program, as: 'program', include: [{ model: Department, as: 'department' }] },
          { model: Biodata, as: 'biodata', attributes: ['firstName', 'lastName'] }, // Select only needed fields
          { model: AcademicSession, as: 'academicSession' },
          {
            model: Staff,
            as: 'assignedOfficer',
            include: [
              {
                model: Staff,
                as: 'staff',
                include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
              },
            ],
          },
        ],
        // limit,
        // offset,
        order: [['updatedAt', 'DESC']],
      })

      return {
        applications: rows,
        total: count,
        page,
        limit,
        // totalPages: Math.ceil(count / limit),
      }
    } catch (error) {
      logger.error('Error fetching all applications (filtered)', { error })
      throw new AppError('Failed to fetch applications', 500)
    }
  }

  // Assign application to admission officer (for HOA)
  public async assignToOfficer(applicationId: string, officerId: string): Promise<Application> {
    try {
      const application = await this.getApplicationDetailsById(applicationId)
      if (!application) throw new AppError('Application not found', 404)

      const officer = await Staff.findByPk(officerId)
      if (!officer) throw new AppError('Admission officer not found', 404)

      application.assignedOfficerId = officerId
      // Optionally, update status if it was e.g. SUBMITTED and now assigned
      if (application.status === ApplicationStatus.SUBMITTED) {
        application.status = ApplicationStatus.UNDER_REVIEW
      }
      await application.save()

      logger.info('Application assigned to officer', { applicationId, officerId })
      return application
    } catch (error) {
      logger.error('Error assigning application', { error })
      throw error instanceof AppError ? error : new AppError('Failed to assign application', 500)
    }
  }

  // Final submission by applicant
  public async finalizeApplicantSubmission(
    applicationId: string,
    applicantUserId: number
  ): Promise<any> {
    const application = await Application.findOne({
      where: { id: applicationId, applicantUserId },
      include: [
        {
          model: Biodata,
          as: 'biodata',
          required: false,
        },
        {
          model: Program,
          as: 'program',
          required: false,
        },
        {
          model: ApplicantSSCQualification,
          as: 'sscQualification',
          required: false,
        },
        {
          model: ApplicantProgramSpecificQualification,
          as: 'programSpecificQualifications',
          required: false,
        },
      ],
    })

    if (!application) {
      throw new AppError('Application not found or you do not have permission.', 404)
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError(
        `Application is already ${application.status.toLowerCase()} and cannot be re-submitted.`,
        400
      )
    }

    // Comprehensive validation
    const validationErrors: string[] = []

    // 1. Check if biodata exists and is complete
    if (!application.biodata) {
      validationErrors.push('Biodata information is required')
    } else if (!application.biodata.isComplete()) {
      validationErrors.push('Biodata information is incomplete. Please fill in all required fields')
    }

    // 2. Check if program is selected
    if (!application.program) {
      validationErrors.push('Program selection is required')
    }

    // 3. Check if SSC qualification exists and is complete
    if (!application.sscQualifications) {
      validationErrors.push('SSC Qualification information is required')
    } else if (!application.sscQualifications.isComplete()) {
      validationErrors.push('SSC Qualification information is incomplete')
    }

    // 4. Check program-specific qualifications (if the program requires them)
    if (application.program?.getProgramSpecificQualifications()) {
      if (!application.programSpecificQualifications) {
        validationErrors.push('Program-specific qualifications are required for this program')
      } else {
        const incompleteQualifications = !application.programSpecificQualifications.isComplete()
        if (incompleteQualifications) {
          validationErrors.push('Some program-specific qualifications are incomplete')
        }
      }
    }

    // 5. Additional document validations (if needed)
    // Add more validation logic here as needed

    if (validationErrors.length > 0) {
      throw new AppError(
        `Application cannot be submitted due to the following issues: ${validationErrors.join('; ')}`,
        400
      )
    }

    // All validations passed, update application status
    application.status = ApplicationStatus.SUBMITTED
    application.submittedAt = new Date()
    await application.save()

    logger.info('Applicant finalized submission', { applicationId, applicantUserId })

    // TODO: Trigger notifications (email to applicant, alert to admins)

    // Return the fully populated application for the client to update its state
    return this.getApplicationDetailsById(applicationId)
  }

  // Get application counts by status (for Admin/HOA dashboards)
  public async getApplicationCountsByStatus(
    academicSessionId?: string
  ): Promise<{ status: ApplicationStatus; count: number }[]> {
    try {
      const whereClause: any = {}
      if (academicSessionId) {
        whereClause.academicSessionId = academicSessionId
      }

      const counts = (await Application.findAll({
        attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        where: whereClause,
        group: ['status'],
        raw: true,
      })) as unknown as Array<{ status: ApplicationStatus; count: string }> // count is string from raw query

      return counts.map(item => ({
        status: item.status,
        count: Number.parseInt(item.count, 10),
      }))
    } catch (error) {
      logger.error('Error fetching application counts by status', { error })
      throw new AppError('Failed to fetch application counts', 500)
    }
  }

  // Get application by ID with all related data
  static async getApplicationById(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: Program, as: 'program' },
          { model: AcademicSession, as: 'academicSession' },
          { model: Biodata, as: 'bioData' },
          {
            model: ApplicantSSCQualification,
            as: 'applicantSscQualifications',
            include: [{ model: ApplicantSSCSubjectAndGrade, as: 'subjects' }],
          },
          {
            model: ApplicantProgramSpecificQualification,
            as: 'applicantProgramSpecificQualifications',
            include: [{ model: ProgramSpecificQualification, as: 'programSpecificQualification' }],
          },
          { model: Staff, as: 'Staff' },
        ],
      })

      if (!application) {
        throw new AppError('Application not found', 404)
      }

      return application
    } catch (error) {
      logger.error('Error fetching application', { error, id })
      throw error instanceof AppError ? error : new AppError('Failed to fetch application', 500)
    }
  }

  // Update application status
  public async updateApplicationStatus(id: string, status: ApplicationStatus, comments?: string) {
    try {
      const application = await Application.findByPk(id)
      if (!application) {
        throw new AppError('Application not found', 404)
      }

      await application.update({ status, adminComments: comments }) // Assuming adminComments field exists

      logger.info('Application status updated', {
        applicationId: id,
        oldStatus: application.status, // This will be the new status due to update order
        newStatus: status,
        comments,
      })

      return application
    } catch (error) {
      logger.error('Error updating application status', { error })
      throw error instanceof AppError ? error : new AppError('Failed to update status', 500)
    }
  }
}

export default ApplicationService
