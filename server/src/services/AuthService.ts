import { EmailService } from "./MailService";
import { PasswordService } from "./PasswordService";
import { TokenService } from "./TokenService";
import { UserService } from "./user.service";
import { VerificationService } from "./VerificationService";
import {
  AuthConfig,
  LoginAuthServiceReturn,
  LoginRequestDto,
  ResetPasswordRequestDto,
  SignUpRequestDto,
  SignUpResponseDto,
  VerifyEmailRequestDto,
} from "../types/auth.types";
import logger from "../utils/logger";
import { BadRequestError, NotFoundError } from "../utils/errors";
import User, { AuthUser } from "../models/User";


export class AuthService {
  private tokenService: TokenService;
  private passwordService: PasswordService;
  private userService: UserService;
  private emailService: EmailService;
  private verificationService: VerificationService;

  constructor(private readonly config: AuthConfig) {
    this.tokenService = new TokenService(config.jwtSecret);
    this.passwordService = new PasswordService();
    this.userService = new UserService();
    this.emailService = new EmailService(config.clientUrl);
    this.verificationService = new VerificationService(
      this.tokenService,
      this.userService,
      this.emailService,
      config
    );

    logger.info("AuthService initialized successfully");
  }

  /**
   * Registers a new user and initiates email verification.
   * @param data - User sign-up data.
   * @param roles - Optional array of user roles.
   * @returns Sign-up response with verification token.
   */
  async signUp(data: SignUpRequestDto): Promise<{result:SignUpResponseDto, user:User}> {
    try {
      logger.info("Sign up process started", { email: data.email });

      const hashedPassword = await this.passwordService.hashPassword(data.password);
      const user = await this.userService.createUser({
        ...data,
        password: hashedPassword,
      });

      const result = await this.verificationService.generateVerificationDetails(user);

      logger.info("Sign up completed successfully", { userId: user.id });
      return {result,user};
    } catch (error) {
      return this.handleAuthError("Sign up", { email: data.email }, error);
    }
  }

  /**
   * Logs a user in by validating credentials and returning tokens.
   * @param data - Login DTO containing email and password.
   * @returns LoginAuthServiceReturn or SignUpResponseDto for unverified users.
   */
  async login(data: LoginRequestDto): Promise<LoginAuthServiceReturn | SignUpResponseDto|void> {
    try {
      logger.info("Login attempt started", { email: data.email });

      const user = await this.userService.findUserByEmail(data.email,true);
      await this.validatePassword(user, data.password);
      if(!user){
        return
      }
      if (!user.isEmailVerified) {
        logger.warn("Login attempted by unverified user", { userId: user.id });
        const { verificationToken } = await this.verificationService.generateVerificationDetails(user);
        return { id:user.id,verificationToken };
      }

      const { accessToken, refreshToken } = this.generateTokenPair(user.id);
      logger.info("Login successful", { userId: user?.id });

      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken);
    } catch (error) {
      return this.handleAuthError("Login", { email: data.email }, error);
    }
  }

  /**
   * Issues a new access token from a refresh token.
   * @param refreshToken - JWT refresh token.
   * @returns Object containing a new access token.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      logger.info("Token refresh attempted");

      const payload = this.tokenService.verifyToken(refreshToken);
      if (!payload.adminId) {
        logger.warn("Invalid refresh token provided");
        throw new BadRequestError("Invalid refresh token");
      }

      const user = await this.userService.findUserById(payload.adminId);
      const newAccessToken = this.tokenService.generateToken(
        { adminId: user.id },
        this.config.tokenExpiration.login
      );

      logger.info("Token refreshed successfully", { userId: user.id });
      return { accessToken: newAccessToken };
    } catch (error) {
      return this.handleAuthError("Token refresh", {}, error);
    }
  }

  /**
   * Verifies a user's email using a token and code.
   * @param data - DTO containing token and verification code.
   * @returns Auth tokens for the verified user.
   */
  async verifyEmail(data: VerifyEmailRequestDto): Promise<LoginAuthServiceReturn> {
    try {
      logger.info("Email verification started");

      const { userId } = this.tokenService.verifyToken(data.token);
      if (!userId) {
        logger.warn("Invalid verification token provided");
        throw new BadRequestError("Unsuitable token");
      }

      const user = await this.userService.findUserById(userId);
      this.verificationService.validateVerificationCode(user, data.code);
      await this.userService.markUserAsVerified(user);

      const { accessToken, refreshToken } = this.generateTokenPair(user.id);
      logger.info("Email verification successful", { userId: user.id });

      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken);
    } catch (error) {
      return this.handleAuthError("Email verification", {}, error);
    }
  }

  /**
   * Generates a new email verification code.
   * @param token - JWT token associated with the verification.
   * @returns A new verification code string.
   */ 
  async generateNewCode(id:string,token: string): Promise<string> {
    try {
      logger.info("New verification code generation requested");
      return await this.verificationService.regenerateVerificationCode(id,token);
    } catch (error) {
      return this.handleAuthError("New code generation", {}, error);
    }
  }

  /**
   * Sends a password reset email to the user.
   * @param email - User's email address.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      logger.info("Password reset requested", { email });

      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        logger.error("Password reset requested for non-existent email", { email });
        throw new NotFoundError("user for forgot password not found");
      }

      const { token, hashedToken } = this.passwordService.generateResetToken();
      await this.userService.setPasswordResetDetails(user, hashedToken);
      await this.emailService.sendPasswordResetEmail(user.email, token);

      logger.info("Password reset email sent", { userId: user.id });
    } catch (error) {
      return this.handleAuthError("Password reset", { email }, error);
    }
  }

  /**
   * Resets the user's password using the reset token.
   * @param data - DTO with new password and reset token.
   * @returns New auth tokens.
   */
  async resetPassword(data: ResetPasswordRequestDto): Promise<LoginAuthServiceReturn> {
    try {
      logger.info("Password reset process started");

      const user = await this.userService.findUserByResetToken(data.token);
      const hashedPassword = await this.passwordService.hashPassword(data.password);
      await this.userService.updateUserPassword(user, hashedPassword);

      const { accessToken, refreshToken } = this.generateTokenPair(user.id);
      logger.info("Password reset successful", { userId: user.id });

      return this.saveRefreshTokenAndReturn(user, accessToken, refreshToken);
    } catch (error) {
      return this.handleAuthError("Password reset", {}, error);
    }
  }

  /**
   * Retrieves a user by ID.
   * @param userId - ID of the user.
   * @returns User object.
   */
  async getUserById(userId: string) {
    try {
      logger.info("Get user by ID requested", { userId });

      const user = await this.userService.findUserById(userId);
      logger.info("User retrieved successfully", { userId: user.id });

      return user;
    } catch (error) {
      return this.handleAuthError("Get user by ID", { userId }, error);
    }
  }

  /**
   * Returns the current authenticated user's details.
   * @param userId - Authenticated user's ID.
   * @returns User object.
   */
  async getMe(userId: number):Promise<AuthUser> {
    try {
      logger.info("Get current user requested", { userId });

      const user = await this.userService.findUserById(userId);
      logger.info("Current user retrieved successfully", { userId });

      return user as unknown as AuthUser;
    } catch (error) {
      return this.handleAuthError("Get current user", { userId }, error);
    }
  }

  /**
   * Compares the given password with the user's stored password.
   * @param user - User instance.
   * @param password - Plain text password to validate.
   */
  private async validatePassword(user: any, password: string): Promise<void> {
    const isMatch = await this.passwordService.comparePasswords(password, user.password);
    if (!isMatch) {
      logger.warn("Password validation failed", { userId: user.id });
      throw new BadRequestError("Invalid credentials", "INVALID_CREDENTIALS");
    }
    logger.info("Password validated successfully", { userId: user.id });
  }

  /**
   * Generates a new access/refresh token pair.
   * @param userId - ID of the user.
   * @returns Object containing access and refresh tokens.
   */
  private generateTokenPair(userId: number): { accessToken: string; refreshToken: string } {
    const accessToken = this.tokenService.generateToken(
      { adminId: userId },
      this.config.tokenExpiration.login
    );

    const refreshToken = this.tokenService.generateToken(
      { adminId: userId },
      this.config.tokenExpiration.refresh
    );

    return { accessToken, refreshToken };
  }

  /**
   * Saves the refresh token on the user and returns the full auth response.
   * @param user - User instance.
   * @param accessToken - JWT access token.
   * @param refreshToken - JWT refresh token.
   * @returns Full login/auth return object.
   */
  private async saveRefreshTokenAndReturn(user: any, accessToken: string, refreshToken: string): Promise<LoginAuthServiceReturn> {
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, user, refreshToken };
  }

  /**
   * Unified error handler for all auth-related operations.
   * @param operation - Operation name for logging.
   * @param context - Additional context info.
   * @param error - Error caught during operation.
   * @throws Error - Re-throws the original error.
   */
  private async handleAuthError(operation: string, context: Record<string, any>, error: any): Promise<never> {
    logger.error(`${operation} failed`, { ...context, error });
    throw error;
  }
}


// factory/auth.factory.ts
export function createAuthService(): AuthService {
  const config: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET || 'udorakpuenyi',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    tokenExpiration: {
      verification: 86400,
      login: 3600,
      refresh: 86400 * 7,
    },
  };

  logger.info('AuthService factory creating new instance');
  return new AuthService(config);
}
