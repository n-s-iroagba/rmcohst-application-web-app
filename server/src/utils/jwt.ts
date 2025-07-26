import jwt from 'jsonwebtoken'
import User from '../models/User'

// JWT payload interface
export interface JwtPayload {
  id: number
  email: string
  role: string
  iat?: number
  exp?: number
}

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'

/**
 * Generate access token
 */
export const generateToken = (
  user: Pick<User, 'id' | 'email' | 'role'>,
  type: 'login' | 'resetPassword' | 'verifyEmail'
): string => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'content-syndication-platform',
    audience: 'content-syndication-users',
  } as jwt.SignOptions)
}

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
    issuer: 'content-syndication-platform',
    audience: 'content-syndication-users',
  } as jwt.SignOptions)
}

/**
 * Verify access token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'content-syndication-platform',
      audience: 'content-syndication-users',
    } as jwt.VerifyOptions) as JwtPayload

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    } else {
      throw new Error('Token verification failed')
    }
  }
}

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): { userId: number; type: string } => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'content-syndication-platform',
      audience: 'content-syndication-users',
    } as jwt.VerifyOptions) as { userId: number; type: string }

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token type')
    }

    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired')
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token')
    } else {
      throw new Error('Refresh token verification failed')
    }
  }
}

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }

  return parts[1]
}

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as JwtPayload
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000)
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const expiration = getTokenExpiration(token)
  if (!expiration) {
    return true
  }
  return new Date() >= expiration
}
