import nodemailer from 'nodemailer';
import path from 'path';
import logger from './logger/logger';

const EMAIL_TEMPLATES = {
  APPLICATION_SUBMITTED: { subject: 'Application Submitted Successfully - Remington College', template: 'application-submitted' },
  APPLICATION_UNDER_REVIEW: { subject: 'Application Under Review - Remington College', template: 'application-under-review' },
  DOCUMENT_VERIFICATION: { subject: 'Document Verification Status - Remington College', template: 'document-verification' },
  DECISION_MADE: { subject: 'Application Decision - Remington College', template: 'decision-made' },
  ACCEPTANCE_FEE_RECEIVED: { subject: 'Acceptance Fee Payment Confirmation - Remington College', template: 'payment-confirmation' },
  ENROLLMENT_CONFIRMED: { subject: 'Welcome to Remington College!', template: 'enrollment-confirmed' },
  DOCUMENT_REQUEST: { subject: 'Additional Documents Required - Remington College', template: 'document-request' },
  EMAIL_VERIFICATION: { subject: 'Verify Your Email - Remington College', template: 'email-verification' },
  RESET_PASSWORD: { subject: 'Reset Password - Remington College', template: 'reset-password' }
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async init() {
    const handlebars = (await import('nodemailer-express-handlebars')).default;

    this.transporter.use('compile', handlebars({
      viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve(__dirname, '../templates/emails'),
        layoutsDir: path.resolve(__dirname, '../templates/emails/layouts'),
        defaultLayout: 'main'
      },
      viewPath: path.resolve(__dirname, '../templates/emails'),
      extName: '.hbs'
    }));

    await this.verifyConnection();
  }

  async sendEmail(to: string, templateName: keyof typeof EMAIL_TEMPLATES, data: any) {
    try {
      const template = EMAIL_TEMPLATES[templateName];

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject: template.subject,
        template: template.template,
        context: {
          ...data,
          year: new Date().getFullYear(),
          collegeUrl: process.env.CLIENT_URL
        }
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}`, { messageId: info.messageId, template: templateName });
      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    return this.sendEmail(to, 'EMAIL_VERIFICATION', { name, verificationToken: token });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    return this.sendEmail(to, 'RESET_PASSWORD', { verificationToken: token });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      return false;
    }
  }
}

const emailService = new EmailService();
export default emailService;
