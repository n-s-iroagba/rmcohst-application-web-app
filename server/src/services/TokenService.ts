import jwt, { SignOptions } from 'jsonwebtoken'
import { JwtPayload } from '../types/auth.types'
import logger from '../utils/logger'

export class TokenService {
  constructor(private readonly secret: string) {
    if (!secret) {
      logger.error('JWT secret is required for TokenService initialization')
      throw new Error('JWT secret is required')
    }
    logger.info('TokenService initialized successfully')
  }

  generateToken(payload: JwtPayload, expiresIn: SignOptions['expiresIn']): string {
    try {
      const token = jwt.sign(payload, this.secret, { expiresIn } as SignOptions)
      logger.info('Token generated successfully', {
        userId: payload.userId || payload.adminId,
        tokenType: payload.userId ? 'user' : 'admin',
      })
      return token
    } catch (error) {
      logger.error('Token generation failed', { error, payload })
      throw new Error('Token generation failed')
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload
      logger.info('Token verified successfully', { userId: decoded.userId || decoded.adminId })
      return decoded
    } catch (error) {
      logger.warn('Token verification failed', { error })
      throw new Error('Invalid or expired token')
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload
    } catch (error) {
      logger.warn('Token decoding failed', { error })
      return null
    }
  }
}
