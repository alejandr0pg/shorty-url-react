#!/usr/bin/env node

/**
 * Generate runtime configuration for S3 deployment
 * This script creates a config.js file with environment variables
 * that can be loaded at runtime by the React app
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const config = {
  VITE_API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || '/api',
  VITE_APP_URL: process.env.VITE_APP_URL || 'http://localhost:3000',
  VITE_APP_ENV: process.env.VITE_APP_ENV || 'development',
  VITE_APP_NAME: process.env.VITE_APP_NAME || 'Shrt',
  VITE_APP_VERSION: process.env.VITE_APP_VERSION || '1.0.0',
  VITE_COMMIT_HASH: process.env.VITE_COMMIT_HASH || 'unknown',
  VITE_COMMIT_MESSAGE: process.env.VITE_COMMIT_MESSAGE || 'No commit message',
  VITE_GIT_BRANCH: process.env.VITE_GIT_BRANCH || 'main',
  VITE_BUILD_TIME: process.env.VITE_BUILD_TIME || new Date().toISOString(),
  VITE_REQUEST_TIMEOUT: process.env.VITE_REQUEST_TIMEOUT || '5000',
  VITE_ENABLE_DEBUG: process.env.VITE_ENABLE_DEBUG || 'false',
  VITE_ENABLE_MONITORING: process.env.VITE_ENABLE_MONITORING || 'false',
  VITE_SHOW_PERFORMANCE_METRICS: process.env.VITE_SHOW_PERFORMANCE_METRICS || 'false'
};

// Create config.js content
const configContent = `// Auto-generated configuration
window.__RUNTIME_CONFIG__ = ${JSON.stringify(config, null, 2)};

// Make it available globally
if (typeof window !== 'undefined') {
  window.getEnvVar = function(key, fallback = '') {
    return window.__RUNTIME_CONFIG__[key] || fallback;
  };
}

console.log('🔧 Runtime config loaded:', window.__RUNTIME_CONFIG__);
`;

// Determine output directory
const outputDir = process.argv[2] || './dist';
const outputPath = path.join(outputDir, 'config.js');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write config file
fs.writeFileSync(outputPath, configContent);

console.log('✅ Generated config.js with environment variables:');
Object.entries(config).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅' : '❌'} ${value || '(empty)'}`);
});
console.log(`📁 Config file saved to: ${outputPath}`);