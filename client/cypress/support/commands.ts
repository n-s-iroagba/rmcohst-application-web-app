
declare namespace Cypress {
  interface Chainable {
    loginAsAdmin(): Chainable<void>
    login(email: string, password: string): Chainable<void>
  }
}

Cypress.Commands.add('loginAsAdmin', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('ADMIN_EMAIL'),
      password: Cypress.env('ADMIN_PASSWORD')
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});
Cypress.Commands.add('loginAsHOA', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('HOA_EMAIL'),
      password: Cypress.env('HOA_PASSWORD')
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('SUPER_ADMIN_EMAIL'),
      password: Cypress.env('SUPER_ADMIN_PASSWORD')
    }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

Cypress.Commands.add('registerNewUser', (user) => {
  cy.get('[data-testid="firstname-input"]').type(user.firstName);
  cy.get('[data-testid="lastname-input"]').type(user.lastName);
  cy.get('[data-testid="email-input"]').type(user.email);
  cy.get('[data-testid="password-input"]').type(user.password);
  cy.get('[data-testid="confirm-password-input"]').type(user.password);
  cy.get('[data-testid="register-submit"]').click();
});

Cypress.Commands.add('fillApplicationForm', () => {
  cy.get('[data-testid="program-select"]').select('Medical Assistant');
  cy.get('[data-testid="start-date"]').type('2024-09-01');
  cy.get('[data-testid="submit-application"]').click();
});

Cypress.Commands.add('uploadRequiredDocuments', () => {
  cy.fixture('test-waec.pdf').then(fileContent => {
    cy.get('[data-testid="waec-upload"]').attachFile({
      fileContent,
      fileName: 'waec.pdf',
      mimeType: 'application/pdf'
    });
  });

  cy.fixture('test-birth-cert.pdf').then(fileContent => {
    cy.get('[data-testid="birth-cert-upload"]').attachFile({
      fileContent,
      fileName: 'birth-cert.pdf',
      mimeType: 'application/pdf'
    });
  });
});
