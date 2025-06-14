import dotenv from "dotenv"

dotenv.config() // Load environment variables from .env file

const config = {
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || "your-very-strong-default-secret-key-for-dev",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d", // e.g., '1h', '7d'
  },
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "rmcohst_db",
    dialect: process.env.DB_DIALECT || "mysql", // e.g., 'postgres', 'sqlite'
    logging: process.env.DB_LOGGING === "true", // Set to 'true' to enable SQL logging
    pool: {
      // Optional: configure connection pool
      max: Number.parseInt(process.env.DB_POOL_MAX || "5"),
      min: Number.parseInt(process.env.DB_POOL_MIN || "0"),
      acquire: Number.parseInt(process.env.DB_POOL_ACQUIRE || "30000"),
      idle: Number.parseInt(process.env.DB_POOL_IDLE || "10000"),
    },
  },
  googleDrive: {
    credentials: process.env.GOOGLE_DRIVE_CREDENTIALS || "{}", // JSON string
    biodataPassportFolderId: process.env.GOOGLE_DRIVE_BIODATA_PASSPORT_FOLDER_ID,
    sscCertificatesFolderId: process.env.GOOGLE_DRIVE_SSC_CERTIFICATES_FOLDER_ID,
    applicantDocumentsFolderId: process.env.GOOGLE_DRIVE_APPLICANT_DOCUMENTS_FOLDER_ID,
    admissionLettersFolderId: process.env.GOOGLE_DRIVE_ADMISSION_LETTERS_FOLDER_ID,
  },
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: Number.parseInt(process.env.SMTP_PORT || "587"),
    smtpSecure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM || "noreply@example.com", // Default from address
  },
  features: {
    emailVerificationRequired: process.env.FEATURE_EMAIL_VERIFICATION_REQUIRED === "true",
  },
  // Add other configurations as needed
}

export default config // Default export
