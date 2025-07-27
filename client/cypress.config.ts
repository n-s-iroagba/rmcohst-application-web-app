// cypress.config.ts
import { defineConfig } from "cypress";
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import webpackConfig from "./cypress/webpack.config";

export default defineConfig({
  projectId: "zbtqra",
 e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', webpackPreprocessor({ webpackOptions: webpackConfig }));
      return config;
    },
  }
});
