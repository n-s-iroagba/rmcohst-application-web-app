import multer from 'multer'
import path from 'path'
import fs from 'fs'
import type { Request } from 'express'
import { AppError } from '../utils/errors'

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
    cb(new AppError(`Invalid file type: ${file.originalname}`, 'bad file', 400))
  }
}

export const upload = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
})
