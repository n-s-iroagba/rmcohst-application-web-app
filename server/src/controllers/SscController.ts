import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import logger from '../utils/logger/logger'
import ApplicantSSCQualificationService from '../services/ApplicantSSCQualificationService'
import ApplicantSSCSubjectService from '../services/ApplicantSSCSubjectService'
import { AppError } from '../utils/error/AppError'
import { uploadFilesToDrive, deleteFileFromDrive } from '../utils/driveService'
import ApplicantSSCQualification from '../models/ApplicantSSCQualification'
import ApplicantSSCSubject from '../models/ApplicantSSCSubject'

interface SubjectInput {
  id?: number
  name: string
  grade: string
  sittingIndex: number
}

class SscController {
  static async Update(req: AuthRequest, res: Response): Promise<void> {
    const { applicationId } = req.params
    const { numberOfSittings, certificateTypes, subjects: subjectsJSON } = req.body
    const files = req.files as Express.Multer.File[]

    try {
      let qualification = await ApplicantSSCQualification.findOne({
        where: { applicationId: Number(applicationId) },
      })

      // Handle file uploads to Google Drive
      const uploadedCertificates = files
        ? await uploadFilesToDrive(files, process.env.GOOGLE_DRIVE_SSC_CERTIFICATES_FOLDER_ID)
        : []

      // If qualification exists, delete old certificates before updating
      if (qualification && qualification.certificates && qualification.certificates.length > 0) {
        const deletePromises = qualification.certificates.map(fileId => deleteFileFromDrive(fileId))
        await Promise.all(deletePromises)
      }

      const qualificationData = {
        applicationId: Number(applicationId),
        numberOfSittings: Number(numberOfSittings),
        certificateTypes: Array.isArray(certificateTypes) ? certificateTypes : [certificateTypes],
        certificates: uploadedCertificates.map(f => f.id),
      }

      if (qualification) {
        await qualification.update(qualificationData)
      } else {
        qualification = await ApplicantSSCQualification.create(qualificationData)
      }

      // Handle subjects
      if (subjectsJSON) {
        const subjects: SubjectInput[] = JSON.parse(subjectsJSON)

        // Clear existing subjects for simplicity. A more complex diff could be implemented.
        await ApplicantSSCSubject.destroy({
          where: { applicantSSCQualificationId: qualification.id },
        })

        const subjectCreationPromises = subjects.map(sub =>
          ApplicantSSCSubjectService.createSubject({
            ...sub,
            applicantSSCQualificationId: qualification!.id,
          })
        )
        await Promise.all(subjectCreationPromises)
      }

      const finalQualification =
        await ApplicantSSCQualificationService.getSSCQualificationByApplication(
          Number(applicationId)
        )

      res.status(201).json({ data: finalQualification })
    } catch (error) {
      logger.error('Error creating/updating SSC qualification', { error, applicationId })
      res.status(500).json({ error: 'Failed to process SSC qualification' })
    }
  }
}

export default SscController
