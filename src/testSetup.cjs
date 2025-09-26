// Mock import.meta for Jest environment
const importMetaMock = {
  env: {
    VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api',
    VITE_APP_URL: process.env.VITE_APP_URL || 'http://localhost:3000',
    VITE_REQUEST_TIMEOUT: process.env.VITE_REQUEST_TIMEOUT || '10000',
    VITE_APP_ENV: process.env.VITE_APP_ENV || 'test',
    VITE_APP_NAME: process.env.VITE_APP_NAME || 'Shrt',
    VITE_APP_VERSION: process.env.VITE_APP_VERSION || 'test-version',
    VITE_COMMIT_HASH: process.env.VITE_COMMIT_HASH || 'test-commit',
    VITE_COMMIT_MESSAGE: process.env.VITE_COMMIT_MESSAGE || 'Test commit message',
    VITE_GIT_BRANCH: process.env.VITE_GIT_BRANCH || 'test-branch',
    VITE_BUILD_TIME: process.env.VITE_BUILD_TIME || '2025-09-26T10:00:00Z',
    VITE_ENABLE_DEBUG: process.env.VITE_ENABLE_DEBUG || 'true',
    VITE_ENABLE_MONITORING: process.env.VITE_ENABLE_MONITORING || 'false',
    VITE_SHOW_PERFORMANCE_METRICS: process.env.VITE_SHOW_PERFORMANCE_METRICS || 'true'
  }
};

// Define import.meta globally for Jest
Object.defineProperty(globalThis, 'import', {
  value: { meta: importMetaMock },
  writable: true,
  configurable: true
});

// Backup approach - define on global as well
if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'import', {
    value: { meta: importMetaMock },
    writable: true,
    configurable: true
  });
}