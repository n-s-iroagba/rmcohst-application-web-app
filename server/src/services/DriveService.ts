// GoogleDriveApplicationService.ts
import { google } from 'googleapis'
import { Readable } from 'stream'
import logger from '../utils/logger'
import ApplicationService from './ApplicationService'
import { ApplicantProgramSpecificQualification, Application, Biodata } from '../models'
import { ApplicantSSCQualification } from '../models/ApplicantSSCQualification'
import { FullApplication } from '../types/models'


interface DriveFileUpload {
  name: string
  buffer: Buffer
  mimeType: string
  parentFolderId: string
}

interface ApplicationFolderStructure {
  sessionFolderId: string
  facultyFolderId: string
  departmentFolderId: string
  programFolderId: string
  applicationFolderId: string
  biodataFolderId: string
  sscQualificationFolderId: string
  programSpecificQualificationFolderId: string
  sscCertificatesFolderId: string
  programSpecificCertificatesFolderId: string
  passportPhotographFolderId: string
}

class GoogleDriveApplicationService {
  private drive: any


  constructor() {
    // Initialize Google Drive API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account key
      scopes: ['https://www.googleapis.com/auth/drive'],
    })

    this.drive = google.drive({ version: 'v3', auth })
   
  }
  public async uploadFile(fileData: DriveFileUpload): Promise<string> {
  try {
    const fileMetadata = {
      name: fileData.name,
      parents: [fileData.parentFolderId],
    }

    const media = {
      mimeType: fileData.mimeType,
      body: Readable.from(fileData.buffer),
    }

    const file = await this.drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink',
    })

    logger.info(`Uploaded file to Google Drive: ${fileData.name}`, { 
      fileId: file.data.id,
      webViewLink: file.data.webViewLink 
    })

    return file.data.id
  } catch (error) {
    logger.error(`Error uploading file ${fileData.name}:`, error)
    throw error
  }
}

/**
 * Create or get folder by name (make public for receipt folder creation)
 */
public async createOrGetFolder(name: string, parentId?: string): Promise<string> {
  try {
    // First, try to find existing folder
    const searchQuery = parentId 
      ? `name='${name}' and parents in '${parentId}' and mimeType='application/vnd.google-apps.folder'`
      : `name='${name}' and mimeType='application/vnd.google-apps.folder'`

    const existingFolders = await this.drive.files.list({
      q: searchQuery,
      fields: 'files(id, name)',
    })

    if (existingFolders.data.files && existingFolders.data.files.length > 0) {
      return existingFolders.data.files[0].id
    }

    // Create new folder if not found
    const folderMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    }

    const folder = await this.drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    })

    logger.info(`Created Google Drive folder: ${name}`, { folderId: folder.data.id })
    return folder.data.id
  } catch (error) {
    logger.error(`Error creating/getting folder ${name}:`, error)
    throw error
  }
}

  /**
   * Create complete folder structure for an application
   */
  public async createApplicationFolderStructure(application:FullApplication): Promise<ApplicationFolderStructure> {
    try {
   

      const biodata = application.biodata
      if (!biodata) {
        throw new Error('Biodata not found for application')
      }

      // Create folder hierarchy
      const sessionName = application.academicSession?.name || 'Unknown Session'
      const facultyName = application.program?.department?.faculty?.name || 'Unknown Faculty'
      const departmentName = application.program?.department?.name || 'Unknown Department'
      const programName = application.program?.name || 'Unknown Program'
      
      // Create application folder name using biodata
      const applicationFolderName = `${biodata.firstName || 'Unknown'}_${biodata.surname || 'Unknown'}_${application.id}`

      // Create folders step by step
      const sessionFolderId = await this.createOrGetFolder(sessionName)
      const facultyFolderId = await this.createOrGetFolder(facultyName, sessionFolderId)
      const departmentFolderId = await this.createOrGetFolder(departmentName, facultyFolderId)
      const programFolderId = await this.createOrGetFolder(programName, departmentFolderId)
      const applicationFolderId = await this.createOrGetFolder(applicationFolderName, programFolderId)

      // Create subfolders within application folder
      const biodataFolderId = await this.createOrGetFolder('biodata', applicationFolderId)
      const sscQualificationFolderId = await this.createOrGetFolder('ssc_qualification', applicationFolderId)
      const programSpecificQualificationFolderId = await this.createOrGetFolder('program_specific_qualification', applicationFolderId)
      const sscCertificatesFolderId = await this.createOrGetFolder('ssc_certificates', applicationFolderId)
      const programSpecificCertificatesFolderId = await this.createOrGetFolder('program_specific_certificates', applicationFolderId)
      const passportPhotographFolderId = await this.createOrGetFolder('passport_photograph', applicationFolderId)

      const folderStructure: ApplicationFolderStructure = {
        sessionFolderId,
        facultyFolderId,
        departmentFolderId,
        programFolderId,
        applicationFolderId,
        biodataFolderId,
        sscQualificationFolderId,
        programSpecificQualificationFolderId,
        sscCertificatesFolderId,
        programSpecificCertificatesFolderId,
        passportPhotographFolderId,
      }

      logger.info('Created application folder structure', { 
        applicationId:application.id, 
        applicationFolderName,
        folderStructure 
      })

      return folderStructure
    } catch (error) {
      logger.error('Error creating application folder structure:', error)
      throw error
    }
  }



  /**
   * Generate and upload biodata document
   */
  public async uploadBiodataDocument(
    biodata: Biodata, 
    parentFolderId: string
  ): Promise<string> {
    try {
      // Generate biodata as JSON or formatted text
      const biodataContent = {
        personalInfo: {
          firstName: biodata.firstName,
          surname: biodata.surname,
          otherNames: biodata.otherNames,
          email: biodata.email,
          phoneNumber: biodata.phoneNumber,
          dateOfBirth: biodata.dateOfBirth,
          gender: biodata.gender,
          maritalStatus: biodata.maritalStatus,
          nationality: biodata.nationality,
          stateOfOrigin: biodata.stateOfOrigin,
          localGovernmentArea: biodata.localGovernmentArea,
        },
        contactInfo: {
          contactAddress: biodata.contactAddress,
          permanentHomeAddress: biodata.permanentHomeAddress,
        },
        emergencyContact: {
          nextOfKinName: biodata.nextOfKinName,
          nextOfKinPhoneNumber: biodata.nextOfKinPhoneNumber,
          nextOfKinAddress: biodata.nextOfKinAddress,
          nextOfKinRelationship: biodata.nextOfKinRelationship,
        }
      }

      const biodataJson = JSON.stringify(biodataContent, null, 2)
      const buffer = Buffer.from(biodataJson, 'utf-8')

      const fileData: DriveFileUpload = {
        name: `${biodata.firstName}_${biodata.surname}_biodata.json`,
        buffer,
        mimeType: 'application/json',
        parentFolderId,
      }

      return await this.uploadFile(fileData)
    } catch (error) {
      logger.error('Error uploading biodata document:', error)
      throw error
    }
  }

  /**
   * Upload SSC qualification document
   */
  public async uploadSSCQualificationDocument(
    sscQualification: ApplicantSSCQualification,
    parentFolderId: string
  ): Promise<string> {
    try {
      const sscContent = {
        numberOfSittings: sscQualification.numberOfSittings,
        certificateTypes: sscQualification.certificateTypes,
        subjects: [
          { subjectId: sscQualification.firstSubjectId, grade: sscQualification.firstSubjectGrade },
          { subjectId: sscQualification.secondSubjectId, grade: sscQualification.secondSubjectGrade },
          { subjectId: sscQualification.thirdSubjectId, grade: sscQualification.thirdSubjectGrade },
          { subjectId: sscQualification.fourthSubjectId, grade: sscQualification.fourthSubjectGrade },
          { subjectId: sscQualification.fifthSubjectId, grade: sscQualification.fifthSubjectGrade },
        ]
      }

      const sscJson = JSON.stringify(sscContent, null, 2)
      const buffer = Buffer.from(sscJson, 'utf-8')

      const fileData: DriveFileUpload = {
        name: `ssc_qualification_details.json`,
        buffer,
        mimeType: 'application/json',
        parentFolderId,
      }

      return await this.uploadFile(fileData)
    } catch (error) {
      logger.error('Error uploading SSC qualification document:', error)
      throw error
    }
  }

  /**
   * Upload program specific qualification document
   */
  public async uploadProgramSpecificQualificationDocument(
    programSpecificQualification: ApplicantProgramSpecificQualification,
    parentFolderId: string
  ): Promise<string> {
    try {
      const programSpecificContent = {
        qualificationType: programSpecificQualification.qualificationType,
        grade: programSpecificQualification.grade,
        isComplete: programSpecificQualification.isComplete(),
        createdAt: programSpecificQualification.createdAt,
        updatedAt: programSpecificQualification.updatedAt,
      }

      const programSpecificJson = JSON.stringify(programSpecificContent, null, 2)
      const buffer = Buffer.from(programSpecificJson, 'utf-8')

      const fileData: DriveFileUpload = {
        name: `program_specific_qualification_details.json`,
        buffer,
        mimeType: 'application/json',
        parentFolderId,
      }

      return await this.uploadFile(fileData)
    } catch (error) {
      logger.error('Error uploading program specific qualification document:', error)
      throw error
    }
  }

  /**
   * Upload certificate files
   */
  public async uploadCertificateFiles(
    certificates: any[],
    parentFolderId: string,
    filePrefix: string = 'certificate'
  ): Promise<string[]> {
    try {
      const uploadPromises = certificates.map(async (cert, index) => {
        let buffer: Buffer
        let mimeType: string
        let fileName: string

        if (Buffer.isBuffer(cert)) {
          buffer = cert
          mimeType = 'application/octet-stream'
          fileName = `${filePrefix}_${index + 1}.bin`
        } else if (cert.buffer) {
          buffer = Buffer.isBuffer(cert.buffer) ? cert.buffer : Buffer.from(cert.buffer, 'base64')
          mimeType = cert.mimeType || cert.mimetype || 'application/octet-stream'
          fileName = cert.fileName || cert.filename || `${filePrefix}_${index + 1}`
        } else {
          throw new Error(`Invalid certificate format at index ${index}`)
        }

        const fileData: DriveFileUpload = {
          name: fileName,
          buffer,
          mimeType,
          parentFolderId,
        }

        return await this.uploadFile(fileData)
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      logger.error('Error uploading certificate files:', error)
      throw error
    }
  }

  /**
   * Upload passport photograph
   */
  public async uploadPassportPhotograph(
    photographBuffer: Buffer,
    parentFolderId: string,
    applicantName: string
  ): Promise<string> {
    try {
      const fileData: DriveFileUpload = {
        name: `${applicantName}_passport_photo.jpg`,
        buffer: photographBuffer,
        mimeType: 'image/jpeg',
        parentFolderId,
      }

      return await this.uploadFile(fileData)
    } catch (error) {
      logger.error('Error uploading passport photograph:', error)
      throw error
    }
  }

  /**
   * Main method to upload complete application to Google Drive
   */
  public async uploadCompleteApplication(application: FullApplication): Promise<{
    folderStructure: ApplicationFolderStructure
    uploadedFiles: {
      biodataFileId?: string
      sscQualificationFileId?: string
      programSpecificQualificationFileId?: string
      sscCertificateFileIds?: string[]
      programSpecificCertificateFileIds?: string[]
      passportPhotographFileId?: string
    }
  }> {
    try {
      // Create folder structure
      const folderStructure = await this.createApplicationFolderStructure(application)

  

      const uploadedFiles: any = {}

      // Upload biodata
      if (application.biodata) {
        uploadedFiles.biodataFileId = await this.uploadBiodataDocument(
          application.biodata,
          folderStructure.biodataFolderId
        )
      }

      // Upload SSC qualification
      if (application.sscQualification) {
        uploadedFiles.sscQualificationFileId = await this.uploadSSCQualificationDocument(
          application.sscQualification,
          folderStructure.sscQualificationFolderId
        )

        // Upload SSC certificates
        if (application.sscQualification.certificates && application.sscQualification.certificates.length > 0) {
          uploadedFiles.sscCertificateFileIds = await this.uploadCertificateFiles(
            application.sscQualification.certificates,
            folderStructure.sscCertificatesFolderId,
            'ssc_certificate'
          )
        }
      }

      // Upload program specific qualifications
      if (application.programSpecificQualifications && application.programSpecificQualifications.length > 0) {
        const programSpecificQual = application.programSpecificQualifications[0] // Assuming single qualification
        
        uploadedFiles.programSpecificQualificationFileId = await this.uploadProgramSpecificQualificationDocument(
          programSpecificQual,
          folderStructure.programSpecificQualificationFolderId
        )

        // Upload program specific certificate
        if (programSpecificQual.certificate) {
          uploadedFiles.programSpecificCertificateFileIds = await this.uploadCertificateFiles(
            [programSpecificQual.certificate],
            folderStructure.programSpecificCertificatesFolderId,
            'program_specific_certificate'
          )
        }
      }

      // Upload passport photograph
      if (application.biodata?.passportPhotograph) {
        const applicantName = `${application.biodata.firstName}_${application.biodata.surname}`
        uploadedFiles.passportPhotographFileId = await this.uploadPassportPhotograph(
          application.biodata.passportPhotograph,
          folderStructure.passportPhotographFolderId,
          applicantName
        )
      }

      logger.info('Successfully uploaded complete application to Google Drive', {
        applicationId:application.id,
        folderStructure,
        uploadedFiles
      })

      return {
        folderStructure,
        uploadedFiles
      }

    } catch (error) {
      logger.error('Error uploading complete application to Google Drive:', error)
      throw error
    }
  }

  /**
   * Get folder URL for sharing
   */
  public async getFolderShareableLink(folderId: string): Promise<string> {
    try {
      // Make folder accessible with link
      await this.drive.permissions.create({
        fileId: folderId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })

      // Get folder details
      const folder = await this.drive.files.get({
        fileId: folderId,
        fields: 'webViewLink',
      })

      return folder.data.webViewLink
    } catch (error) {
      logger.error('Error creating shareable link:', error)
      throw error
    }
  }

  /**
   * Method to be called when application is finalized
   */
  public async processApplicationSubmission(application: FullApplication): Promise<void> {
    try {
      logger.info('Processing application submission for Google Drive upload', { applicationId:application.id })

      const result = await this.uploadCompleteApplication(application)
      

      await application.update({
        driveApplicationFolderId: result.folderStructure.applicationFolderId,
        driveUploadComplete: true,
        driveUploadedAt: new Date()
      })

      logger.info('Application successfully uploaded to Google Drive', {
        applicationId:application.id,
        applicationFolderId: result.folderStructure.applicationFolderId
      })

    } catch (error) {
      logger.error('Error processing application submission for Google Drive:', error)
      throw error
    }
  }
}

export default GoogleDriveApplicationService

