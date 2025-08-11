import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'zbtqra',
  e2e: {
    setupNodeEvents(on, config) {
      // No webpack preprocessing needed
      return config
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    fixturesFolder: 'cypress/fixtures'
  }
})
