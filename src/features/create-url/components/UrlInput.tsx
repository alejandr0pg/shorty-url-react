/**
 * URL Input component - Handles URL input with real-time validation
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '../../../shared/components';
import { validateUrl, needsSanitization, sanitizeUrl } from '../../../shared/utils/urlValidator';
import { useDebounce } from '../../../shared/hooks';
import { UI_CONFIG, ERROR_MESSAGES } from '../../../core/constants/config';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({
  value,
  onChange,
  onValidationChange,
  disabled = false,
  autoFocus = false,
  className
}) => {
  const [touched, setTouched] = useState(false);
  const debouncedValue = useDebounce(value, UI_CONFIG.DEBOUNCE_DELAY);

  // Validation logic
  const validation = useMemo(() => {
    if (!debouncedValue || !touched) {
      return { isValid: true, error: null };
    }

    const result = validateUrl(debouncedValue);
    return {
      isValid: result.valid,
      error: result.valid ? null : result.errors[0] || ERROR_MESSAGES.URL_INVALID
    };
  }, [debouncedValue, touched]);

  // Check if URL needs sanitization
  const needsCleanup = useMemo(() => {
    return value && needsSanitization(value);
  }, [value]);

  // Handle input change
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  }, [onChange]);

  // Handle input blur
  const handleBlur = useCallback(() => {
    setTouched(true);

    // Auto-sanitize on blur if needed
    if (value && needsCleanup) {
      const sanitized = sanitizeUrl(value);
      if (sanitized !== value) {
        onChange(sanitized);
      }
    }
  }, [value, needsCleanup, onChange]);

  // Notify parent about validation state changes
  React.useEffect(() => {
    onValidationChange?.(validation.isValid);
  }, [validation.isValid, onValidationChange]);

  return (
    <div className={className}>
      <Input
        type="url"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="https://ejemplo.com/una-url-muy-larga"
        label="URL a acortar"
        error={validation.error || undefined}
        disabled={disabled}
        autoFocus={autoFocus}
        required
        data-testid="url-input"
      />

      {needsCleanup && !validation.error && (
        <p className="mt-1 text-sm text-yellow-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          URL will be automatically cleaned and formatted
        </p>
      )}
    </div>
  );
};

export default UrlInput;