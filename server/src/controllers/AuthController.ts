import type { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User"
import { config } from "../config"
import type { AuthRequest } from "../middleware/auth"
import logger from "../utils/logger/logger"
import { AppError } from "../utils/error/AppError"

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        res.status(400).json({ error: { message: "User already exists" } })
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: "APPLICANT",
        emailVerified: true, // For now, auto-verify
      })

      // Generate token
      const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: "7d" })

      logger.info("User registered successfully", { userId: user.id, email })

      res.status(201).json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token,
        },
      })
    } catch (error) {
      logger.error("Registration error:", error)
      res.status(500).json({ error: { message: "Registration failed" } })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ where: { email } })
      if (!user) {
         throw new AppError('user not found',404)
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
         res.status(401).json({ error: { message: "Invalid credentials" } })
      }

      // Generate token
      const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: "7d" })

      logger.info("User logged in successfully", { userId: user.id, email })

      res.json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token,
        },
      })
    } catch (error) {
      logger.error("Login error:", error)
      res.status(500).json({ error: { message: "Login failed" } })
    }
  }

  static async validateToken(req: AuthRequest, res: Response) {
    try {
      const user = await User.findByPk(req.user!.id, {
        attributes: ["id", "email", "firstName", "lastName", "role", "emailVerified", "createdAt", "updatedAt"],
      })

      if (!user) {
         res.status(401).json({ error: { message: "User not found" } })
      }

      res.json({
        data: user,
      })
    } catch (error) {
      logger.error("Token validation error:", error)
      res.status(401).json({ error: { message: "Token validation failed" } })
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      // In a real app, you might want to blacklist the token
      logger.info("User logged out", { userId: req.user!.id })
      res.json({ message: "Logged out successfully" })
    } catch (error) {
      logger.error("Logout error:", error)
      res.status(500).json({ error: { message: "Logout failed" } })
    }
  }
}

export default AuthController
