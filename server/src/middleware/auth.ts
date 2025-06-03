import type { Request, Response, NextFunction, RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config"
import User from "../models/User"
import logger from "../utils/logger/logger"

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest
    const token = authReq.header("Authorization")?.replace("Bearer ", "")
    
    if (!token) {
      res.status(401).json({ error: "Authentication required" })
      return // Just return, don't return the response object
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { email: string }

    const user = await User.findOne({
      where: { email: decoded.email },
      attributes: ["id", "email", "role", "emailVerified"],
    })

    if (!user) {
      res.status(401).json({ error: "User not found" })
      return // Just return, don't return the response object
    }

    if (!user.emailVerified) {
      res.status(401).json({ error: "Email not verified" })
      return // Just return, don't return the response object
    }

    authReq.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    logger.info("Authenticated request", { userId: user.id, email: user.email })
    next()
  } catch (error) {
    logger.error("Authentication error:", error)
    res.status(401).json({ error: "Authentication failed" })
    return // Just return, don't return the response object
  }
}

// Role-based middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" })
      return // Just return, don't return the response object
    }
    next()
  }
}