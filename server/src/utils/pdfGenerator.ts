import PDFDocument from 'pdfkit'
import { Readable } from 'stream'

interface AdmissionLetterData {
  applicationId: string
  studentName: string
  program: string
  sessionYear: string
  dateOfAdmission: string
  reportingDate: string
  faculty: string
  department: string
}

export class PDFGenerator {
  async generateAdmissionLetter(data: AdmissionLetterData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50,
          },
        })

        const chunks: Buffer[] = []

        // Collect PDF data
        doc.on('data', chunk => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        // Header
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('ADMISSION LETTER', { align: 'center' })
          .moveDown(2)

        // Institution details (customize as needed)
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('UNIVERSITY OF EXCELLENCE', { align: 'center' })
          .fontSize(12)
          .font('Helvetica')
          .text('Office of Admissions', { align: 'center' })
          .moveDown(2)

        // Date
        doc
          .text(`Date: ${new Date(data.dateOfAdmission).toLocaleDateString()}`, { align: 'right' })
          .moveDown(1)

        // Application ID
        doc.text(`Application ID: ${data.applicationId}`).moveDown(2)

        // Salutation
        doc.text(`Dear ${data.studentName},`).moveDown(1)

        // Main content
        doc
          .fontSize(12)
          .text('CONGRATULATIONS!', { underline: true, align: 'center' })
          .moveDown(1)
          .text(
            `We are pleased to inform you that you have been offered admission into the ${data.program} program in the ${data.department}, Faculty of ${data.faculty} for the ${data.sessionYear} academic session.`,
            { align: 'justify' }
          )
          .moveDown(1)
          .text('This admission is subject to the following conditions:', { underline: true })
          .moveDown(0.5)

        // Conditions list
        const conditions = [
          'Payment of all required fees as stipulated by the institution',
          'Submission of all required documents in original copies',
          "Compliance with the institution's rules and regulations",
          'Medical fitness certification',
          'Good conduct and academic performance',
        ]

        conditions.forEach((condition, index) => {
          doc.text(`${index + 1}. ${condition}`, { indent: 20 })
        })

        doc.moveDown(1)

        // Reporting date
        doc
          .text(
            `You are required to report for registration on or before ${new Date(data.reportingDate).toLocaleDateString()}.`,
            { align: 'justify' }
          )
          .moveDown(1)

        // Important note
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('IMPORTANT:', { underline: true })
          .font('Helvetica')
          .text(
            'Failure to report within the stipulated time may result in forfeiture of this admission offer.',
            {
              align: 'justify',
            }
          )
          .moveDown(2)

        // Closing
        doc
          .text(
            'Once again, congratulations on your admission. We look forward to welcoming you to our institution.'
          )
          .moveDown(2)

        // Signature section
        doc
          .text('Yours sincerely,')
          .moveDown(3)
          .text('_________________________')
          .text('Registrar')
          .text('Office of Admissions')
          .moveDown(2)

        // Footer
        doc
          .fontSize(10)
          .fillColor('gray')
          .text('This is a computer-generated admission letter and is valid without signature.', {
            align: 'center',
          })
          .text(`Verification Code: ADM-${data.applicationId}-${Date.now()}`, { align: 'center' })
          .fillColor('black') // Reset color to black

        // Finalize PDF
        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  // Convert Buffer to Readable stream for Google Drive upload
  bufferToStream(buffer: Buffer): Readable {
    const readable = new Readable()
    readable.push(buffer)
    readable.push(null) // End the stream
    return readable
  }
}

export const pdfGenerator = new PDFGenerator()
