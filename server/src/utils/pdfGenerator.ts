
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export class PDFGenerator {
  static async generateAdmissionLetter(data: {
    studentName: string;
    studentId: string;
    program: string;
    startDate: string;
    academicYear: string;
    requirements: string[];
  }): Promise<string> {
    const doc = new PDFDocument();
    const fileName = `admission-letter-${data.studentId}.pdf`;
    const filePath = path.join('uploads', 'letters', fileName);

    // Ensure directory exists
    await promisify(fs.mkdir)(path.join('uploads', 'letters'), { recursive: true });

    const stream = fs.createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
      doc.pipe(stream);

      // Header
      doc.fontSize(20)
         .text('RMCOHST Admission Letter', { align: 'center' })
         .moveDown();

      // Content
      doc.fontSize(12)
         .text(`Dear ${data.studentName},`)
         .moveDown()
         .text('Congratulations! We are pleased to inform you that you have been accepted into the Remington College of Health Sciences and Technology.')
         .moveDown()
         .text(`Program: ${data.program}`)
         .text(`Student ID: ${data.studentId}`)
         .text(`Academic Year: ${data.academicYear}`)
         .text(`Start Date: ${new Date(data.startDate).toLocaleDateString()}`)
         .moveDown();

      // Requirements
      doc.text('Required Documents:')
         .moveDown(0.5);
      data.requirements.forEach(req => {
        doc.text(`• ${req}`);
      });

      // Footer
      doc.moveDown()
         .text('Please ensure all required documents are submitted before the start date.')
         .moveDown()
         .text('Best regards,')
         .text('Office of Admissions')
         .text('Remington College of Health Sciences and Technology');

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }
}
