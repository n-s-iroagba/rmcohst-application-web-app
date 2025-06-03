import { generateStudentId } from '../utils/studentIdGenerator';
import { calculateTaskPriority } from '../utils/taskPriority';
import { verifyDocument } from '../utils/documentVerifier';

describe('Utility Functions', () => {
  describe('studentIdGenerator', () => {
    it('should generate valid student ID', () => {
      const studentId = generateStudentId();
      expect(studentId).toMatch(/^RMC\d{6}$/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateStudentId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('taskPriority', () => {
    it('should calculate correct priority', () => {
      const task = {
        submitDate: new Date(),
        documentCount: 3,
        type: 'URGENT'
      };
      const priority = calculateTaskPriority(task);
      expect(priority).toBeGreaterThan(0);
    });
  });

  describe('documentVerifier', () => {
    it('should verify valid WAEC certificate', async () => {
      const mockWAEC = { type: 'WAEC', fileType: 'application/pdf', size: 1024 * 1024 };
      const result = await verifyDocument(mockWAEC);
      expect(result.isValid).toBe(true);
      expect(result.metadata.documentType).toBe('WAEC');
    });

    it('should verify valid birth certificate', async () => {
      const mockBirthCert = { type: 'BIRTH_CERT', fileType: 'application/pdf', size: 512 * 1024 };
      const result = await verifyDocument(mockBirthCert);
      expect(result.isValid).toBe(true);
      expect(result.metadata.documentType).toBe('BIRTH_CERT');
    });

    it('should reject invalid file types', async () => {
      const mockInvalidDoc = { type: 'WAEC', fileType: 'text/plain', size: 1024 };
      const result = await verifyDocument(mockInvalidDoc);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid file type');
    });

    it('should reject oversized files', async () => {
      const mockLargeDoc = { type: 'WAEC', fileType: 'application/pdf', size: 10 * 1024 * 1024 };
      const result = await verifyDocument(mockLargeDoc);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size exceeds limit');
    });
  });
});
