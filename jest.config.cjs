module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.cjs"],
    globals: {
        TextEncoder: TextEncoder,
        TextDecoder: TextDecoder,
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", {
            presets: [
                ["@babel/preset-env", { targets: { node: "current" } }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript"
            ]
        }],
    },
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
