import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import appConfig from "../config" // Default import
import User, { type UserRole } from "../models/User" // Assuming User model and UserRole enum
import logger from "../utils/logger/logger" // Assuming logger is default export

export interface AuthenticatedRequest extends Request {
  user?: User // Or a more specific user payload type from JWT
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. No token provided." })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret) as any // Define a proper type for decoded payload

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["passwordHash"] },
    })

    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." })
    }
    // Optional: Check if email is verified if that's a requirement
    // if (!user.emailVerified && appConfig.features.emailVerificationRequired) {
    //   return res.status(403).json({ message: "Forbidden. Please verify your email address." });
    // }

    req.user = user
    logger.info(`Authenticated user: ${user.email} (ID: ${user.id})`)
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn(`Token expired for user attempt: ${token}`)
      return res.status(401).json({ message: "Unauthorized. Token expired." })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Invalid token attempt: ${token}`)
      return res.status(401).json({ message: "Unauthorized. Invalid token." })
    }
    logger.error("Authentication error:", error)
    return res.status(500).json({ message: "Internal server error during authentication." })
  }
}

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `Forbidden: User ${req.user?.email} (Role: ${req.user?.role}) tried to access resource requiring roles: ${roles.join(", ")}`,
      )
      return res.status(403).json({ message: "Forbidden. You do not have the required role." })
    }
    next()
  }
}
