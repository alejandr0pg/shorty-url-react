import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // This loads .env, .env.local, .env.[mode], .env.[mode].local files
  // Important: For S3/CloudFront, variables must be available at BUILD TIME
  const env = loadEnv(mode, process.cwd(), '');

  // List of all VITE_ prefixed environment variables needed for the app
  const viteKeys = [
    'VITE_API_URL',
    'VITE_API_BASE_URL',
    'VITE_APP_URL',
    'VITE_APP_ENV',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
    'VITE_COMMIT_HASH',
    'VITE_COMMIT_MESSAGE',
    'VITE_GIT_BRANCH',
    'VITE_BUILD_TIME',
    'VITE_REQUEST_TIMEOUT',
    'VITE_ENABLE_DEBUG',
    'VITE_ENABLE_MONITORING',
    'VITE_SHOW_PERFORMANCE_METRICS'
  ];

  // Debug logging for build-time environment variables
  console.log(`\n🔧 Vite build environment variables (${mode} mode):`);
  viteKeys.forEach(key => {
    // Priority: process.env (Docker build args) > loadEnv result
    const value = process.env[key] || env[key];
    console.log(`  ${key}: ${value ? '✅' : '❌'} ${value || '(empty)'}`);
  });

  // For S3/CloudFront deployment, we rely on Vite's native import.meta.env
  // Variables are automatically available if they start with VITE_ and are present at build time
  // We only need define for process.env fallback (mainly for Jest tests)
  const processEnvDefines = {};
  viteKeys.forEach(key => {
    const value = process.env[key] || env[key] || '';
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  });

  return {
    plugins: [react()],
    define: {
      // Only needed for process.env fallback in tests
      ...processEnvDefines,
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
  };
});
