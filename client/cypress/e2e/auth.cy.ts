
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/auth/login');
  });

  it('should display login form', () => {
    cy.get('[data-testid="login-form"]').should('be.visible');
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="password-input"]').type('short');
    cy.get('[data-testid="login-submit"]').click();
    cy.get('[data-testid="email-error"]').should('be.visible');
    cy.get('[data-testid="password-error"]').should('be.visible');
  });

  it('should successfully login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('validPassword123');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
