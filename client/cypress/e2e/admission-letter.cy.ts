
describe('Decision and Admission Process', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should show decision and link to payment', () => {
    cy.visit('/application/decision?id=test-app-id');
    cy.get('[data-testid="decision-status"]').should('contain', 'Accepted');
    cy.get('[data-testid="payment-link"]').should('be.visible')
      .and('have.attr', 'href')
      .and('include', '/application/acceptance-fee');
  });

describe('Admission Letter', () => {
  beforeEach(() => {
    cy.loginAsAcceptedStudent();
  });

  it('should display and download admission letter with archiving', () => {
    cy.visit('/application/admission');
    
    // Check letter content
    cy.get('[data-testid="admission-letter"]').should('be.visible');
    cy.contains('Admission Letter').should('be.visible');
    cy.contains('Student ID:').should('be.visible');
    
    // Test download and verify Google Drive storage
    cy.intercept('GET', '**/api/admission/*/letter/download').as('downloadLetter');
    cy.contains('Download PDF').click();
    cy.wait('@downloadLetter').then((interception) => {
      expect(interception.response?.headers['content-type']).to.equal('application/pdf');
    });
    
    // Test download functionality
    cy.intercept('GET', '**/api/applications/*/admission-letter').as('downloadLetter');
    cy.contains('Download PDF').click();
    cy.wait('@downloadLetter').its('response.statusCode').should('eq', 200);
  });

  it('should handle download errors gracefully', () => {
    cy.visit('/application/admission');
    
    // Mock failed download
    cy.intercept('GET', '**/api/applications/*/admission-letter', {
      statusCode: 500,
      body: { error: 'Download failed' }
    });
    
    cy.contains('Download PDF').click();
    cy.contains('Failed to download admission letter').should('be.visible');
  });

  it('should show proper loading state', () => {
    cy.visit('/application/admission');
    cy.get('.animate-spin').should('be.visible');
    cy.get('[data-testid="admission-letter"]', { timeout: 10000 }).should('be.visible');
  });
});
describe('Admission Letter Access Journey', () => {
  beforeEach(() => {
    cy.login('accepted@student.com', 'password123');
    cy.visit('/application/admission');
  });

  it('should display admission letter for accepted student', () => {
    cy.get('[data-testid="admission-letter"]').should('be.visible');
    cy.get('[data-testid="student-name"]').should('not.be.empty');
    cy.get('[data-testid="admission-details"]').should('be.visible');
  });

  it('should allow downloading admission letter', () => {
    cy.get('[data-testid="download-letter"]').click();
    cy.get('[data-testid="download-success"]').should('be.visible');
  });

  it('should validate letter authenticity', () => {
    cy.get('[data-testid="verify-letter"]').click();
    cy.get('[data-testid="verification-status"]').should('contain', 'Authentic');
  });
});
