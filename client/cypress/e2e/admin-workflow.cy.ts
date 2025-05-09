
describe('Admin Workflows', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/dashboard');
  });

  it('should display pending applications', () => {
    cy.get('[data-testid="pending-applications"]').should('be.visible');
    cy.get('[data-testid="application-item"]').should('have.length.at.least', 1);
  });

  it('should allow batch processing', () => {
    cy.get('[data-testid="select-all"]').click();
    cy.get('[data-testid="batch-action"]').click();
    cy.get('[data-testid="approve-selected"]').click();
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should verify documents', () => {
    cy.get('[data-testid="application-item"]').first().click();
    cy.get('[data-testid="verify-document"]').click();
    cy.get('[data-testid="verification-status"]').should('contain', 'Verified');
  });
});
