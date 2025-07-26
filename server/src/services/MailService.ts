import nodemailer, { Transporter } from 'nodemailer'
import { User } from '../models'
import logger from '../utils/logger'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter: Transporter
  private config: EmailConfig

  constructor(private readonly clientUrl: string) {
    this.config = this.getEmailConfig()
    this.transporter = this.createTransporter()
  }

  private getEmailConfig(): EmailConfig {
    return {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'wealthfundingtradestation@gmail.com',
        pass: process.env.SMTP_PASS || 'anft vmyj ianz sftx', // App password for Gmail
      },
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@yourapp.com',
    }
  }

  private createTransporter(): Transporter {
    const transporter = nodemailer.createTransport(this.config)

    // Verify connection configuration
    transporter.verify(error => {
      if (error) {
        logger.error('SMTP connection failed', { error: error.message })
      } else {
        logger.info('SMTP server is ready to take messages')
      }
    })

    return transporter
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.config.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      }

      const info = await this.transporter.sendMail(mailOptions)
      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      })
    } catch (error: any) {
      logger.error('Failed to send email', {
        to: options.to,
        subject: options.subject,
        error: error.message,
      })
      throw new Error(`Failed to send email: ${error.message}`)
    }
  }

  private createVerificationEmailTemplate(user: User, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .button { 
              display: inline-block; 
              background-color: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome ${user.username}!</h2>
            </div>
            <h5>This is your verification code : ${user.verificationCode}
            
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
            
            <p>This verification link will expire in 24 hours.</p>
            
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  private createPasswordResetEmailTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .button { 
              display: inline-block; 
              background-color: #dc3545; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Password Reset Request</h2>
            </div>
            
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul>
                <li>This link will expire in 1 hour</li>
                <li>This link can only be used once</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
              <p>For security reasons, this link will expire automatically.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  async sendVerificationEmail(user: User): Promise<void> {
    try {
      const verificationUrl = `${this.clientUrl}/verify-email?token=${user.verificationToken}`
      const html = this.createVerificationEmailTemplate(user, verificationUrl)

      await this.sendEmail({
        to: user.email,
        subject: 'Verify Your Email Address',
        html,
      })

      logger.info('Verification email sent successfully', {
        userId: user.id,
        email: user.email,
      })
    } catch (error: any) {
      logger.error('Failed to send verification email', {
        userId: user.id,
        email: user.email,
        error: error.message,
      })
      throw new Error('Failed to send verification email')
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${this.clientUrl}/reset-password?token=${token}`
      const html = this.createPasswordResetEmailTemplate(resetUrl)

      await this.sendEmail({
        to: email,
        subject: 'Password Reset Request',
        html,
      })

      logger.info('Password reset email sent successfully', { email })
    } catch (error: any) {
      logger.error('Failed to send password reset email', {
        email,
        error: error.message,
      })
      throw new Error('Failed to send password reset email')
    }
  }

  // Generic method for custom emails
  async sendCustomEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
    try {
      await this.sendEmail({ to, subject, html, text })
      logger.info('Custom email sent successfully', { to, subject })
    } catch (error: any) {
      logger.error('Failed to send custom email', {
        to,
        subject,
        error: error.message,
      })
      throw new Error('Failed to send custom email')
    }
  }

  // Method to test email configuration
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      logger.info('Email service connection test passed')
      return true
    } catch (error: any) {
      logger.error('Email service connection test failed', { error: error.message })
      return false
    }
  }
}

// Environment variables you need to set:
/*
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourapp.com (optional, defaults to SMTP_USER)
CLIENT_URL=http://localhost:3000
*/
