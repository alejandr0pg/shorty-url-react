/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_SERVICE_WORKER: string
  readonly VITE_AWS_REGION: string
  readonly VITE_CLOUDFRONT_DOMAIN: string
  readonly VITE_CACHE_TIMEOUT: string
  readonly VITE_REQUEST_TIMEOUT: string
  readonly VITE_SHOW_PERFORMANCE_METRICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  readonly VITE_ENABLE_MONITORING: string
  readonly VITE_HOT_RELOAD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}