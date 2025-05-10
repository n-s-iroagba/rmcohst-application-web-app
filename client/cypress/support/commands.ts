// cypress/support/commands.ts

import 'cypress-file-upload';

// Define a type for the user object
type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Command: Login as Admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('ADMIN_EMAIL'),
      password: Cypress.env('ADMIN_PASSWORD'),
    },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

// Command: Login with email and password
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

// Command: Login as HOA
Cypress.Commands.add('loginAsHOA', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('HOA_EMAIL'),
      password: Cypress.env('HOA_PASSWORD'),
    },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

// Command: Login as Super Admin
Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('SUPER_ADMIN_EMAIL'),
      password: Cypress.env('SUPER_ADMIN_PASSWORD'),
    },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

// Command: Register new user
Cypress.Commands.add('registerNewUser', (user: User) => {
  cy.get('[data-testid="firstname-input"]').type(user.firstName);
  cy.get('[data-testid="lastname-input"]').type(user.lastName);
  cy.get('[data-testid="email-input"]').type(user.email);
  cy.get('[data-testid="password-input"]').type(user.password);
  cy.get('[data-testid="confirm-password-input"]').type(user.password);
  cy.get('[data-testid="register-submit"]').click();
});

// Command: Fill application form
Cypress.Commands.add('fillApplicationForm', () => {
  cy.get('[data-testid="program-select"]').select('Medical Assistant');
  cy.get('[data-testid="start-date"]').type('2024-09-01');
  cy.get('[data-testid="submit-application"]').click();
});

// Command: Upload required documents
Cypress.Commands.add('uploadRequiredDocuments', () => {
  cy.fixture('test-waec.pdf', 'base64').then((fileContent) => {
    cy.get('[data-testid="waec-upload"]').attachFile({
      fileContent,
      fileName: 'waec.pdf',
      mimeType: 'application/pdf',
      encoding: 'base64',
    });
  });

  cy.fixture('test-birth-cert.pdf', 'base64').then((fileContent) => {
    cy.get('[data-testid="birth-cert-upload"]').attachFile({
      fileContent,
      fileName: 'birth-cert.pdf',
      mimeType: 'application/pdf',
      encoding: 'base64',
    });
  });
});
