export {};

declare global {
  namespace Cypress {
    interface Chainable {
      navigateTo(path: string): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}