
import nodemailer from 'nodemailer';
import logger from './logger';

const EMAIL_TEMPLATES = {
  APPLICATION_SUBMITTED: {
    subject: 'Application Received - Remington College',
    text: (name: string) => `Dear ${name},\n\nYour application has been successfully submitted to Remington College. Our admissions team will review it shortly.\n\nBest regards,\nRemington College Admissions`
  },
  APPLICATION_UNDER_REVIEW: {
    subject: 'Application Under Review - Remington College',
    text: (name: string) => `Dear ${name},\n\nYour application is now being reviewed by our admissions team. We'll notify you of any updates or required documents.\n\nBest regards,\nRemington College Admissions`
  },
  DOCUMENT_VERIFICATION: {
    subject: 'Document Verification Status - Remington College',
    text: (name: string, status: string) => `Dear ${name},\n\nYour submitted documents have been ${status}. ${status === 'verified' ? 'Your application will now proceed to the next stage.' : 'Please login to your dashboard to address any issues.'}\n\nBest regards,\nRemington College Admissions`
  },
  DECISION_MADE: {
    subject: 'Application Decision - Remington College',
    text: (name: string, decision: string) => `Dear ${name},\n\nA decision has been made on your application. Please log in to your dashboard to view the details. ${decision === 'accepted' ? 'If accepted, you will find instructions for paying your acceptance fee.' : ''}\n\nBest regards,\nRemington College Admissions`
  },
  ACCEPTANCE_FEE_RECEIVED: {
    subject: 'Acceptance Fee Payment Confirmation - Remington College',
    text: (name: string) => `Dear ${name},\n\nWe have received your acceptance fee payment. You can now proceed with student profile activation.\n\nBest regards,\nRemington College Admissions`
  },
  ENROLLMENT_CONFIRMED: {
    subject: 'Welcome to Remington College!',
    text: (name: string, studentId: string) => `Dear ${name},\n\nCongratulations! Your enrollment is now complete. Your student ID is: ${studentId}\n\nPlease keep this ID for future reference.\n\nWelcome to Remington College!\n\nBest regards,\nRemington College Admissions`
  },
  DOCUMENT_REQUEST: {
    subject: 'Additional Documents Required - Remington College',
    text: (name: string, documents: string[]) => `Dear ${name},\n\nPlease submit the following documents to complete your application:\n\n${documents.join('\n')}\n\nBest regards,\nRemington College Admissions`
  }
};

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to: string, templateName: keyof typeof EMAIL_TEMPLATES, data: { 
    name: string; 
    decision?: string;
    status?: string;
    studentId?: string;
    documents?: string[];
  }) {
    try {
      const template = EMAIL_TEMPLATES[templateName];
      let text: string;

      switch (templateName) {
        case 'DECISION_MADE':
          text = template.text(data.name, data.decision || '');
          break;
        case 'DOCUMENT_VERIFICATION':
          text = template.text(data.name, data.status || '');
          break;
        case 'ENROLLMENT_CONFIRMED':
          text = template.text(data.name, data.studentId || '');
          break;
        case 'DOCUMENT_REQUEST':
          text = template.text(data.name, data.documents || []);
          break;
        default:
          text = template.text(data.name);
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: template.subject,
        text
      });

      logger.info(`Email sent successfully to ${to} using template ${templateName}`);
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
