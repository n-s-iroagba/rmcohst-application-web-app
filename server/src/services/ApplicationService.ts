// src/services/ApplicationService.ts

import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors'
import logger from '../utils/logger'
import { ApplicationStatus } from '../models/Application'
import GoogleDriveApplicationService from './DriveService'
import ApplicationRepository from '../repositories/ApplicationRepository'
import ProgramRepository from '../repositories/ProgramRepository'
import BiodataRepository from '../repositories/BiodataRepository'
import ApplicantSSCQualificationRepository from '../repositories/ApplicantSSCQualificationRepository'
import ApplicantProgramSpecificQualificationRepository from '../repositories/ApplicantProgramSpecificQualificationRepository'
import ProgramSpecificRequirementRepository from '../repositories/ProgramSpecificRequirementsRepository'
import AdmissionSessionRepository from '../repositories/AdmissionSessionRepository'
import PaymentRepository from '../repositories/PaymentRepository'
import UserRepository from '../repositories/UserRepository'


interface ApplicationFilters {
  status?: string
  academicSessionId?: string
  StaffId?: string
  unassigned?: boolean
  page?: number
  limit?: number
}

export type ApplicationPaymentStatus = {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'NO-PAYMENT'
  payment: any[]
}

const googleDriveService = new GoogleDriveApplicationService()

class ApplicationService {
  public async getApplcationPaymentStatus(userId: string): Promise<ApplicationPaymentStatus> {
    try {
      const currentSession = await AdmissionSessionRepository.findCurrentSession()
      if (!currentSession) throw new NotFoundError('Session not found')

      const payments = await PaymentRepository.findPaymentsByUserAndSession(userId, currentSession.id)
      
      const completePayment = payments.filter(p => p.status === 'PAID')
      if (completePayment.length > 0) return { status: 'PAID', payment: completePayment }
      
      const pendingPayment = payments.filter(p => p.status === 'PENDING')
      if (pendingPayment.length > 0) return { status: 'PENDING', payment: pendingPayment }
      
      const failedPayment = payments.filter(p => p.status === 'FAILED')
      if (failedPayment.length > 0) return { status: 'FAILED', payment: failedPayment }
      
      return { status: 'NO-PAYMENT', payment: [] }
    } catch (error) {
      logger.error('Error getting application payment status', { userId, error })
      throw error
    }
  }

  public async createInitialApplication(data: {
    applicantUserId: number
    sessionId: number
    programId: number
  }) {
    try {
      const { applicantUserId } = data
      
      // Check for existing application
      const existingApplication = await ApplicationRepository.findApplicationByUserAndSession(
        applicantUserId,
        data.sessionId
      )

      if (existingApplication) return existingApplication

      // Validate program exists
      const program = await ProgramRepository.findById(data.programId)
      if (!program) {
        throw new BadRequestError('The Program you wish to apply for is not available')
      }

      // Create application
      const application = await ApplicationRepository.createApplication({
        ...data,
        applicantUserId,
        status: ApplicationStatus.DRAFT,
      })

      const applicationId = application.id

      // Create related records
      await BiodataRepository.createBiodata({applicationId})
      await ApplicantSSCQualificationRepository.createApplicantSSCQualification({applicationId})

      // Create program-specific qualification if required
      const programSpecificRequirement = await ProgramSpecificRequirementRepository.findProgramById(program.id)
      if (programSpecificRequirement) {
        await ApplicantProgramSpecificQualificationRepository. createApplicantProgramSpecificQualification({
          applicationId,
          qualificationType: programSpecificRequirement.qualificationType,
        })
      }

      logger.info('Application created successfully', { applicationId: application.id })
      console.log('created application is,', application)
      return application
    } catch (error) {
      logger.error('Error creating application', { error })
      throw error
    }
  }

  public async getApplicationById(
    id: number | string,
    shouldThrowErrorIfNotFound: boolean = false
  ) {
    try {
      const application = await ApplicationRepository.findApplicationById(id)

      if (!application && shouldThrowErrorIfNotFound) {
        throw new NotFoundError('Application not found')
      }

      return application
    } catch (error) {
      logger.error('Error fetching application', { error, id })
      throw error
    }
  }

  public async getApplicationByUserId(id: string, shouldThrowErrorIfNotFound: boolean = false) {
    try {
      const application = await ApplicationRepository.findApplicationByUserId(id)
      console.log(application)
      
      if (!application && shouldThrowErrorIfNotFound) {
        throw new NotFoundError('Application not found')
      }

      return application
    } catch (error) {
      logger.error('Error fetching application', { error, id })
      throw error
    }
  }

  public async getAllApplicationsFiltered(filters: ApplicationFilters) {
    try {
      const { page, limit } = filters
      const result = await ApplicationRepository.findAllApplicationsFiltered(filters)

      return {
        ...result,
        page,
        limit,
      }
    } catch (error) {
      logger.error('Error fetching all applications (filtered)', { error })
      throw error
    }
  }



  public async finalizeApplicantSubmission(applicationId: string, applicantUserId: number) {
    try {
      // Get the application first
      const application = await this.getApplicationById(applicationId)
      if (!application || application.applicantUserId !== applicantUserId) {
        throw new NotFoundError('Application not found or you do not have permission.')
      }

      if (application.status !== ApplicationStatus.DRAFT) {
        throw new ForbiddenError(
          `Application is already ${application.status.toLowerCase()} and cannot be re-submitted.`
        )
      }

      // Fetch related data for validation
      const [user, biodata, program, sscQualification, programSpecificQualifications, academicSession] = 
        await Promise.allSettled([
          UserRepository.findUserById(applicantUserId),
          BiodataRepository.findBiodataByApplication(application.id),
          ProgramRepository.findById(application.programId),
          ApplicantSSCQualificationRepository.findSSCQualificationByApplication(application.id),
          ApplicantProgramSpecificQualificationRepository.findProgramSpecificQualificationsByApplication(application.id),
          AdmissionSessionRepository.findCurrentSession(),
        ])

      // Extract results with error handling
      const extractedUser = user.status === 'fulfilled' ? user.value : null
      const extractedBiodata = biodata.status === 'fulfilled' ? biodata.value : null
      const extractedProgram = program.status === 'fulfilled' ? program.value : null
      const extractedSSC = sscQualification.status === 'fulfilled' ? sscQualification.value : null
      const extractedProgramSpecific = programSpecificQualifications.status === 'fulfilled' ? programSpecificQualifications.value : []
      const extractedSession = academicSession.status === 'fulfilled' ? academicSession.value : null

      // Log any failed promises
      const queryNames = ['user', 'biodata', 'program', 'sscQualification', 'programSpecificQualifications', 'academicSession']
      ;[user, biodata, program, sscQualification, programSpecificQualifications, academicSession].forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.warn(`Failed to fetch ${queryNames[index]}:`, result.reason)
        }
      })

      if (!extractedUser) {
        throw new NotFoundError('User not found')
      }

      // Validate the application data
      const validationErrors = this.validateApplicationData({
        biodata: extractedBiodata,
        program: extractedProgram,
        sscQualification: extractedSSC,
        programSpecificQualifications: extractedProgramSpecific,
      })

      if (validationErrors.length > 0) {
        throw new ForbiddenError(
          `Application cannot be submitted due to the following issues: ${validationErrors.join('; ')}`
        )
      }

      // All validations passed, update application status
      const updatedApplication = await ApplicationRepository.updateApplicationById(applicationId, {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      })

      await googleDriveService.processApplicationSubmission(updatedApplication!)

      logger.info('Applicant finalized submission', {
        applicationId,
        applicantUserId,
        username: extractedUser.username,
        programName: extractedProgram?.name,
        sessionName: extractedSession?.name,
      })

      // Return the complete application data
      return {
        application: updatedApplication,
        user: extractedUser,
        biodata: extractedBiodata,
        program: extractedProgram,
        sscQualification: extractedSSC,
        programSpecificQualifications: extractedProgramSpecific,
        academicSession: extractedSession,
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

  public async getApplicationCountsByStatus(academicSessionId?: string) {
    try {
      const counts = await ApplicationRepository.getApplicationCountsByStatus(academicSessionId)

      return counts.map(item => ({
        status: item.status,
        count: Number.parseInt(item.count, 10),
      }))
    } catch (error) {
      logger.error('Error fetching application counts by status', { error })
      throw error
    }
  }

  public async updateApplicationStatus(id: string, status: ApplicationStatus, comments?: string) {
    try {
      const application = await ApplicationRepository.findApplicationById(id)
      if (!application) {
        throw new NotFoundError('Application not found')
      }

      const updatedApplication = await ApplicationRepository.updateApplicationById(id, {
        status,
        adminComments: comments,
      })

      logger.info('Application status updated', {
        applicationId: id,
        oldStatus: application.status,
        newStatus: status,
        comments,
      })

      return updatedApplication
    } catch (error) {
      logger.error('Error updating application status', { error })
      throw error
    }
  }
}

export default ApplicationService