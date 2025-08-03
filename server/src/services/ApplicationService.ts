import { fn, col } from 'sequelize'
import AdmissionSession from '../models/AdmissionSession'

import {
  ApplicantSSCQualification,
  Application,
  Biodata,
  ApplicantProgramSpecificQualification,
} from '../models'
import { Department } from '../models/Department'
import { Faculty } from '../models/Faculty'
import Program from '../models/Program'
import ProgramSpecificRequirement from '../models/ProgramSpecificRequirement'
import { Staff } from '../models/Staff'
import User from '../models/User'
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'
import { ApplicationCreationAttributes, ApplicationStatus } from '../models/Application'
import Payment from '../models/Payment'
import { FullApplication } from '../types/models'
import GoogleDriveApplicationService from './DriveService'

interface ApplicationFilters {
  status?: string
  academicSessionId?: string // Assuming UUID
  StaffId?: string // Assuming UUID
  unassigned?: boolean
  page?: number
  limit?: number
}
export type ApplicationPaymentStatus = {
  status:'PENDING'|'PAID'|'FAILED'|'NO-PAYMENT'
  payment:Payment[]
}
class ApplicationService {
  private googleDriveService: GoogleDriveApplicationService

// Add this to your constructor
constructor() {
  this.googleDriveService = new GoogleDriveApplicationService()
}

  public async getApplcationPaymentStatus(userId:string):Promise<ApplicationPaymentStatus>{
    const currentSession = await AdmissionSession.findOne({where:{
      isCurrent:true
    }})
  if(!currentSession) throw new NotFoundError('Session not found ')
  const payments = await Payment.findAll({where:{
    applicantUserId:userId,
    sessionId:currentSession.id
  },
  order: [['paidAt', 'DESC']],
  })
const completePayment = payments.filter((p)=>p.status ==='PAID')
if(completePayment) return {status:'PAID',payment:completePayment}
const pendingPayment = payments.filter((p)=>p.status ==='PENDING')
if(pendingPayment) return {status:'PENDING',payment:pendingPayment}
const failedPayment = payments.filter((p)=>p.status ==='FAILED')
if(failedPayment) return {status:'FAILED',payment:failedPayment}
return {status:'NO-PAYMENT',payment:[]}

  }
  public async createInitialApplication(
    
    data: {
      applicantUserId: number,
      sessionId: number
      programId?: number  
    }
  ): Promise<Application> {
    try {
      const {applicantUserId} = data
      const existingApplication = await Application.findOne({
        where: {
          applicantUserId,
          sessionId: data.sessionId,
        },
      })
 
      if (existingApplication)
        throw new BadRequestError(
          'Application already exists for this user in this academic session.'
        )
  
      const program = await Program.findByPk(data.programId)

      if (!program) throw new BadRequestError('The Program you wish to apply for in not available')

      const application = await Application.create({
        ...data,
        applicantUserId,
        status: ApplicationStatus.DRAFT,
      } as unknown as ApplicationCreationAttributes)
      const applicationId = application.id
      await Biodata.create({ applicationId })
      await ApplicantSSCQualification.create({ applicationId })
      const programSpecificQualification = await ProgramSpecificRequirement.findOne({
        where: { programId: program.id },
      })
      if (programSpecificQualification)
        await ApplicantProgramSpecificQualification.create({
          applicationId,
          qualificationType: programSpecificQualification.qualificationType,
        })

      logger.info('Application created successfully', { applicationId: application.id })
      console.log('created application is,', application)
      return application
    } catch (error) {
      logger.error('Error creating application', { error })
      throw error
    }
  }

  // Get application by ID with all related data
  public async getApplicationDetailsById(id:string,shouldThrowErrorIfNotFound:boolean=false): Promise<FullApplication|null> {
   
    try {
      const application = await Application.findByPk(id,{
        include: [

          {
            model: Program,
            as: 'program',
            include: [
              {
                model: Department,
                as: 'department',
                include: [{ model: Faculty, as: 'faculty' }],
              },
            ],
          },
          { model: Biodata, as: 'biodata' },
          { model: AdmissionSession, as: 'academicSession' },
            { model: ApplicantSSCQualification, as: 'sscQualification' },
          {
            model: ApplicantProgramSpecificQualification,
                    as: 'programSpecificQualifications',
    
          },
          // {
          //   model: Staff,
          //   as: 'assignedOfficer',
          //   include: [
          //     {
          //       model: Staff,
          //       as: 'staff',
          //       include: [
          //         {
          //           model: User,
          //           as: 'user',
          //           attributes: ['firstName', 'lastName'],
          //         },
          //       ],
          //     },
          //   ],
          // },
        ],
      })as FullApplication


      if (!application && shouldThrowErrorIfNotFound) {
        throw new BadRequestError('Application not found')
      }
      console.log(application)
      return application
    } catch (error) {
      logger.error('Error fetching application details', { error })
      throw error
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
          { model: AdmissionSession, as: 'academicSession' },
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
      throw error
    }
  }

  // Assign application to admission officer (for HOA)
  public async assignToOfficer(applicationId: string, officerId: string): Promise<Application> {
    try {
      const application = await this.getApplicationDetailsById(applicationId)
      if (!application) throw new NotFoundError('Application not found')

      const officer = await Staff.findByPk(officerId)
      if (!officer) throw new NotFoundError('Admission officer not found')

      application.assignedOfficerId = officer.id
      // Optionally, update status if it was e.g. SUBMITTED and now assigned
      if (application.status === ApplicationStatus.SUBMITTED) {
        application.status = ApplicationStatus.UNDER_REVIEW
      }
      await application.save()

      logger.info('Application assigned to officer', { applicationId, officerId })
      return application
    } catch (error) {
      logger.error('Error assigning application', { error })
      throw error
    }
  }

  // Final submission by applicant
  public async finalizeApplicantSubmission(
    applicationId: string,
    applicantUserId: number
  ): Promise<any> {
    try {
      // Get the application first
      const application = await Application.findOne({
        where: { id: applicationId, applicantUserId },
      })

      if (!application) {
        throw new NotFoundError('Application not found or you do not have permission.')
      }

      if (application.status !== ApplicationStatus.DRAFT) {
        throw new ForbiddenError(
          `Application is already ${application.status.toLowerCase()} and cannot be re-submitted.`
        )
      }

      // Fetch related models in parallel for better performance
      const relatedDataPromises = {
        user: User.findByPk(applicantUserId),
        biodata: Biodata.findOne({ where: { applicationId: application.id } }),
        program: application.programId
          ? Program.findByPk(application.programId)
          : Promise.resolve(null),
        sscQualification: ApplicantSSCQualification.findOne({
          where: { applicationId: application.id },
        }),
        programSpecificQualifications: ApplicantProgramSpecificQualification.findAll({
          where: { applicationId: application.id },
        }),
        academicSession: AdmissionSession.findByPk(application.sessionId),
      }

      // Wait for all queries to complete
      const relatedData = await Promise.allSettled([
        relatedDataPromises.user,
        relatedDataPromises.biodata,
        relatedDataPromises.program,
        relatedDataPromises.sscQualification,
        relatedDataPromises.programSpecificQualifications,
        relatedDataPromises.academicSession,
      ])

      // Extract results with error handling
      const [
        userResult,
        biodataResult,
        programResult,
        sscResult,
        programSpecificResult,
        sessionResult,
      ] = relatedData

      const user = userResult.status === 'fulfilled' ? userResult.value : null
      const biodata = biodataResult.status === 'fulfilled' ? biodataResult.value : null
      const program = programResult.status === 'fulfilled' ? programResult.value : null
      const sscQualification = sscResult.status === 'fulfilled' ? sscResult.value : null
      const programSpecificQualifications =
        programSpecificResult.status === 'fulfilled' ? programSpecificResult.value : []
      const academicSession = sessionResult.status === 'fulfilled' ? sessionResult.value : null

      // Log any failed promises
      relatedData.forEach((result, index) => {
        if (result.status === 'rejected') {
          const queryNames = [
            'user',
            'biodata',
            'program',
            'sscQualification',
            'programSpecificQualifications',
            'academicSession',
          ]
          logger.warn(`Failed to fetch ${queryNames[index]}:`, result.reason)
        }
      })

      if (!user) {
        throw new NotFoundError('User not found')
      }

      // Validate the application data
      const validationErrors = this.validateApplicationData({
        biodata,
        program,
        sscQualification,
        programSpecificQualifications,
      })

      if (validationErrors.length > 0) {
        throw new ForbiddenError(
          `Application cannot be submitted due to the following issues: ${validationErrors.join('; ')}`
        )
      }

      // All validations passed, update application status
      application.status = ApplicationStatus.SUBMITTED
      application.submittedAt = new Date()
      await application.save()

      logger.info('Applicant finalized submission', {
        applicationId,
        applicantUserId,
        username: `${user.username}`,
        programName: program?.name,
        sessionName: academicSession?.name,
      })

      // TODO: Trigger notifications (email to applicant, alert to admins)

      // Return the complete application data
      return {
        application,
        user,
        biodata,
        program,
        sscQualification,
        programSpecificQualifications,
        academicSession,
      }
    } catch (error) {
      logger.error('Error finalizing application submission:', {
        applicationId,
        applicantUserId,
        error: error,
      })
      throw error
    }
  }

  // Helper method to validate application data
  private validateApplicationData(data: {
    biodata: any
    program: any
    sscQualification: any
    programSpecificQualifications: any[]
  }): string[] {
    const validationErrors: string[] = []

    // 1. Check if biodata exists and is complete
    if (!data.biodata) {
      validationErrors.push('Biodata information is required')
    } else if (typeof data.biodata.isComplete === 'function' && !data.biodata.isComplete()) {
      validationErrors.push('Biodata information is incomplete. Please fill in all required fields')
    }

    // 2. Check if program is selected
    if (!data.program) {
      validationErrors.push('Program selection is required')
    }

    // 3. Check if SSC qualification exists and is complete
    if (!data.sscQualification) {
      validationErrors.push('SSC Qualification information is required')
    } else if (
      typeof data.sscQualification.isComplete === 'function' &&
      !data.sscQualification.isComplete()
    ) {
      validationErrors.push('SSC Qualification information is incomplete')
    }

    // 4. Check program-specific qualifications (if the program requires them)
    if (
      data.program &&
      typeof data.program.getProgramSpecificRequirements === 'function' &&
      data.program.getProgramSpecificRequirements()
    ) {
      if (!data.programSpecificQualifications || data.programSpecificQualifications.length === 0) {
        validationErrors.push('Program-specific qualifications are required for this program')
      } else {
        const incompleteQualifications = data.programSpecificQualifications.some(
          qual => typeof qual.isComplete === 'function' && !qual.isComplete()
        )
        if (incompleteQualifications) {
          validationErrors.push('Some program-specific qualifications are incomplete')
        }
      }
    }

    return validationErrors
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
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
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
      throw error
    }
  }


  // Get application by ID with all related data
  static async getApplicationById(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: Program, as: 'program' },
          { model: AdmissionSession, as: 'academicSession' },
          { model: Biodata, as: 'bioData' },
          {
            model: ApplicantProgramSpecificQualification,
            as: 'applicantProgramSpecificQualifications',
            include: [{ model: ProgramSpecificRequirement, as: 'programSpecificQualification' }],
          },
          { model: Staff, as: 'Staff' },
        ],
      }) as FullApplication

      if (!application) {
        throw new NotFoundError('Application not found')
      }

      return application
    } catch (error) {
      logger.error('Error fetching application', { error, id })
      throw error
    }
  }

  // Update application status
  public async updateApplicationStatus(id: string, status: ApplicationStatus, comments?: string) {
    try {
      const application = await Application.findByPk(id)
      if (!application) {
        throw new NotFoundError('Application not found')
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
      throw error
    }
  }
}

export default ApplicationService
