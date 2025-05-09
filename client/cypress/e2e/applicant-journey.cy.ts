
import { faker } from '@faker-js/faker';

describe('Applicant Journey', () => {
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1990-01-01',
    phone: faker.phone.number('##########')
  };

  describe('Stage 1: Account Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('should complete registration process', () => {
      cy.get('[data-testid="firstname-input"]').type(testUser.firstName);
      cy.get('[data-testid="lastname-input"]').type(testUser.lastName);
      cy.get('[data-testid="email-input"]').type(testUser.email);
      cy.get('[data-testid="password-input"]').type(testUser.password);
      cy.get('[data-testid="confirm-password-input"]').type(testUser.password);
      cy.get('[data-testid="register-submit"]').click();
      
      cy.url().should('include', '/email-verification');
      cy.get('[data-testid="verification-message"]').should('be.visible');
    });
  });

  describe('Stage 2: Application Fee Payment', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.visit('/application/payment');
    });

    it('should process application fee payment', () => {
      cy.get('[data-testid="payment-amount"]').should('contain', '5000');
      cy.get('[data-testid="card-number"]').type('4242424242424242');
      cy.get('[data-testid="card-expiry"]').type('1225');
      cy.get('[data-testid="card-cvc"]').type('123');
      cy.get('[data-testid="pay-button"]').click();
      
      cy.get('[data-testid="payment-success"]').should('be.visible');
      cy.get('[data-testid="payment-receipt"]').should('exist');
    });
  });

  describe('Stage 3: Document Upload', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.visit('/application/documents');
    });

    it('should upload required documents', () => {
      cy.fixture('test-waec.pdf').then(fileContent => {
        cy.get('[data-testid="waec-upload"]').attachFile({
          fileContent,
          fileName: 'waec.pdf',
          mimeType: 'application/pdf'
        });
      });

      cy.fixture('test-birth-cert.pdf').then(fileContent => {
        cy.get('[data-testid="birth-cert-upload"]').attachFile({
          fileContent,
          fileName: 'birth-cert.pdf',
          mimeType: 'application/pdf'
        });
      });

      cy.get('[data-testid="upload-success"]').should('be.visible');
    });
  });

  describe('Stage 4: Application Status Tracking', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.visit('/dashboard');
    });

    it('should display application status correctly', () => {
      cy.get('[data-testid="status-tracker"]').should('be.visible');
      cy.get('[data-testid="current-status"]').should('exist');
      cy.get('[data-testid="status-timeline"]').should('exist');
    });
  });
});
