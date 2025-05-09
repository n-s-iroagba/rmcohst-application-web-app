
import { randomBytes } from 'crypto';

export class StudentIdGenerator {
  private static baseYear(): string {
    return new Date().getFullYear().toString().slice(-2);
  }

  private static departmentCode(department: string): string {
    const codes: Record<string, string> = {
      'Health Sciences': 'HS',
      'Medical Laboratory': 'ML',
      'Nursing': 'NR',
      'Pharmacy': 'PH'
    };
    return codes[department] || 'GN';
  }

  private static generateSequence(): string {
    return randomBytes(2).toString('hex').toUpperCase();
  }

  static generate(department: string): string {
    return `${this.baseYear()}${this.departmentCode(department)}${this.generateSequence()}`;
  }
}
