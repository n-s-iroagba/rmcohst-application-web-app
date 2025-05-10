import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000', // Replace with your actual dev server URL
  },
});
