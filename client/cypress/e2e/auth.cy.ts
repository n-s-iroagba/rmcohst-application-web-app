import { signUpFormTestIds } from "../../src/test/testIds/formTestIds";
import { emailVerificationTestIds } from "../../src/test/testIds/verifyemailTestIds";

describe('Signup Flow with Email Verification', () => {
    const testUser = {
        username: 'UdorAkpuEnyi',
        email: 'nnamdisolomon1@gmail.com',
        password: '97Chocho@',
        confirmPassword: '97Chocho@'
    }

    const verificationCode = '123456'; // Mock verification code

    it('should fill and submit the signup form then verify email', () => {
        cy.visit('/auth/signup/applicant')

        // Fill signup form
        Object.keys(testUser).forEach((key) => {
            const typedKey = key as keyof typeof testUser
            cy.getByTestId(signUpFormTestIds.FIELD_TEST_IDS[typedKey]).type(testUser[typedKey])
        })

        // Submit signup form
        cy.getByTestId(signUpFormTestIds.SUBMIT_BUTTON_TEST_ID).click()

        // Verify navigation to email verification page
        cy.url().should('include', '/auth/verify-email')

        // Test email verification form
        cy.getByTestId(emailVerificationTestIds.emailVerificationContainer as string).should('be.visible')

        // Fill verification code inputs (assuming 6-digit code)
        verificationCode.split('').forEach((digit, index) => {
            // Type assertion needed for the iterable test ID function
            const inputTestId = (emailVerificationTestIds.emailVerificationInput as (index: number) => string)(index);
            cy.getByTestId(inputTestId).type(digit)
        })

        // Submit verification form
        cy.getByTestId(emailVerificationTestIds.emailVerificationSubmit as string).click()

        // Add assertion for successful verification
        cy.url().should('include', '/dashboard') // Or wherever users go after verification
    })

    it('should handle forgot password', () => {
    })

})