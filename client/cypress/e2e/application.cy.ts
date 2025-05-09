
describe('Application Form Submission', () => {
  beforeEach(() => {
    cy.login(); // Custom command to handle authentication
    cy.visit('/application/new');
  });

  it('should allow filling personal information', () => {
    cy.get('[data-testid="firstname-input"]').type('John');
    cy.get('[data-testid="lastname-input"]').type('Doe');
    cy.get('[data-testid="dob-input"]').type('1990-01-01');
    cy.get('[data-testid="phone-input"]').type('1234567890');
    cy.get('[data-testid="next-button"]').click();
    cy.url().should('include', '/application/education');
  });

  it('should handle document upload', () => {
    cy.get('[data-testid="document-upload"]').attachFile('test-document.pdf');
    cy.get('[data-testid="upload-status"]').should('contain', 'Uploaded successfully');
  });

  it('should complete full application process', () => {
    // Fill personal info
    cy.fillPersonalInfo();
    // Fill education details
    cy.fillEducationDetails();
    // Upload documents
    cy.uploadRequiredDocuments();
    // Submit application
    cy.get('[data-testid="submit-application"]').click();
    cy.url().should('include', '/application/success');
  });
});
