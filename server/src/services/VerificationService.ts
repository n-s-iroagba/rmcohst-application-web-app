// services/verification.service.ts

import { UserService } from './user.service'
import { CodeHelper } from '../utils/codeHelper'
import User from '../models/User'
import logger from '../utils/logger'
import { TokenService } from './TokenService'
import { BadRequestError, ForbiddenError } from '../utils/errors'
import { AuthConfig } from '../types/auth.types'
import { EmailService } from './MailService'
import config from '../config'
export class VerificationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly config: AuthConfig
  ) {}

  async generateVerificationDetails(user: User): Promise<{ verificationToken: string,id:number }> {
    try {
      const verificationToken = this.tokenService.generateToken(
        { userId: user.id },
        this.config.tokenExpiration.verification
      )

      const verificationCode = config.nodeEnv ==='production'?CodeHelper.generateVerificationCode():'123456'
      console.log('VVVV', verificationCode)

      await this.userService.updateUserVerification(user, verificationCode, verificationToken)
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification details generated successfully', { userId: user.id })
      return { verificationToken,id:user.id }
    } catch (error) {
      logger.error('Error generating verification details', { userId: user.id, error })
      throw error
    }
  }

  async regenerateVerificationCode(id:string,token: string): Promise<string> {
    try {
      const user = await this.userService.findUserById(id)
      if (user.verificationToken !== token) throw new BadRequestError('Token does not match')
      const { verificationToken } = await this.generateVerificationDetails(user)
      await this.emailService.sendVerificationEmail(user)

      logger.info('Verification code regenerated', { userId: user.id })
      return verificationToken
    } catch (error) {
      logger.error('Error regenerating verification code', { error })
      throw error
    }
  }

  validateVerificationCode(user: User, code: string): void {
      console.log(user)
    if (user.verificationCode !== code) {
    
      logger.warn('Invalid verification code provided', { userId: user.id })
      throw new ForbiddenError('Invalid verification code', 'INVALID_VERIFICATION_CODE')
    }
    logger.info('Verification code validated successfully', { userId: user.id })
  }
}
