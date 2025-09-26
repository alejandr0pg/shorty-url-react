/**
 * Validation-related types
 */

// URL Validation types
export interface UrlValidationResult {
  valid: boolean;
  errors: string[];
  parts?: {
    scheme: string;
    host: string;
    port?: string;
    path?: string;
  };
}

export interface UrlProcessingResult {
  original: string;
  sanitized: string;
  normalized: string;
  validation: UrlValidationResult;
  needsSanitization: boolean;
}

export interface ParsedUrl {
  scheme: string;
  host: string;
  port?: string;
  path?: string;
  query?: string;
  fragment?: string;
  isValid: boolean;
}

// Form validation types
export interface ValidationRule<T = unknown> {
  validator: (value: T) => boolean | Promise<boolean>;
  message: string;
}

export interface FieldValidation<T = unknown> {
  required?: boolean;
  rules?: ValidationRule<T>[];
}

export type ValidationSchema<T extends Record<string, unknown>> = {
  [K in keyof T]?: FieldValidation<T[K]>;
};

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidationErrors<T extends Record<string, unknown>> = {
  [K in keyof T]?: string;
};