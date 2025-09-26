/**
 * API request/response types
 */

export interface CreateUrlRequest {
  url: string;
}

export interface CreateUrlResponse {
  short_url: string;
  original_url: string;
  code: string;
}

export interface UpdateUrlRequest {
  url: string;
}

export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}