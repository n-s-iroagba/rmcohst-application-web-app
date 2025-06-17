import type { Request, Response } from "express"
import { AdmissionLetterService } from "../services/AdmissionLetterService" // Named import
import { Application } from "../models/Application" // Named import
import { ApplicationStatus } from "../models/Application" // Enum from Application model
import logger from "../utils/logger/logger" // Default import
import type { AuthenticatedRequest } from "../middleware/auth" // Assuming this interface exists

// This is the named export the error message is looking for.
// It's common to export an object containing controller methods.
export const AdmissionLetterController = {
//   generateAdmissionLetterForApplicant: async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const { applicationId } = req.params // Assuming applicationId is in params
//       const applicantUserId = req.user?.id

//       if (!applicationId || !applicantUserId) {
//         return res.status(400).json({ message: "Application ID and user authentication are required." })
//       }

//       // Fetch application to verify ownership and get details
//       const application = await Application.findOne({
//         where: { id: applicationId, applicantUserId },
//         // include: [{ model: User, as: 'applicant' }, { model: Program, as: 'program' }] // Include necessary details
//       })

//       if (!application) {
//         return res.status(404).json({ message: "Application not found or access denied." })
//       }

//       if (application.status !== ApplicationStatus.APPROVED && application.status !== ApplicationStatus.ADMITTED) {
//         return res
//           .status(400)
//           .json({ message: "Admission letter can only be generated for approved or already admitted applications." })
//       }

//       // Placeholder for student name and program name - fetch from application.User and application.Program
//       const studentName =
//         `${req.user?.firstName || "Applicant"} ${req.user?.lastName || ""}`.trim() || "Valued Applicant"
//       const programName = application.programId || "Your Admitted Program" // Fetch actual program name

//       const letterUrl = await AdmissionLetterService.generateAndUploadLetter(applicationId, studentName, programName)

//       if (!letterUrl) {
//         return res.status(500).json({ message: "Failed to generate or upload admission letter." })
//       }

//       // Update application status to ADMITTED and store letter URL
//       application.admissionLetterUrl = letterUrl
//       application.status = ApplicationStatus.ADMITTED
//       await application.save()

//       // TODO: Send email notification to applicant

//       res.status(200).json({
//         message: "Admission letter generated successfully.",
//         admissionLetterUrl: letterUrl,
//         application,
//       })
//     } catch (error: any) {
//       logger.error("Error generating admission letter:", error)
//       res.status(500).json({ message: "Internal server error", error: error.message })
//     }
//   },

//   viewMyAdmissionLetter: async (req: AuthenticatedRequest, res: Response) => {
//     try {
//       const { applicationId } = req.params
//       const applicantUserId = req.user?.id

//       if (!applicationId || !applicantUserId) {
//         return res.status(400).json({ message: "Application ID and user authentication are required." })
//       }

//       const application = await Application.findOne({
//         where: { id: applicationId, applicantUserId, status: ApplicationStatus.ADMITTED },
//       })

//       if (!application || !application.admissionLetterUrl) {
//         return res
//           .status(404)
//           .json({ message: "Admission letter not found or not yet generated for this application." })
//       }
//       // Option 1: Redirect to the URL
//       // return res.redirect(application.admissionLetterUrl);

//       // Option 2: Send the URL in JSON response
//       res.status(200).json({ admissionLetterUrl: application.admissionLetterUrl })
//     } catch (error: any) {
//       logger.error("Error retrieving admission letter URL:", error)
//       res.status(500).json({ message: "Internal server error", error: error.message })
//     }
//   },
//   // Add other methods like getAdmissionLetterByIdForAdmin if needed
// }

// export const generateAdmissionLetter = async (req: Request, res: Response) => {
//   try {
//     const { templateId, data, studentId } = req.body

//     if (!templateId || !data || !studentId) {
//       return res.status(400).json({ message: "Missing required fields" })
//     }

//     const admissionLetterService = new AdmissionLetterService()
//     const documentId = await admissionLetterService.generateDocument(templateId, data, studentId)

//     if (!documentId) {
//       return res.status(500).json({ message: "Failed to generate admission letter" })
//     }

//     res.status(200).json({ documentId: documentId, message: "Admission letter generated successfully" })
//   } catch (error: any) {
//     console.error("Error generating admission letter:", error)
//     res.status(500).json({ message: "Internal server error", error: error.message })
//   }
// }

// export const getAdmissionLetter = async (req: Request, res: Response) => {
//   try {
//     const { documentId } = req.params

//     if (!documentId) {
//       return res.status(400).json({ message: "Missing documentId" })
//     }

//     const admissionLetterService = new AdmissionLetterService()
//     const file = await admissionLetterService.getFile(documentId)

//     if (!file) {
//       return res.status(404).json({ message: "Admission letter not found" })
//     }

//     res.setHeader("Content-Type", "application/pdf")
//     res.setHeader("Content-Disposition", `inline; filename="admission_letter_${documentId}.pdf"`)
//     res.status(200).send(file)
//   } catch (error: any) {
//     console.error("Error retrieving admission letter:", error)
//     res.status(500).json({ message: "Internal server error", error: error.message })
//   }
}
