import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { AppError } from '../utils/error/AppError' // Assuming AppError exists
import type { Request } from 'express'

const tempUploadDir = path.join(__dirname, '..', '..', 'temp_uploads')
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const documentFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
  const extname = path.extname(file.originalname).toLowerCase()

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(extname)) {
    cb(null, true)
  } else {
    cb(new AppError('Invalid file type. Only PDF, JPG, PNG, DOC, DOCX are allowed.', 400) as any)
  }
}

// This is the 'multerUpload' the error message is looking for
export const multerUpload = multer({
  storage: storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
})

// The error also asks for a named export 'upload'.
// If 'multerUpload' is the primary one, you can alias it or make 'upload' the main one.
// For clarity, if 'multerUpload' is what you use internally, let's export it as 'upload' too.
export const upload = multerUpload
