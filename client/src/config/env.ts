// src/config/env.ts
const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || '',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'plamwebtv',
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

export default config;
