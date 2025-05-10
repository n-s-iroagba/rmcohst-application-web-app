/// <reference types="cypress" />

describe('Admin Journey', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  describe('Document Verification Flow', () => {
    it('should verify uploaded documents', () => {
      cy.visit('/admin/applications');
      cy.get('[data-testid="application-row"]').first().click();
      cy.get('[data-testid="document-list"]').should('be.visible');
      cy.get('[data-testid="verify-waec"]').click();
      cy.get('[data-testid="verify-birth-cert"]').click();
      cy.get('[data-testid="verification-complete"]').should('be.visible');
    });
  });

  describe('Application Review Flow', () => {
    it('should complete application review process', () => {
      cy.visit('/admin/applications/review');
      cy.get('[data-testid="pending-review"]').first().click();
      cy.get('[data-testid="review-form"]').should('be.visible');
      cy.get('[data-testid="approve-button"]').click();
      cy.get('[data-testid="confirmation-modal"]').should('be.visible');
      cy.get('[data-testid="confirm-approval"]').click();
      cy.get('[data-testid="approval-success"]').should('be.visible');
    });
  });

  describe('Metrics Dashboard', () => {
    it('should display correct metrics', () => {
      cy.visit('/admin/dashboard');
      cy.get('[data-testid="total-applications"]').should('be.visible');
      cy.get('[data-testid="pending-reviews"]').should('be.visible');
      cy.get('[data-testid="approved-applications"]').should('be.visible');
      cy.get('[data-testid="department-stats"]').should('exist');
    });
  });
});
