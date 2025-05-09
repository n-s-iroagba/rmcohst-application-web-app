
import { faker } from '@faker-js/faker';

describe('End-to-End Integration', () => {
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  };

  before(() => {
    cy.visit('/register');
    cy.registerNewUser(testUser);
  });

  it('should complete full application process', () => {
    // Login
    cy.login(testUser.email, testUser.password);

    // Create application
    cy.visit('/application/new');
    cy.fillApplicationForm();
    
    // Upload documents
    cy.visit('/application/documents');
    cy.uploadRequiredDocuments();
    
    // Check status
    cy.visit('/application/status');
    cy.get('[data-testid="status-tracker"]').should('be.visible');
    cy.get('[data-testid="current-status"]').should('contain', 'Under Review');
    
    // Check decision (mock accepted)
    cy.visit('/application/decision');
    cy.get('[data-testid="decision-status"]').should('contain', 'Accepted');
    
    // View admission letter
    cy.visit('/application/admission');
    cy.get('[data-testid="admission-letter"]').should('be.visible');
    cy.get('[data-testid="print-button"]').should('be.visible');
  });

  it('should handle error states gracefully', () => {
    cy.login(testUser.email, testUser.password);
    
    // Test invalid document upload
    cy.visit('/application/documents');
    cy.get('[data-testid="waec-upload"]').attachFile({
      fileContent: 'invalid',
      fileName: 'invalid.txt',
      mimeType: 'text/plain'
    });
    cy.get('[data-testid="upload-error"]').should('be.visible');
    
    // Test invalid application ID
    cy.visit('/application/status?id=invalid');
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
