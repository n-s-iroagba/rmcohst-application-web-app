
import nodemailer from 'nodemailer';
import handlebars from 'nodemailer-handlebars';
import path from 'path';
import logger from './logger';

const EMAIL_TEMPLATES = {
  APPLICATION_SUBMITTED: {
    subject: 'Application Submitted Successfully - Remington College',
    template: 'application-submitted'
  },
  APPLICATION_SUBMITTED: {
    subject: 'Application Received - Remington College',
    template: 'application-submitted'
  },
  APPLICATION_UNDER_REVIEW: {
    subject: 'Application Under Review - Remington College', 
    template: 'application-under-review'
  },
  DOCUMENT_VERIFICATION: {
    subject: 'Document Verification Status - Remington College',
    template: 'document-verification'
  },
  DECISION_MADE: {
    subject: 'Application Decision - Remington College',
    template: 'decision-made'
  },
  ACCEPTANCE_FEE_RECEIVED: {
    subject: 'Acceptance Fee Payment Confirmation - Remington College',
    template: 'payment-confirmation'
  },
  ENROLLMENT_CONFIRMED: {
    subject: 'Welcome to Remington College!',
    template: 'enrollment-confirmed'
  },
  DOCUMENT_REQUEST: {
    subject: 'Additional Documents Required - Remington College',
    template: 'document-request'
  },
  EMAIL_VERIFICATION: {
    subject: 'Verify Your Email - Remington College',
    template: 'email-verification'
  }
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

    this.transporter.use('compile', handlebars({
      viewEngine: {
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, '../templates/emails')
    }));

    this.verifyConnection();
  }

  async sendEmail(to: string, templateName: keyof typeof EMAIL_TEMPLATES, data: {
    name: string;
    decision?: string;
    status?: string;
    studentId?: string;
    documents?: string[];
    verificationToken?: string;
  }) {
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
      logger.info(`Email sent successfully to ${to}`, {
        messageId: info.messageId,
        template: templateName
      });

      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendVerificationEmail(to: string, name: string, token: string) {
    try {
      const result = await this.sendEmail(to, 'EMAIL_VERIFICATION', {
        name,
        verificationToken: token
      });
      
      logger.info('Verification email sent successfully', {
        to,
        messageId: result.messageId
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email. Please try again later.');
    }
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

export const emailService = new EmailService();
