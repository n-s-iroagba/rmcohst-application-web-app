
import { faker } from '@faker-js/faker';

describe('Acceptance Fee Payment', () => {
  const testUser = {
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
  });

  it('should complete acceptance fee payment successfully', () => {
    cy.visit('/application/acceptance-fee');
    
    // Fill in payment details
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4242 4242 4242 4242');
    cy.get('input[placeholder="MM/YY"]').type('1225');
    cy.get('input[placeholder="123"]').type('123');
    
    // Submit payment
    cy.get('button[type="submit"]').click();
    
    // Verify success and redirect
    cy.url().should('include', '/application/upgrade');
  });

  it('should display error message for failed payment', () => {
    cy.visit('/application/acceptance-fee');
    
    // Fill in invalid payment details
    cy.get('input[placeholder="1234 5678 9012 3456"]').type('4000 0000 0000 0002');
    cy.get('input[placeholder="MM/YY"]').type('1225');
    cy.get('input[placeholder="123"]').type('123');
    
    // Submit payment
    cy.get('button[type="submit"]').click();
    
    // Verify error message
    cy.get('.text-red-600').should('be.visible');
  });
});
