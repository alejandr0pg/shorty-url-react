/**
 * Barrel exports for all types
 * This file re-exports types from organized modules for easy importing
 */

// Domain types
export type * from './domain';
export type * from './api';
export type * from './components';
export type * from './hooks';
export type * from './validation';
export type * from './utils';

// Re-export specific commonly used types for backwards compatibility
export type {
  Url,
  UrlCreationData,
  UrlUpdateData
} from './domain';

export type {
  CreateUrlRequest,
  CreateUrlResponse,
  UpdateUrlRequest,
  ApiError,
  ApiResponse
} from './api';

export type {
  ButtonProps,
  InputProps,
  CardProps,
  AlertProps,
  SpinnerProps,
  ButtonVariant,
  ButtonSize
} from './components';

export type {
  UseApiState,
  UseApiResult,
  UseCreateUrlResult,
  UseUrlsResult,
  UseCopyToClipboardResult
} from './hooks';

export type {
  UrlValidationResult,
  ParsedUrl,
  ValidationRule,
  ValidationSchema
} from './validation';

export type {
  DeviceIdService,
  FormattersService,
  StorageService,
  HttpClient
} from './utils';