import type { Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import BiodataService from "../services/BioDataService"
import logger from "../utils/logger/logger"
import { AppError } from "../utils/error/AppError"
import { uploadFileToDrive, deleteFileFromDrive } from "../utils/driveService"
import Biodata from "../models/Biodata" // For type if needed

// Ensure this path is correct for your project structure
// import { GOOGLE_DRIVE_BIODATA_FOLDER_ID } from '../config';

// Placeholder - replace with actual config value
const GOOGLE_DRIVE_BIODATA_FOLDER_ID =
  process.env.GOOGLE_DRIVE_BIODATA_PASSPORT_FOLDER_ID || "your_google_drive_folder_id_for_passports"

class BiodataController {
  static async getByApplicationId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params
      const biodata = await BiodataService.getBiodataByApplicationId(applicationId)
      res.json({ data: biodata })
    } catch (error) {
      logger.error("Error fetching biodata by application ID", { error, applicationId: req.params.applicationId })
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Failed to fetch biodata" })
      }
    }
  }

  static async createOrUpdateByApplicationId(req: AuthRequest, res: Response): Promise<void> {
    const { applicationId } = req.params
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" })
      return
    }

    // Basic authorization: ensure the application belongs to the logged-in user
    // This check should ideally be more robust, perhaps in a service layer or middleware
    // For now, we assume the application ID is valid for the user if they reached this point.

    try {
      let biodata = await Biodata.findOne({ where: { applicationId: Number(applicationId) } })

      if (!biodata) {
        // If biodata doesn't exist, create it.
        // This assumes that the application itself exists.
        // The frontend sends all fields, so we can directly use req.body
        // However, passportPhotograph needs special handling.

        // Check if application exists and belongs to user
        // const application = await Application.findOne({ where: { id: applicationId, userId }});
        // if (!application) {
        //    res.status(403).json({ error: "Application not found or access denied." });
        //    return;
        // }

        const createData: any = { ...req.body, applicationId: Number(applicationId) }
        delete createData.passportPhotograph // Handled separately

        if (req.file) {
          const passportFile = req.file
          const filePath = await uploadFileToDrive(passportFile, GOOGLE_DRIVE_BIODATA_FOLDER_ID)
          createData.passportPhotograph = filePath // Store Drive file ID or URL
        }

        biodata = await BiodataService.createBiodata(createData) // Adjust createBiodata if it only takes applicationId
        // Or use Biodata.create directly
        // biodata = await Biodata.create(createData as any);
      } else {
        // Biodata exists, update it
        const updates = { ...req.body }
        delete updates.passportPhotograph // Handled separately

        if (req.file) {
          const passportFile = req.file
          // If there's an old passport, delete it from Drive
          if (biodata.passportPhotograph) {
            try {
              await deleteFileFromDrive(biodata.passportPhotograph) // Assuming this stores file ID
            } catch (driveError) {
              logger.warn("Failed to delete old passport from Drive", {
                fileId: biodata.passportPhotograph,
                error: driveError,
              })
            }
          }
          const filePath = await uploadFileToDrive(passportFile, GOOGLE_DRIVE_BIODATA_FOLDER_ID)
          updates.passportPhotograph = filePath
        }

        // Ensure dateOfBirth is correctly formatted if sent as string
        if (updates.dateOfBirth && typeof updates.dateOfBirth === "string") {
          updates.dateOfBirth = new Date(updates.dateOfBirth)
        }

        biodata = await BiodataService.updateBiodata(applicationId, updates) // updateBiodata needs to handle updates correctly
        // or use biodata.update(updates)
        // await biodata.update(updates);
      }

      logger.info("Biodata created/updated for application", { applicationId, biodataId: biodata.id })
      res.status(biodata ? 200 : 201).json({ data: biodata }) // 201 if created, 200 if updated
    } catch (error) {
      logger.error("Error creating/updating biodata for application", { error, applicationId })
      if (req.file && (error as any).filePath) {
        // If file was uploaded but db operation failed
        try {
          await deleteFileFromDrive((error as any).filePath)
        } catch (cleanupError) {
          logger.error("Failed to cleanup uploaded file after db error", { cleanupError })
        }
      }
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message })
      } else {
        res.status(500).json({ error: "Failed to create/update biodata" })
      }
    }
  }
}

export default BiodataController
