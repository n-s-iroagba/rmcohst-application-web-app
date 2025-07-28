import { SIGNUP_FORM_DEFAULT_DATA } from "../../src/constants/auth";
import { generateComponentFormTestIds } from "../../src/utils/testIdGenerator";


describe('Signup Flow', () => {
  const TEST_ID_BASE = 'signup-form';

  // Generate all test IDs
  const { FIELD_TEST_IDS, SUBMIT_BUTTON_TEST_ID } =
    generateComponentFormTestIds(SIGNUP_FORM_DEFAULT_DATA, TEST_ID_BASE);

  const testUser = {
    username:'UdorAkpuEnyi',
    email: 'john.doe@example.com',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
  };

  // Add a test block
  it('should fill and submit the signup form', () => {
    cy.visit('/auth/applicant-signup'); // Add visit command

    Object.keys(SIGNUP_FORM_DEFAULT_DATA).forEach((key) => {
      const typedKey = key as keyof typeof SIGNUP_FORM_DEFAULT_DATA;
      cy.getByTestId(FIELD_TEST_IDS[typedKey]).type(testUser[typedKey]);
    });

    cy.getByTestId(SUBMIT_BUTTON_TEST_ID).click();

    // Add assertions to verify successful submission
    cy.url().should('include', '/verify-email'); // Example assertion
  });
});