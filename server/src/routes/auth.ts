import { Router } from "express"
import AuthController from "../controllers/AuthController"

import { authMiddleware } from "../middleware/auth"
import { body } from "express-validator"

const router = Router()

//Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],

  AuthController.register,
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  AuthController.login,
)

// Validate token
router.get("/validate", authMiddleware, AuthController.validateToken)

// Logout
router.post("/logout", authMiddleware, AuthController.logout)

export default router
