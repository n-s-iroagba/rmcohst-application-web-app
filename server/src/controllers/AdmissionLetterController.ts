import type { Request, Response } from "express"
import { AdmissionLetterService } from "../services/AdmissionLetterService"
import { AppError } from "../utils/error/AppError"
import { AuthRequest } from "../middleware/auth"

export class AdmissionLetterController {
  private admissionLetterService: AdmissionLetterService

  constructor() {
    this.admissionLetterService = new AdmissionLetterService()
  }

  generateAdmissionLetter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const letterData = await this.admissionLetterService.generateLetter(applicationId, userId)

      res.status(200).json({
        success: true,
        data: letterData,
        message: "Admission letter generated successfully",
      })
    } catch (error) {
      throw new AppError("Failed to generate admission letter", 500)
    }
  }

  downloadAdmissionLetter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params
      const userId = req.user?.id

      if (!userId) {
        throw new AppError("Unauthorized", 401)
      }

      const pdfBuffer = await this.admissionLetterService.generatePDF(applicationId, userId)

      res.setHeader("Content-Type", "application/pdf")
      res.setHeader("Content-Disposition", `attachment; filename="admission-letter-${applicationId}.pdf"`)
      res.send(pdfBuffer)
    } catch (error) {
      throw new AppError("Failed to download admission letter", 500)
    }
  }

  verifyLetter = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params

      const verification = await this.admissionLetterService.verifyLetter(applicationId)

      res.status(200).json({
        success: true,
        data: verification,
        message: "Letter verification completed",
      })
    } catch (error) {
      throw new AppError("Failed to verify letter", 500)
    }
  }
}
