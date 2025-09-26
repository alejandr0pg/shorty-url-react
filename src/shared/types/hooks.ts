/**
 * Custom hooks types
 */

import { Url } from './domain';
import { UpdateUrlRequest } from './api';

// Generic API hook types
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiResult<T> extends UseApiState<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T>;
  reset: () => void;
}

// URL-specific hook types
export interface UseCreateUrlResult {
  createUrl: (url: string) => Promise<void>;
  shortUrl: string | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseUrlsResult {
  urls: Url[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateUrl: (id: number, data: UpdateUrlRequest) => Promise<void>;
  deleteUrl: (id: number) => Promise<void>;
}

// Local storage hook types
export type UseLocalStorageResult<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void
];

// Copy to clipboard hook types
export interface UseCopyToClipboardResult {
  copiedText: string | null;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

// Debounce hook types
export type UseDebounceResult<T> = T;

// Form hook types
export interface UseFormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
  onChange: (value: T) => void;
  onBlur: () => void;
  reset: () => void;
}

export interface UseFormResult<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e?: Event) => Promise<void>;
  reset: () => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
}