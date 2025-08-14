/// <reference types="cypress" />


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts

// Add custom command type definitions
import {loginFormTestIds} from '../../src/utils/formTestIds'
declare global { 
  namespace Cypress {
    interface Chainable {
      navigateTo(path: string): Chainable<void>
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>
      login : (credentials: { email: string; password: string }) =>  Chainable<void>
    }
  }
}
 
// cypress/support/commands.ts

Cypress.Commands.add('login', (credentials: { email: string; password: string }) => {
  cy.visit('/auth/login')

  Object.keys(credentials).forEach((key) => {
      const typedKey = key as keyof typeof credentials
      cy.getByTestId(loginFormTestIds.FIELD_TEST_IDS[typedKey]).type(credentials[typedKey])
    })
  cy.getByTestId(loginFormTestIds.SUBMIT_BUTTON_TEST_ID).click()
})


// Implement the custom commands
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('navigateTo', (path: string) => {
  cy.visit(path)
})

// Export to make this a module
export {}
