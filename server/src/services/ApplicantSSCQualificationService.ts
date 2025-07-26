// import ApplicantSSCQualification from '../models/ApplicantSSCQualification'
// import { AppError } from '../utils/error/AppError'
// import logger from '../utils/logger/logger'
// import { ApplicantSubjectAndGradeDto } from '../dtos/request/ApplicantSubjectAndGrade'
// import { Application } from '../models/Application'
// import Program from '../models/Program'
// import ApplicantSSCSubjectAndGrade from '../models/ApplicantSSCSubjectAndGrade'
// import Grade from '../models/Grade'

// class ApplicantSSCQualificationService {
//   public static async create(applicationId: number): Promise<ApplicantSSCQualification> {
//     try {
//       const qualification = await ApplicantSSCQualification.create({ applicationId })
//       logger.info(`SSC Qualification created with ID ${qualification.id}`)
//       return qualification
//     } catch (error: any) {
//       logger.error(`Failed to create SSC Qualification: ${error.message}`)
//       throw new AppError('Failed to create SSC Qualification', 500)
//     }
//   }

//   /**
//    *
//    * Update SSC Qualification by ID
//    */
//   public static async update(
//     id: number,
//     updates: Partial<{
//       certificateTypes: string[]
//       certificates: Buffer[]
//       numberOfSittings: number
//       minimumGrade: string
//       subjectsAndGrades: ApplicantSubjectAndGradeDto[]
//     }>
//   ): Promise<ApplicantSSCQualification> {
//     const qualification = await ApplicantSSCQualification.findByPk(id)
//     if (!qualification) {
//       throw new AppError(`SSC Qualification with ID ${id} not found`, 404)
//     }

//     const application = await Application.findByPk(qualification.applicationId)
//     if (!application) {
//       throw new AppError(`Application for SSC Qualification ID ${id} not found`, 404)
//     }

//     const program = await Program.findByPk(application.programId)
//     if (!program) {
//       throw new AppError(`Program for Application ID ${application.id} not found`, 404)
//     }

//     const programSSCRequirements = await program.getSSCQualification()
//     const programSubjectsAndGrades = await programSSCRequirements.getSSCSubjectMinimumGrades() // Presumably for validation (currently unused)

//     const existingSubjectsAndGrades = await qualification.getApplicantSubjectAndGrades()

//     if (updates.subjectsAndGrades && Array.isArray(updates.subjectsAndGrades)) {
//       for (const updateEntry of updates.subjectsAndGrades) {
//         const programRequirement = programSubjectsAndGrades.find(
//           req => req.subjectId === updateEntry.subjectId
//         )

//         if (!programRequirement) {
//           throw new AppError(
//             `Subject with ID ${updateEntry.subjectId} is not part of the program requirements.`,
//             400
//           )
//         }

//         const requiredGrade = await Grade.findByPk(programRequirement.gradeId)
//         const applicantGrade = await Grade.findByPk(updateEntry.gradeId)

//         if (!requiredGrade || !applicantGrade) {
//           throw new AppError(`Invalid grade ID provided.`, 400)
//         }

//         // Check if applicant's grade is equal or better (lower gradePoint is better)
//         if (applicantGrade.gradePoint > requiredGrade.gradePoint) {
//           throw new AppError(
//             `Grade for subject ID ${updateEntry.subjectId} does not meet minimum requirement.`,
//             400
//           )
//         }

//         const existingEntry = existingSubjectsAndGrades.find(
//           entry => entry.subjectId === updateEntry.subjectId
//         )

//         if (existingEntry) {
//           await existingEntry.update({ gradeId: updateEntry.gradeId })
//         } else {
//           await ApplicantSSCSubjectAndGrade.create({
//             subjectId: updateEntry.subjectId,
//             gradeId: updateEntry.gradeId,
//             applicantSSCQualificationId: qualification.id,
//           })
//         }
//       }
//     }

//     // Update remaining fields on qualification (excluding subjectsAndGrades)
//     const { subjectsAndGrades, ...otherUpdates } = updates
//     await qualification.update(otherUpdates)

//     logger.info(`SSC Qualification with ID ${id} updated`)
//     return qualification
//   }
// }

// export default ApplicantSSCQualificationService
