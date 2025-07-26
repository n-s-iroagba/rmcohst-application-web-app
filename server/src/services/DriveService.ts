import fs from 'fs/promises'
import path from 'path'

export interface ApplicantData {
  applicationId: string
  firstName: string
  lastName: string
  sessionName: string
  facultyName: string
  departmentName: string
  programName: string
}

export interface FileData {
  filename: string
  buffer: Buffer
  mimetype: string
}

export interface BiodataFiles {
  passportPhoto: FileData
  personalDetails: any // JSON data
}

export interface QualificationFiles {
  certificates: FileData[]
  details: any // JSON data
}

export interface ApplicationFiles {
  biodata?: BiodataFiles
  applicationReceipt?: FileData
  sscQualification?: QualificationFiles
  programSpecificQualification?: QualificationFiles
}

export class DriveService {
  private readonly baseDirectory: string

  constructor(baseDirectory: string = './storage/applications') {
    this.baseDirectory = baseDirectory
  }

  /**
   * Initialize the base directory structure
   */
  async initializeStorage(): Promise<void> {
    try {
      await fs.mkdir(this.baseDirectory, { recursive: true })
      console.log(`Storage initialized at: ${this.baseDirectory}`)
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error}`)
    }
  }

  /**
   * Generate the full directory path for an applicant
   */
  private generateApplicantPath(applicantData: ApplicantData): string {
    const {
      sessionName,
      facultyName,
      departmentName,
      programName,
      applicationId,
      firstName,
      lastName,
    } = applicantData

    // Sanitize folder names
    const sanitizedSession = this.sanitizeFolderName(sessionName)
    const sanitizedFaculty = this.sanitizeFolderName(facultyName)
    const sanitizedDepartment = this.sanitizeFolderName(departmentName)
    const sanitizedProgram = this.sanitizeFolderName(programName)
    const applicantFolder = this.sanitizeFolderName(`${applicationId}_${firstName}_${lastName}`)

    return path.join(
      this.baseDirectory,
      sanitizedSession,
      sanitizedFaculty,
      sanitizedDepartment,
      sanitizedProgram,
      applicantFolder
    )
  }

  /**
   * Sanitize folder names to remove invalid characters
   */
  private sanitizeFolderName(name: string): string {
    return name
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .trim()
  }

  /**
   * Create the complete directory structure for an applicant
   */
  async createApplicantDirectoryStructure(applicantData: ApplicantData): Promise<string> {
    const applicantPath = this.generateApplicantPath(applicantData)

    try {
      // Create main applicant directory
      await fs.mkdir(applicantPath, { recursive: true })

      // Create subdirectories
      const subdirectories = [
        'biodata',
        'application_receipt',
        'ssc_qualification',
        'program_specific_qualification',
      ]

      for (const subdir of subdirectories) {
        await fs.mkdir(path.join(applicantPath, subdir), { recursive: true })
      }

      console.log(`Directory structure created for applicant: ${applicantData.applicationId}`)
      return applicantPath
    } catch (error) {
      throw new Error(`Failed to create directory structure: ${error}`)
    }
  }

  /**
   * Save a single file to the specified directory
   */
  async saveFile(directoryPath: string, fileData: FileData): Promise<string> {
    const filePath = path.join(directoryPath, fileData.filename)

    try {
      await fs.writeFile(filePath, fileData.buffer)
      return filePath
    } catch (error) {
      throw new Error(`Failed to save file ${fileData.filename}: ${error}`)
    }
  }

  /**
   * Save JSON data to a file
   */
  async saveJsonFile(directoryPath: string, filename: string, data: any): Promise<string> {
    const filePath = path.join(directoryPath, filename)

    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
      return filePath
    } catch (error) {
      throw new Error(`Failed to save JSON file ${filename}: ${error}`)
    }
  }

  /**
   * Save multiple certificate files
   */
  async saveCertificateFiles(directoryPath: string, certificates: FileData[]): Promise<string[]> {
    const savedPaths: string[] = []

    for (const certificate of certificates) {
      const filePath = await this.saveFile(directoryPath, certificate)
      savedPaths.push(filePath)
    }

    return savedPaths
  }

  /**
   * Save all application files for an applicant
   */
  async saveApplicationFiles(
    applicantData: ApplicantData,
    applicationFiles: ApplicationFiles
  ): Promise<{ [key: string]: string | string[] }> {
    const applicantPath = await this.createApplicantDirectoryStructure(applicantData)
    const savedFiles: { [key: string]: string | string[] } = {}

    try {
      // Save biodata files
      // const biodataPath = path.join(applicantPath, 'biodata');
      // savedFiles.passportPhoto = await this.saveFile(biodataPath, applicationFiles.biodata.passportPhoto);
      // savedFiles.personalDetails = await this.saveJsonFile(biodataPath, 'personal_details.json', applicationFiles.biodata.personalDetails);

      // // Save application receipt
      // const receiptPath = path.join(applicantPath, 'application_receipt');
      // savedFiles.applicationReceipt = await this.saveFile(receiptPath, applicationFiles.applicationReceipt);

      // // Save SSC qualification files
      // const sscPath = path.join(applicantPath, 'ssc_qualification');
      // savedFiles.sscCertificates = await this.saveCertificateFiles(sscPath, applicationFiles.sscQualification.certificates);
      // savedFiles.sscDetails = await this.saveJsonFile(sscPath, 'qualification_details.json', applicationFiles.sscQualification.details);

      // // Save program-specific qualification files (if provided)
      // if (applicationFiles.programSpecificQualification) {
      //   const programPath = path.join(applicantPath, 'program_specific_qualification');
      //   savedFiles.programCertificates = await this.saveCertificateFiles(programPath, applicationFiles.programSpecificQualification.certificates);
      //   savedFiles.programDetails = await this.saveJsonFile(programPath, 'qualification_details.json', applicationFiles.programSpecificQualification.details);
      // }

      console.log(`All files saved successfully for applicant: ${applicantData.applicationId}`)
      return savedFiles
    } catch (error) {
      throw new Error(`Failed to save application files: ${error}`)
    }
  }

  /**
   * Read a file from the storage
   */
  async readFile(filePath: string): Promise<Buffer> {
    try {
      return await fs.readFile(filePath)
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error}`)
    }
  }

  /**
   * Read JSON data from a file
   */
  async readJsonFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      throw new Error(`Failed to read JSON file ${filePath}: ${error}`)
    }
  }

  /**
   * Get all files for an applicant
   */
  async getApplicantFiles(applicantData: ApplicantData): Promise<{ [key: string]: any }> {
    const applicantPath = this.generateApplicantPath(applicantData)
    const files: { [key: string]: any } = {}

    try {
      // Check if applicant directory exists
      await fs.access(applicantPath)

      // Read biodata files
      const biodataPath = path.join(applicantPath, 'biodata')
      const biodataFiles = await fs.readdir(biodataPath)

      files.biodata = {}
      for (const file of biodataFiles) {
        const filePath = path.join(biodataPath, file)
        if (file.endsWith('.json')) {
          files.biodata[file] = await this.readJsonFile(filePath)
        } else {
          files.biodata[file] = await this.readFile(filePath)
        }
      }

      // Read application receipt
      const receiptPath = path.join(applicantPath, 'application_receipt')
      const receiptFiles = await fs.readdir(receiptPath)
      files.applicationReceipt = {}
      for (const file of receiptFiles) {
        files.applicationReceipt[file] = await this.readFile(path.join(receiptPath, file))
      }

      // Read SSC qualification files
      const sscPath = path.join(applicantPath, 'ssc_qualification')
      const sscFiles = await fs.readdir(sscPath)
      files.sscQualification = {}
      for (const file of sscFiles) {
        const filePath = path.join(sscPath, file)
        if (file.endsWith('.json')) {
          files.sscQualification[file] = await this.readJsonFile(filePath)
        } else {
          files.sscQualification[file] = await this.readFile(filePath)
        }
      }

      // Read program-specific qualification files (if exists)
      const programPath = path.join(applicantPath, 'program_specific_qualification')
      try {
        await fs.access(programPath)
        const programFiles = await fs.readdir(programPath)
        if (programFiles.length > 0) {
          files.programSpecificQualification = {}
          for (const file of programFiles) {
            const filePath = path.join(programPath, file)
            if (file.endsWith('.json')) {
              files.programSpecificQualification[file] = await this.readJsonFile(filePath)
            } else {
              files.programSpecificQualification[file] = await this.readFile(filePath)
            }
          }
        }
      } catch {
        // Program-specific qualification directory doesn't exist or is empty
      }

      return files
    } catch (error) {
      throw new Error(`Failed to get applicant files: ${error}`)
    }
  }

  /**
   * Delete an applicant's entire directory
   */
  async deleteApplicantFiles(applicantData: ApplicantData): Promise<void> {
    const applicantPath = this.generateApplicantPath(applicantData)

    try {
      await fs.rm(applicantPath, { recursive: true, force: true })
      console.log(`Deleted applicant directory: ${applicantPath}`)
    } catch (error) {
      throw new Error(`Failed to delete applicant files: ${error}`)
    }
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<string[]> {
    try {
      const items = await fs.readdir(this.baseDirectory, { withFileTypes: true })
      return items.filter(item => item.isDirectory()).map(item => item.name)
    } catch (error) {
      throw new Error(`Failed to list sessions: ${error}`)
    }
  }

  /**
   * List all faculties in a session
   */
  async listFaculties(sessionName: string): Promise<string[]> {
    const sessionPath = path.join(this.baseDirectory, this.sanitizeFolderName(sessionName))

    try {
      const items = await fs.readdir(sessionPath, { withFileTypes: true })
      return items.filter(item => item.isDirectory()).map(item => item.name)
    } catch (error) {
      throw new Error(`Failed to list faculties: ${error}`)
    }
  }

  /**
   * List all departments in a faculty
   */
  async listDepartments(sessionName: string, facultyName: string): Promise<string[]> {
    const facultyPath = path.join(
      this.baseDirectory,
      this.sanitizeFolderName(sessionName),
      this.sanitizeFolderName(facultyName)
    )

    try {
      const items = await fs.readdir(facultyPath, { withFileTypes: true })
      return items.filter(item => item.isDirectory()).map(item => item.name)
    } catch (error) {
      throw new Error(`Failed to list departments: ${error}`)
    }
  }

  /**
   * List all programs in a department
   */
  async listPrograms(
    sessionName: string,
    facultyName: string,
    departmentName: string
  ): Promise<string[]> {
    const departmentPath = path.join(
      this.baseDirectory,
      this.sanitizeFolderName(sessionName),
      this.sanitizeFolderName(facultyName),
      this.sanitizeFolderName(departmentName)
    )

    try {
      const items = await fs.readdir(departmentPath, { withFileTypes: true })
      return items.filter(item => item.isDirectory()).map(item => item.name)
    } catch (error) {
      throw new Error(`Failed to list programs: ${error}`)
    }
  }

  /**
   * List all applicants in a program
   */
  async listApplicants(
    sessionName: string,
    facultyName: string,
    departmentName: string,
    programName: string
  ): Promise<string[]> {
    const programPath = path.join(
      this.baseDirectory,
      this.sanitizeFolderName(sessionName),
      this.sanitizeFolderName(facultyName),
      this.sanitizeFolderName(departmentName),
      this.sanitizeFolderName(programName)
    )

    try {
      const items = await fs.readdir(programPath, { withFileTypes: true })
      return items.filter(item => item.isDirectory()).map(item => item.name)
    } catch (error) {
      throw new Error(`Failed to list applicants: ${error}`)
    }
  }

  /**
   * Convert blob data to FileData interface
   */
  blobToFileData(blob: Buffer, filename: string, mimetype: string): FileData {
    return {
      filename,
      buffer: blob,
      mimetype,
    }
  }

  /**
   * Convert FileData to blob for database storage
   */
  fileDataToBlob(fileData: FileData): Buffer {
    return fileData.buffer
  }
}
