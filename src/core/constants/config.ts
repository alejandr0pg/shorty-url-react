/**
 * Application configuration constants
 */

export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

export const APP_CONFIG = {
  NAME: 'Shrt',
  VERSION: '1.0.0',
  DESCRIPTION: 'URL Shortener Application',
  MAX_URL_LENGTH: 2048,
  MIN_URL_LENGTH: 5,
  DEFAULT_LANGUAGE: 'es',
  SUPPORTED_LANGUAGES: ['es', 'en'] as const
} as const;

export const VALIDATION_CONFIG = {
  URL: {
    MAX_LENGTH: 2048,
    MIN_LENGTH: 5,
    ALLOWED_PROTOCOLS: ['http', 'https', 'ftp', 'ftps'] as const,
    BLOCKED_DOMAINS: [] as string[],
    REQUIRE_PROTOCOL: true
  },
  SHORT_CODE: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 8,
    ALLOWED_CHARACTERS: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  }
} as const;

export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 5000,
  COPY_FEEDBACK_DURATION: 2000,
  SEARCH_MIN_CHARS: 2
} as const;

export const STORAGE_KEYS = {
  DEVICE_ID: 'device_id',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_URLS: 'recent_urls',
  USER_PREFERENCES: 'user_preferences'
} as const;

export const ROUTES = {
  HOME: '/',
  CREATE: '/',
  LIST: '/urls',
  REDIRECT: '/:code'
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  RATE_LIMITED: 'Has excedido el límite de solicitudes. Intenta más tarde.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',
  URL_INVALID: 'La URL proporcionada no es válida.',
  URL_TOO_LONG: 'La URL es demasiado larga.',
  URL_TOO_SHORT: 'La URL es demasiado corta.',
  COPY_FAILED: 'No se pudo copiar al portapapeles.'
} as const;

export const SUCCESS_MESSAGES = {
  URL_CREATED: 'URL acortada exitosamente.',
  URL_UPDATED: 'URL actualizada exitosamente.',
  URL_DELETED: 'URL eliminada exitosamente.',
  COPIED_TO_CLIPBOARD: 'Copiado al portapapeles.',
  DATA_EXPORTED: 'Datos exportados exitosamente.'
} as const;

// Environment-specific configuration
export const ENV = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  API_BASE_URL: process.env.VITE_API_BASE_URL || '/api',
  APP_URL: process.env.VITE_APP_URL || 'http://localhost:3000'
} as const;