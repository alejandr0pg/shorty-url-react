/**
 * Custom hook for URL creation with validation and state management
 */

import { useState, useCallback } from 'react';
import { urlService } from '../../../core/api';
import { validateUrl, sanitizeUrl } from '../../../shared/utils/urlValidator';
import { UseCreateUrlResult } from '../../../shared/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../core/constants/config';

export const useCreateUrl = (): UseCreateUrlResult => {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUrl = useCallback(async (url: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      // Client-side validation first
      const validation = validateUrl(url);
      if (!validation.valid) {
        throw new Error(validation.errors[0] || ERROR_MESSAGES.URL_INVALID);
      }

      // Sanitize URL before sending
      const sanitizedUrl = sanitizeUrl(url);

      // Create URL via API
      const response = await urlService.createUrl({ url: sanitizedUrl });

      setShortUrl(response.short_url);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setShortUrl(null);
    setError(null);
  }, []);

  return {
    createUrl,
    shortUrl,
    loading,
    error,
    reset
  };
};

export default useCreateUrl;