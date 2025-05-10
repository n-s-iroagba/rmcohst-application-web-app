declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable<void>;
      login(email: string, password: string): Chainable<void>;
      loginAsHOA(): Chainable<void>;
      loginAsSuperAdmin(): Chainable<void>;
      registerNewUser(user: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }): Chainable<void>;
      fillApplicationForm(): Chainable<void>;
      uploadRequiredDocuments(): Chainable<void>;
    }
  }
}

export {}; // 👈 forces this to be a module
