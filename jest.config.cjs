// Set environment variables for testing - match all variables used in the app
process.env.VITE_API_URL = 'http://localhost:8000/api';
process.env.VITE_API_BASE_URL = 'http://localhost:8000/api';
process.env.VITE_APP_URL = 'http://localhost:3000';
process.env.VITE_REQUEST_TIMEOUT = '10000';
process.env.VITE_APP_ENV = 'test';
process.env.VITE_APP_NAME = 'Shorty URL Shortener';
process.env.VITE_APP_VERSION = 'test-version';
process.env.VITE_COMMIT_HASH = 'test-commit-hash';
process.env.VITE_COMMIT_MESSAGE = 'Test commit message';
process.env.VITE_GIT_BRANCH = 'test-branch';
process.env.VITE_BUILD_TIME = '2025-09-26T10:00:00Z';
process.env.VITE_AWS_REGION = 'us-east-1';
process.env.VITE_CLOUDFRONT_DOMAIN = 'd2570b9eh3h8yc.cloudfront.net';
process.env.VITE_CACHE_TIMEOUT = '300000';
process.env.VITE_ENABLE_ANALYTICS = 'true';
process.env.VITE_ENABLE_DEBUG = 'true';
process.env.VITE_ENABLE_SERVICE_WORKER = 'true';
process.env.VITE_SHOW_PERFORMANCE_METRICS = 'true';
process.env.VITE_ENABLE_ERROR_REPORTING = 'true';
process.env.VITE_ENABLE_MONITORING = 'false';
process.env.VITE_HOT_RELOAD = 'true';

module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.cjs"],
    setupFiles: ["<rootDir>/src/testSetup.cjs"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {
            presets: [
                ["@babel/preset-env", {
                    targets: { node: "current" },
                    modules: "commonjs"
                }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript"
            ],
            plugins: [
                // Transform import.meta to global.import.meta for Jest
                ["@babel/plugin-transform-modules-commonjs"]
            ]
        }],
    },
    transformIgnorePatterns: [
        "node_modules/(?!(.*\\.mjs$))"
    ],
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)",
        "<rootDir>/src/**/?(*.)(spec|test).(js|jsx|ts|tsx)"
    ],
    collectCoverageFrom: [
        "src/**/*.(js|jsx|ts|tsx)",
        "!src/**/*.d.ts",
        "!src/main.tsx",
        "!src/vite-env.d.ts"
    ],
    testTimeout: 10000
};
