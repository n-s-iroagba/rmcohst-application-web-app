// server/src/utils/auth.ts
import jwt from 'jsonwebtoken'
import appConfig from '../config' // Default import

export const generateToken = (userId: string, email: string, role: string): string => {
  const payload = { id: userId, email, role }
  return jwt.sign(payload, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiresIn })
}

// Add other auth-related utility functions if needed
