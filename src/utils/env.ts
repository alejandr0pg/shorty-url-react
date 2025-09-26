/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Environment variable utility for Vite React apps deployed to S3/CloudFront
 *
 * Multi-layer approach for maximum compatibility:
 * 1. Runtime config (window.__RUNTIME_CONFIG__) - Works for S3 deployments
 * 2. import.meta.env (Vite native) - Build-time replacement
 * 3. process.env (fallback for tests and define config)
 */

// Type definitions for runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: Record<string, string>;
    getEnvVar?: (key: string, fallback?: string) => string;
  }
}

/**
 * Get environment variable value with multi-layer fallback system
 * Priority: Runtime config > import.meta.env > process.env > fallback
 */
export const getEnvVar = (key: string, fallback: string = ""): string => {
  // 1. Runtime config (loaded from config.js for S3 deployments)
  if (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) {
    const runtimeValue = window.__RUNTIME_CONFIG__[key];
    if (runtimeValue !== undefined && runtimeValue !== "") {
      return runtimeValue;
    }
  }

  // In test environment, skip import.meta to avoid Jest parsing issues
  const isTestEnv =
    typeof process !== "undefined" && process.env.NODE_ENV === "test";

  // 2. import.meta.env (Vite's native way - statically replaced at build time)
  if (!isTestEnv && typeof window !== "undefined") {
    try {
      // Use dynamic access to avoid Jest parsing issues
      const importMeta = (globalThis as any).import?.meta;
      if (importMeta && importMeta.env && importMeta.env[key] !== undefined) {
        return importMeta.env[key];
      }
    } catch (e) {
      // import.meta not available (Node.js/Jest environment)
    }
  }

  // 3. process.env fallback (for Jest tests and build-time injection via define)
  if (
    typeof process !== "undefined" &&
    process.env &&
    process.env[key] !== undefined
  ) {
    return process.env[key];
  }

  return fallback;
};
