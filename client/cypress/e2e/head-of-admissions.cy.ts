
import { faker } from '@faker-js/faker';

describe('Head of Admissions Journey', () => {
  beforeEach(() => {
    cy.loginAsHOA();
    cy.visit('/hoa/dashboard');
  });

  describe('Dashboard Overview', () => {
    it('should display key metrics', () => {
      cy.get('[data-testid="total-applications"]').should('be.visible');
      cy.get('[data-testid="under-review"]').should('be.visible');
      cy.get('[data-testid="accepted-count"]').should('be.visible');
      cy.get('[data-testid="department-seats"]').should('be.visible');
    });
  });

  describe('Application Assignment', () => {
    it('should assign applications to officers', () => {
      cy.get('[data-testid="unassigned-applications"]').first().click();
      cy.get('[data-testid="assign-officer"]').click();
      cy.get('[data-testid="officer-select"]').select('Officer 1');
      cy.get('[data-testid="confirm-assignment"]').click();
      cy.get('[data-testid="assignment-success"]').should('be.visible');
    });
  });

  describe('Department Management', () => {
    it('should handle department capacity updates', () => {
      cy.get('[data-testid="manage-departments"]').click();
      cy.get('[data-testid="department-capacity"]').first().clear().type('50');
      cy.get('[data-testid="save-capacity"]').click();
      cy.get('[data-testid="update-success"]').should('be.visible');
    });
  });

  describe('Reports and Analytics', () => {
    it('should generate and download reports', () => {
      cy.get('[data-testid="reports-section"]').click();
      cy.get('[data-testid="date-range-start"]').type('2024-01-01');
      cy.get('[data-testid="date-range-end"]').type('2024-12-31');
      cy.get('[data-testid="generate-report"]').click();
      cy.get('[data-testid="download-report"]').should('be.visible');
    });
  });
});
