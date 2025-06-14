import Application, { ApplicationStatus, type ApplicationCreationAttributes } from "../models/Application"
import User from "../models/User"
import Biodata from "../models/Biodata"
import AcademicSession from "../models/AcademicSession"
import AdmissionOfficer from "../models/AdmissionOfficer"
import { AppError } from "../utils/error/AppError"
import logger from "../utils/logger/logger"
import Program from "../models/Program"
import { sequelize } from "../config/database"
import ApplicantSSCQualification from "../models/ApplicantSSCQualification"
import ApplicantSSCSubject from "../models/ApplicantSSCSubject"
import ApplicantProgramSpecificQualification from "../models/ApplicantProgramSpecificQualification"
import ProgramSpecificQualification from "../models/ProgramSpecificQualification" // Assuming this model exists
import { Staff } from "../models/Staff" // Assuming this model exists
import { Department } from "../models/Department" // Assuming this model exists
import { Faculty } from "../models/Faculty" // Assuming this model exists
import ApplicantDocument from "../models/ApplicantDocument" // Added import for ApplicantDocument

interface ApplicationFilters {
  status?: string
  academicSessionId?: string // Assuming UUID
  admissionOfficerId?: string // Assuming UUID
  unassigned?: boolean
  page: number
  limit: number
}

class ApplicationService {
  // Create new application (initial creation, e.g., after payment)
  // This method might need adjustment based on your exact flow for when an application record is first created.
  // The getOrCreateApplicationByUserId method below is more relevant for applicant dashboard interactions.
  static async createInitialApplication(data: {
    applicantUserId: string
    academicSessionId: string
    programId?: string // Program might be chosen later
    // status is typically DRAFT initially or a post-payment status
  }): Promise<Application> {
    try {
      const existingApplication = await Application.findOne({
        where: {
          applicantUserId: data.applicantUserId,
          academicSessionId: data.academicSessionId,
        },
      })

      if (existingApplication) {
        // Decide policy: error, or return existing? For now, error if trying to create duplicate for same session.
        throw new AppError("Application already exists for this user in this academic session.", 409)
      }

      const application = await Application.create({
        ...data,
        status: ApplicationStatus.DRAFT, // Default to DRAFT
      } as ApplicationCreationAttributes) // Ensure type compatibility

      // Optionally create an empty biodata record linked to this application if that's your flow
      // await Biodata.create({ applicationId: application.id /* other initial biodata fields */ });

      logger.info("Application created successfully", { applicationId: application.id })
      return application
    } catch (error) {
      logger.error("Error creating application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to create application", 500)
    }
  }

  // Get or create a DRAFT application for a user, fully populated for review/editing.
  // This is likely what the client's getMyApplication service should call.
  public async getOrCreateApplicationForUser(applicantUserId: string, academicSessionId: string): Promise<Application> {
    const [application, created] = await Application.findOrCreate({
      where: {
        applicantUserId,
        academicSessionId, // Scope to current/active session
        // Optionally, only find/create if status is DRAFT or some other editable status
        // status: ApplicationStatus.DRAFT
      },
      defaults: {
        applicantUserId,
        academicSessionId,
        status: ApplicationStatus.DRAFT,
      } as ApplicationCreationAttributes,
      include: [
        { model: User, as: "applicant", attributes: ["id", "email", "firstName", "lastName", "role"] },
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" }, // Ensure 'biodata' alias matches model association
        { model: AcademicSession, as: "academicSession" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        {
          model: ApplicantProgramSpecificQualification,
          as: "programSpecificQualifications",
          include: [{ model: ProgramSpecificQualification, as: "qualificationDefinition" }], // Example alias
        },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
        // Add other relevant includes like assignedOfficer if needed on review page
      ],
      order: [["updatedAt", "DESC"]], // Get the latest if multiple match criteria (e.g. if not scoped by DRAFT status)
    })

    if (created) {
      logger.info("New DRAFT application created for user", { userId: applicantUserId, applicationId: application.id })
    }
    // If an application exists but is not DRAFT, and we strictly need a DRAFT one:
    // if (!created && application.status !== ApplicationStatus.DRAFT) {
    //   throw new AppError("An application for this session already exists and is not in draft state.", 409);
    // }
    return application
  }

  // Get application by ID with all related data
  public async getApplicationDetailsById(id: string): Promise<Application> {
    try {
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: "applicant", attributes: ["id", "email", "firstName", "lastName", "role"] },
          {
            model: Program,
            as: "program",
            include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
          },
          { model: Biodata, as: "biodata" },
          { model: AcademicSession, as: "academicSession" },
          {
            model: ApplicantSSCQualification,
            as: "sscQualifications",
            include: [{ model: ApplicantSSCSubject, as: "subjects" }],
          },
          {
            model: ApplicantProgramSpecificQualification,
            as: "programSpecificQualifications",
            include: [{ model: ProgramSpecificQualification, as: "qualificationDefinition" }],
          },
          {
            model: ApplicantDocument,
            as: "applicantDocuments",
            attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
          },
          {
            model: AdmissionOfficer,
            as: "assignedOfficer", // Ensure alias matches model association
            include: [
              {
                model: Staff,
                as: "staff",
                include: [{ model: User, as: "user", attributes: ["firstName", "lastName"] }],
              },
            ],
          },
        ],
      })

      if (!application) {
        throw new AppError("Application not found", 404)
      }
      return application
    } catch (error) {
      logger.error("Error fetching application details", { error, id })
      throw error instanceof AppError ? error : new AppError("Failed to fetch application details", 500)
    }
  }

  // Get all applications with filters and pagination (for Admin/HOA)
  public async getAllApplicationsFiltered(filters: ApplicationFilters) {
    try {
      const { status, academicSessionId, admissionOfficerId, unassigned, page, limit } = filters
      const offset = (page - 1) * limit

      const whereClause: any = {}
      if (status) whereClause.status = status
      if (academicSessionId) whereClause.academicSessionId = academicSessionId

      if (unassigned) {
        whereClause.assignedOfficerId = null // Corrected field name
      } else if (admissionOfficerId) {
        whereClause.assignedOfficerId = admissionOfficerId // Corrected field name
      }

      const { count, rows } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: "applicant", attributes: ["id", "email", "firstName", "lastName"] },
          { model: Program, as: "program", include: [{ model: Department, as: "department" }] },
          { model: Biodata, as: "biodata", attributes: ["firstName", "lastName"] }, // Select only needed fields
          { model: AcademicSession, as: "academicSession" },
          {
            model: AdmissionOfficer,
            as: "assignedOfficer",
            include: [
              {
                model: Staff,
                as: "staff",
                include: [{ model: User, as: "user", attributes: ["firstName", "lastName"] }],
              },
            ],
          },
        ],
        limit,
        offset,
        order: [["updatedAt", "DESC"]],
      })

      return {
        applications: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    } catch (error) {
      logger.error("Error fetching all applications (filtered)", { error })
      throw new AppError("Failed to fetch applications", 500)
    }
  }

  // Update application status (for Admin/HOA)
  public async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    comments?: string,
    actingUserRole?: string, // e.g., 'ADMISSION_OFFICER', 'HEAD_OF_ADMISSIONS'
  ): Promise<Application> {
    try {
      const application = await this.getApplicationDetailsById(applicationId) // Use detailed fetch
      if (!application) {
        throw new AppError("Application not found", 404)
      }

      // Add logic for status transition validation if needed
      // Example: application.status can only go from SUBMITTED to UNDER_REVIEW by an admin

      application.status = newStatus
      if (comments) {
        if (actingUserRole === "ADMISSION_OFFICER" || actingUserRole === "ADMIN") {
          application.adminComments = comments
        } else if (actingUserRole === "HEAD_OF_ADMISSIONS") {
          application.hoaComments = comments
        }
        if (newStatus === ApplicationStatus.REJECTED) {
          application.rejectionReason = comments
        }
      }
      await application.save()

      logger.info("Application status updated", { applicationId, newStatus, comments })
      // TODO: Trigger notifications (email, in-app)
      return application
    } catch (error) {
      logger.error("Error updating application status", { error })
      throw error instanceof AppError ? error : new AppError("Failed to update status", 500)
    }
  }

  // Assign application to admission officer (for HOA)
  public async assignToOfficer(applicationId: string, officerId: string): Promise<Application> {
    try {
      const application = await this.getApplicationDetailsById(applicationId)
      if (!application) throw new AppError("Application not found", 404)

      const officer = await AdmissionOfficer.findByPk(officerId)
      if (!officer) throw new AppError("Admission officer not found", 404)

      application.assignedOfficerId = officerId
      // Optionally, update status if it was e.g. SUBMITTED and now assigned
      if (application.status === ApplicationStatus.SUBMITTED) {
        application.status = ApplicationStatus.UNDER_REVIEW
      }
      await application.save()

      logger.info("Application assigned to officer", { applicationId, officerId })
      return application
    } catch (error) {
      logger.error("Error assigning application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to assign application", 500)
    }
  }

  // Final submission by applicant
  public async finalizeApplicantSubmission(applicationId: string, applicantUserId: string): Promise<Application> {
    const application = await Application.findOne({
      where: { id: applicationId, applicantUserId },
      // Include associations needed for validation, if any not already on the model instance
      include: [
        { model: Biodata, as: "biodata" },
        { model: Program, as: "program" },
      ],
    })

    if (!application) {
      throw new AppError("Application not found or you do not have permission.", 404)
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError(`Application is already ${application.status.toLowerCase()} and cannot be re-submitted.`, 400)
    }

    // Server-side validation of completeness
    if (!application.biodataId || !application.programId) {
      throw new AppError("Biodata and Program Choice must be completed before submission.", 400)
    }
    const sscQualsCount = await ApplicantSSCQualification.count({ where: { applicationId: application.id } })
    if (sscQualsCount === 0) {
      throw new AppError("SSC Qualifications must be added before submission.", 400)
    }
    // Add more checks: e.g., required program-specific qualifications, document uploads, etc.

    application.status = ApplicationStatus.SUBMITTED
    application.submittedAt = new Date()
    await application.save()

    logger.info("Applicant finalized submission", { applicationId, applicantUserId })
    // TODO: Trigger notifications (email to applicant, alert to admins)

    // Return the fully populated application for the client to update its state
    return this.getApplicationDetailsById(applicationId)
  }

  // Get application counts by status (for Admin/HOA dashboards)
  public async getApplicationCountsByStatus(
    academicSessionId?: string,
  ): Promise<{ status: ApplicationStatus; count: number }[]> {
    try {
      const whereClause: any = {}
      if (academicSessionId) {
        whereClause.academicSessionId = academicSessionId
      }

      const counts = (await Application.findAll({
        attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        where: whereClause,
        group: ["status"],
        raw: true,
      })) as Array<{ status: ApplicationStatus; count: string }> // count is string from raw query

      return counts.map((item) => ({
        status: item.status,
        count: Number.parseInt(item.count, 10),
      }))
    } catch (error) {
      logger.error("Error fetching application counts by status", { error })
      throw new AppError("Failed to fetch application counts", 500)
    }
  }

  // Service method for choosing a program
  public async chooseProgram(
    applicantUserId: string,
    academicSessionId: string,
    programId: string,
  ): Promise<Application> {
    const application = await this.getOrCreateApplicationForUser(applicantUserId, academicSessionId)
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Application already submitted and program cannot be changed.", 400)
    }
    const programExists = await Program.findByPk(programId)
    if (!programExists) {
      throw new AppError("Selected program not found.", 404)
    }
    application.programId = programId
    await application.save()
    return this.getApplicationDetailsById(application.id) // Return reloaded application
  }

  // Service method for adding/updating program-specific qualifications
  public async saveProgramSpecificQualifications(
    applicantUserId: string,
    academicSessionId: string,
    qualificationsData: Array<{
      programSpecificQualificationId: string
      value?: string
      fileUrl?: string
      institutionName?: string
      yearObtained?: number
      gradeOrScore?: string
      qualificationName: string
    }>,
  ): Promise<Application> {
    const application = await this.getOrCreateApplicationForUser(applicantUserId, academicSessionId)
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Application already submitted, qualifications cannot be changed.", 400)
    }

    // Consider if this should be transactional
    await ApplicantProgramSpecificQualification.destroy({ where: { applicationId: application.id } })
    const newQualifications = qualificationsData.map((q) => ({
      ...q,
      applicationId: application.id,
      id: sequelize.literal("uuid_generate_v4()").toString(), // If UUIDs are not auto-generated by default
    }))
    await ApplicantProgramSpecificQualification.bulkCreate(newQualifications)
    return this.getApplicationDetailsById(application.id)
  }

  // Get application by ID with all related data
  static async getApplicationById(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [
          { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
          { model: Program, as: "program" },
          { model: AcademicSession, as: "academicSession" },
          { model: Biodata, as: "bioData" },
          {
            model: ApplicantSSCQualification,
            as: "applicantSscQualifications",
            include: [{ model: ApplicantSSCSubject, as: "subjects" }],
          },
          {
            model: ApplicantProgramSpecificQualification,
            as: "applicantProgramSpecificQualifications",
            include: [{ model: ProgramSpecificQualification, as: "programSpecificQualification" }],
          },
          { model: AdmissionOfficer, as: "admissionOfficer" },
        ],
      })

      if (!application) {
        throw new AppError("Application not found", 404)
      }

      return application
    } catch (error) {
      logger.error("Error fetching application", { error, id })
      throw error instanceof AppError ? error : new AppError("Failed to fetch application", 500)
    }
  }

  // Get applications by user ID
  static async getApplicationsByUserId(userId: number) {
    try {
      const applications = await Application.findAll({
        where: { userId },
        include: [
          { model: Program, as: "program" },
          { model: Biodata, as: "bioData" },
          { model: AcademicSession, as: "academicSession" },
          { model: AdmissionOfficer, as: "admissionOfficer" },
        ],
        order: [["createdAt", "DESC"]],
      })

      return applications
    } catch (error) {
      logger.error("Error fetching user applications", { error, userId })
      throw new AppError("Failed to fetch applications", 500)
    }
  }

  // Get all applications with filters and pagination
  static async getAllApplications(filters: ApplicationFilters) {
    try {
      const { status, academicSessionId, admissionOfficerId, unassigned, page, limit } = filters
      const offset = (page - 1) * limit

      const whereClause: any = {}
      if (status) whereClause.status = status
      if (academicSessionId) whereClause.academicSessionId = academicSessionId

      if (unassigned) {
        whereClause.admissionOfficerId = null
      } else if (admissionOfficerId) {
        // Only apply admissionOfficerId if unassigned is not true
        whereClause.admissionOfficerId = admissionOfficerId
      }

      const { count, rows } = await Application.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: "user", attributes: ["id", "email", "firstName", "lastName"] },
          { model: Program, as: "program" },
          { model: Biodata, as: "bioData" },
          { model: AcademicSession, as: "academicSession" },
          { model: AdmissionOfficer, as: "admissionOfficer" },
        ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      })

      return {
        applications: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      }
    } catch (error) {
      logger.error("Error fetching all applications", { error })
      throw new AppError("Failed to fetch applications", 500)
    }
  }

  // Update application status
  static async updateApplicationStatus(id: number, status: ApplicationStatus, comments?: string) {
    try {
      const application = await Application.findByPk(id)
      if (!application) {
        throw new AppError("Application not found", 404)
      }

      // Add logic to also create an AuditLog entry here if needed
      // For example:
      // await AuditLogService.logAction({
      //   userId: /* adminUserId from req.user */,
      //   action: `Updated application ${id} status to ${status}`,
      //   details: { comments }
      // });

      await application.update({ status, adminComments: comments }) // Assuming adminComments field exists

      logger.info("Application status updated", {
        applicationId: id,
        oldStatus: application.status, // This will be the new status due to update order
        newStatus: status,
        comments,
      })

      return application
    } catch (error) {
      logger.error("Error updating application status", { error })
      throw error instanceof AppError ? error : new AppError("Failed to update status", 500)
    }
  }

  // Assign application to admission officer
  static async assignToOfficer(applicationId: number, officerId: number) {
    try {
      const application = await Application.findByPk(applicationId)
      if (!application) {
        throw new AppError("Application not found", 404)
      }

      const officer = await AdmissionOfficer.findByPk(officerId)
      if (!officer) {
        throw new AppError("Admission officer not found", 404)
      }

      await application.update({ admissionOfficerId: officerId })

      logger.info("Application assigned to officer", { applicationId, officerId })
      return application
    } catch (error) {
      logger.error("Error assigning application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to assign application", 500)
    }
  }

  // Submit application for review
  static async submitApplication(id: number) {
    try {
      const application = await Application.findByPk(id, {
        include: [{ model: Biodata, as: "bioData" }],
      })

      if (!application) {
        throw new AppError("Application not found", 404)
      }

      // Validate that required sections are completed
      const biodata = await application.getBioData() // Sequelize getter
      if (!biodata) {
        // Check if biodata exists
        throw new AppError("Biodata must be completed before submission", 400)
      }
      // Add checks for other required sections like SSC, Program Specific Quals if needed

      await application.update({ status: "SUBMITTED" })

      logger.info("Application submitted for review", { applicationId: id })
      return application
    } catch (error) {
      logger.error("Error submitting application", { error })
      throw error instanceof AppError ? error : new AppError("Failed to submit application", 500)
    }
  }

  // Get application counts by status
  static async getApplicationCountsByStatus(): Promise<{ status: ApplicationStatus; count: number }[]> {
    try {
      const counts = await Application.findAll({
        attributes: ["status", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
        group: ["status"],
        raw: true, // Get plain JSON objects
      })
      // The result from sequelize.fn might be a string, ensure it's a number
      return counts.map((item) => ({
        status: item.status as ApplicationStatus,
        count: Number.parseInt(item.count as string, 10),
      })) as { status: ApplicationStatus; count: number }[]
    } catch (error) {
      logger.error("Error fetching application counts by status", { error })
      throw new AppError("Failed to fetch application counts", 500)
    }
  }

  public async getOrCreateApplicationByUserId(applicantUserId: string): Promise<Application> {
    const [application] = await Application.findOrCreate({
      where: { applicantUserId, status: ApplicationStatus.DRAFT }, // Ensure we only get draft if creating
      defaults: {
        id: sequelize.literal("uuid_generate_v4()").toString(), // for UUID generation if not default in model
        applicantUserId,
        status: ApplicationStatus.DRAFT,
      } as ApplicationCreationAttributes, // Cast to satisfy type, ensure id is handled by DB or Sequelize
      include: [
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
      ],
    })

    // If an application exists but is not DRAFT, and we intended to get *any* application for the user:
    // This logic might need adjustment based on whether an applicant can have multiple non-draft applications.
    // For now, findOrCreate with DRAFT status is specific. If we need to fetch a non-draft one, a separate method is better.
    // If the found application is not DRAFT and we were looking for *any* application:
    if (application.status !== ApplicationStatus.DRAFT) {
      const existingApplication = await Application.findOne({
        where: { applicantUserId },
        order: [["updatedAt", "DESC"]], // Get the latest one
        include: [
          {
            model: Program,
            as: "program",
            include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
          },
          { model: Biodata, as: "biodata" },
          {
            model: ApplicantSSCQualification,
            as: "sscQualifications",
            include: [{ model: ApplicantSSCSubject, as: "subjects" }],
          },
          { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
          {
            model: ApplicantDocument,
            as: "applicantDocuments",
            attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
          },
        ],
      })
      if (existingApplication) return existingApplication
    }

    return application
  }

  public async chooseProgram(applicantUserId: string, programId: string): Promise<Application> {
    const application = await this.getOrCreateApplicationByUserId(applicantUserId)
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Application already submitted and cannot be modified.", 400)
    }

    const programExists = await Program.findByPk(programId)
    if (!programExists) {
      throw new AppError("Selected program not found.", 404)
    }

    application.programId = programId
    await application.save()
    return application.reload({
      // Reload to get populated program
      include: [
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
      ],
    })
  }

  public async addProgramSpecificQualifications(
    applicantUserId: string,
    qualificationsData: Array<{
      programSpecificQualificationId: string // ID of the ProgramSpecificQualification definition
      value?: string // For text input types
      fileUrl?: string // For file upload types
      institutionName?: string
      yearObtained?: number
      gradeOrScore?: string
      qualificationName: string // Added this for clarity on review page
    }>,
  ): Promise<Application> {
    const application = await this.getOrCreateApplicationByUserId(applicantUserId)
    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError("Application already submitted and cannot be modified.", 400)
    }

    // Clear existing program specific qualifications for this application if re-submitting this step
    await ApplicantProgramSpecificQualification.destroy({ where: { applicationId: application.id } })

    const newQualifications = qualificationsData.map((q) => ({
      applicationId: application.id,
      programSpecificQualificationId: q.programSpecificQualificationId,
      value: q.value,
      fileUrl: q.fileUrl,
      institutionName: q.institutionName,
      yearObtained: q.yearObtained,
      gradeOrScore: q.gradeOrScore,
      qualificationName: q.qualificationName, // Storing the name for easier display
    }))

    await ApplicantProgramSpecificQualification.bulkCreate(newQualifications)

    return application.reload({
      include: [
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
      ],
    })
  }

  public async getAllApplications(userRole: string, userId?: string): Promise<Application[]> {
    const whereClause: any = {}
    if (userRole === "ADMISSION_OFFICER" && userId) {
      const staffProfile = await Staff.findOne({ where: { userId } })
      if (!staffProfile) throw new AppError("Staff profile not found", 404)
      const officer = await AdmissionOfficer.findOne({ where: { staffId: staffProfile.id } })
      if (!officer) throw new AppError("Admission officer profile not found", 404)
      whereClause.assignedOfficerId = officer.id
    } else if (userRole === "HEAD_OF_ADMISSIONS") {
      // HOA sees all non-draft applications
      whereClause.status = { [sequelize.Op.ne]: ApplicationStatus.DRAFT }
    }
    // Super Admin sees all (no specific whereClause modification beyond base)

    return Application.findAll({
      where: whereClause,
      include: [
        { model: User, as: "applicant", attributes: ["id", "email", "role"] }, // only select needed attributes
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata", attributes: ["firstName", "lastName", "passportPhotoUrl"] },
        // Do not load all sscQualifications and programSpecificQualifications for list view to keep it light
      ],
      order: [["updatedAt", "DESC"]],
    })
  }

  public async getApplicationById(applicationId: string): Promise<Application> {
    const application = await Application.findByPk(applicationId, {
      include: [
        { model: User, as: "applicant", attributes: ["id", "email", "role", "firstName", "lastName"] },
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
        {
          model: AdmissionOfficer,
          as: "assignedOfficerDetails",
          include: [
            {
              model: Staff,
              as: "staff",
              include: [{ model: User, as: "user", attributes: ["firstName", "lastName", "email"] }],
            },
          ],
        },
      ],
    })
    if (!application) {
      throw new AppError("Application not found.", 404)
    }
    return application
  }

  public async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    comments?: string, // Can be adminComments or hoaComments based on who is acting
    actingUserId?: string, // To determine if it's admin or HOA comment
    actingUserRole?: string,
  ): Promise<Application> {
    const application = await this.getApplicationById(applicationId)
    // Add logic to check if the user has permission to change to this status
    application.status = status
    if (comments) {
      if (actingUserRole === "ADMISSION_OFFICER") application.adminComments = comments
      if (actingUserRole === "HEAD_OF_ADMISSIONS") application.hoaComments = comments
      // Could also be rejectionReason if status is REJECTED
      if (status === ApplicationStatus.REJECTED) application.rejectionReason = comments
    }
    await application.save()
    return application
  }

  public async assignApplicationToOfficer(applicationId: string, officerId: string): Promise<Application> {
    const application = await this.getApplicationById(applicationId)
    const officer = await AdmissionOfficer.findByPk(officerId)
    if (!officer) {
      throw new AppError("Admission officer not found.", 404)
    }
    application.assignedOfficerId = officerId
    // Optionally change status to UNDER_REVIEW if it was e.g. SUBMITTED
    if (application.status === ApplicationStatus.SUBMITTED) {
      application.status = ApplicationStatus.UNDER_REVIEW
    }
    await application.save()
    return application
  }

  // New method for final submission by applicant
  public async finalizeApplication(applicationId: string, applicantUserId: string): Promise<Application> {
    const application = await Application.findOne({
      where: { id: applicationId, applicantUserId },
    })

    if (!application) {
      throw new AppError("Application not found or you do not have permission to submit it.", 404)
    }

    if (application.status !== ApplicationStatus.DRAFT) {
      throw new AppError(`Application is already ${application.status.toLowerCase()} and cannot be re-submitted.`, 400)
    }

    // Validation: Ensure all required parts are filled
    // This is a crucial step. For brevity, we'll assume client-side guidance was followed.
    // In a real app, you'd check: application.biodataId, application.programId,
    // and if sscQualifications and programSpecificQualifications (if required by program) exist.
    if (!application.biodataId) {
      throw new AppError("Biodata must be completed before submission.", 400)
    }
    if (!application.programId) {
      throw new AppError("Program choice must be made before submission.", 400)
    }
    // Add more checks as needed, e.g., for SSC qualifications count or specific documents.
    const sscQuals = await ApplicantSSCQualification.count({ where: { applicationId: application.id } })
    if (sscQuals === 0) {
      throw new AppError("SSC Qualifications must be added before submission.", 400)
    }

    application.status = ApplicationStatus.SUBMITTED
    application.submittedAt = new Date() // Record submission time
    await application.save()

    // TODO: Potentially trigger notifications (e.g., email to applicant, alert to admins)

    return application.reload({
      // Reload to get all associations for the response
      include: [
        {
          model: Program,
          as: "program",
          include: [{ model: Department, as: "department", include: [{ model: Faculty, as: "faculty" }] }],
        },
        { model: Biodata, as: "biodata" },
        {
          model: ApplicantSSCQualification,
          as: "sscQualifications",
          include: [{ model: ApplicantSSCSubject, as: "subjects" }],
        },
        { model: ApplicantProgramSpecificQualification, as: "programSpecificQualifications" },
        {
          model: ApplicantDocument,
          as: "applicantDocuments",
          attributes: ["id", "documentType", "fileName", "fileUrl", "fileType", "fileSize", "uploadedAt"],
        },
      ],
    })
  }
}

export default ApplicationService
