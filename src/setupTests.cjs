require("@testing-library/jest-dom");

// Polyfill for TextEncoder/TextDecoder in Jest environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
