
import { ApplicationTestIds } from '../../src/test/utils/testIds';

describe('application payment flow', () => {
  before(() => {
    // Login before the tests run
    cy.login({
      email: 'nnamdisolomon1@gmail.com',
      password: '97Chocho@'
    })
  })

  const testLoginCredentials1 = {

    email: 'nnamdisolomon1@gmail.com',
    password: '97Chocho@',

  }


  describe('Application Flow', () => {
    beforeEach(() => {
      cy.login(testLoginCredentials1)
    });

    it('should complete the full application process', () => {
      // Step 1: Start application
      cy.getByTestId(ApplicationTestIds.startApplication as string)
        .should('be.visible')
        .click();
      // Step 2: Select level
      cy.getByTestId(ApplicationTestIds.clickFilterDropDown)
        .should('be.visible')
        .click();
      // Step 3: Select level
      cy.getByTestId(ApplicationTestIds.selectLevel(0))
        .should('be.visible')
        .click();

      // // Step 3: Search for programs
      // cy.getByTestId(ApplicationTestIds.searchProgram)
      //   .should('be.visible')
      //   .type('Computer Science');

      // Wait for search results to load
      cy.wait(1000);

      // Step 4: Select program
      cy.getByTestId(ApplicationTestIds.selectProgram(0))
        .should('be.visible')
        .click();
      cy.wait(3000);

      // Step 5: Initiate payment
      cy.getByTestId(ApplicationTestIds.initiatePayment)
        .should('be.visible')
        .click();

      // Verify payment page or modal appears
      cy.url().should('include', '/payment');

      // Step 6: Navigate to dashboard
      cy.getByTestId(ApplicationTestIds.navigateToDashboard)
        .should('be.visible')
        .click();

      // Verify dashboard is loaded
      cy.url().should('include', '/dashboard');

      // Step 7: Complete application
      cy.getByTestId(ApplicationTestIds.navigateToCompleteApplication)
        .should('be.visible')
        .click();

      // Step 8: Display SSC Qualification Form
      cy.getByTestId(ApplicationTestIds.displaySSCQualificationForm)
        .should('be.visible')
        .click();

      // Verify SSC form is displayed
      cy.contains('SSC Qualification').should('be.visible');

      // Step 9: Display Biodata Form
      cy.getByTestId(ApplicationTestIds.displayBiodataForm)
        .should('be.visible')
        .click();

      // Verify Biodata form is displayed
      cy.contains('Biodata').should('be.visible');
    });

    it('should handle level selection correctly', () => {
      cy.getByTestId(ApplicationTestIds.startApplication).click();

      // Test different level selections
      const levels = ['Undergraduate', 'Graduate', 'Postgraduate'];

      levels.forEach((level, index) => {
        cy.getByTestId(ApplicationTestIds.selectLevel(index))
          .should('be.visible')
          .should('contain.text', level);
      });
    });

    it('should search and select programs correctly', () => {
      cy.getByTestId(ApplicationTestIds.startApplication).click();
      cy.getByTestId(ApplicationTestIds.selectLevel(0)).click();

      // Test program search functionality
      const searchQueries = ['Computer', 'Engineering', 'Medicine'];

      searchQueries.forEach((query) => {
        cy.getByTestId(ApplicationTestIds.searchProgram)
          .clear()
          .type(query);

        // Verify search results appear
        // cy.wait(500);
        // cy.get('[data-testid*="program-result"]').should('exist');
      });
    });

    it('should save form data correctly', () => {
      // Navigate to forms
      cy.getByTestId(ApplicationTestIds.startApplication).click();
      cy.getByTestId(ApplicationTestIds.selectLevel(0)).click();
      cy.getByTestId(ApplicationTestIds.selectProgram(0)).click();
      cy.getByTestId(ApplicationTestIds.initiatePayment).click();
      cy.getByTestId(ApplicationTestIds.navigateToDashboard).click();
      cy.getByTestId(ApplicationTestIds.navigateToCompleteApplication).click();

      // Test SSC Qualification form saving
      cy.getByTestId(ApplicationTestIds.displaySSCQualificationForm).click();

      // Fill in SSC form (assuming form fields exist)
      cy.get('input[name="sscYear"]').type('2020');
      cy.get('input[name="sscBoard"]').type('CBSE');
      cy.get('input[name="sscPercentage"]').type('85');

      cy.getByTestId(ApplicationTestIds.saveSSCQualification)
        .should('be.visible')
        .click();

      // Verify success message
      cy.contains('SSC Qualification saved successfully').should('be.visible');

      // Test Biodata form saving
      cy.getByTestId(ApplicationTestIds.displayBiodataForm).click();

      // Fill in biodata form (assuming form fields exist)
      cy.get('input[name="firstName"]').type('John');
      cy.get('input[name="lastName"]').type('Doe');
      cy.get('input[name="email"]').type('john.doe@example.com');
      cy.get('input[name="phone"]').type('+1234567890');

      cy.getByTestId(ApplicationTestIds.saveBiodata)
        .should('be.visible')
        .click();

      // Verify success message
      cy.contains('Biodata saved successfully').should('be.visible');
    });

    it('should handle navigation correctly', () => {
      // Test navigation elements
      cy.getByTestId(ApplicationTestIds.startApplication).click();

      // Test payments navigation
      cy.getByTestId(ApplicationTestIds.navigateToPayments)
        .should('be.visible')
        .click();

      cy.url().should('include', '/payments');

      // Navigate back and test dashboard
      cy.go('back');
      cy.getByTestId(ApplicationTestIds.navigateToDashboard).click();
      cy.url().should('include', '/dashboard');
    });

    it('should handle form submission', () => {
      // Complete the application flow
      cy.getByTestId(ApplicationTestIds.startApplication).click();
      cy.getByTestId(ApplicationTestIds.selectLevel(0)).click();
      cy.getByTestId(ApplicationTestIds.selectProgram(0)).click();
      cy.getByTestId(ApplicationTestIds.initiatePayment).click();
      cy.getByTestId(ApplicationTestIds.navigateToDashboard).click();
      cy.getByTestId(ApplicationTestIds.navigateToCompleteApplication).click();

      // Fill and save both forms
      cy.getByTestId(ApplicationTestIds.displaySSCQualificationForm).click();
      cy.getByTestId(ApplicationTestIds.saveSSCQualification).click();

      cy.getByTestId(ApplicationTestIds.displayBiodataForm).click();
      cy.getByTestId(ApplicationTestIds.saveBiodata).click();

      // Submit final application
      cy.getByTestId(ApplicationTestIds.submitApplication)
        .should('be.visible')
        .click();

      // Verify submission success
      cy.contains('Application submitted successfully').should('be.visible');
    });

    // Error handling test
    it('should handle errors gracefully', () => {
      cy.getByTestId(ApplicationTestIds.startApplication).click();

      // Test with invalid program search
      cy.getByTestId(ApplicationTestIds.searchProgram)
        .type('InvalidProgram123');

      // Verify no results message
      cy.contains('No programs found').should('be.visible');

      // Test form validation
      cy.getByTestId(ApplicationTestIds.displayBiodataForm).click();
      cy.getByTestId(ApplicationTestIds.saveBiodata).click();

      // Verify validation errors
      cy.contains('Please fill in all required fields').should('be.visible');
    });
  });
})
