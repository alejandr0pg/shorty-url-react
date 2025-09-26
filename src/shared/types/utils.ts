/**
 * Utility and service types
 */

// Device ID service types
export interface DeviceIdService {
  getDeviceId: () => string;
  generateDeviceId: () => string;
  clearDeviceId: () => void;
}

// Formatters service types
export interface FormattersService {
  formatDate: (date: string, locale?: string) => string;
  formatUrl: (url: string, maxLength?: number) => string;
  truncateText: (text: string, maxLength: number) => string;
  formatNumber: (num: number, locale?: string) => string;
  formatBytes: (bytes: number, decimals?: number) => string;
}

// Storage service types
export interface StorageService {
  get<T>(key: string, defaultValue?: T): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// HTTP client types
export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, config?: RequestInit): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
  delete<T>(url: string, config?: RequestInit): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
}

// Event types
export interface CustomEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

export type EventListener<T = unknown> = (event: CustomEvent<T>) => void;

export interface EventEmitter {
  on<T>(eventType: string, listener: EventListener<T>): void;
  off<T>(eventType: string, listener: EventListener<T>): void;
  emit<T>(eventType: string, payload: T): void;
  once<T>(eventType: string, listener: EventListener<T>): void;
}

// Router types
export interface RouteParams {
  [key: string]: string | undefined;
}

export interface LocationState {
  pathname: string;
  search: string;
  hash: string;
  state?: unknown;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
}