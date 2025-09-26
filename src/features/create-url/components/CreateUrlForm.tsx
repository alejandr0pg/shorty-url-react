/**
 * Create URL Form component - Main form for URL shortening
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button, Alert } from '../../../shared/components';
import UrlInput from './UrlInput';
import { useCreateUrl } from '../hooks/useCreateUrl';

interface CreateUrlFormProps {
  onSuccess?: (originalUrl: string, shortUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const CreateUrlForm: React.FC<CreateUrlFormProps> = ({
  onSuccess,
  onError,
  className
}) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [pendingOriginalUrl, setPendingOriginalUrl] = useState<string | null>(null);
  const { createUrl, shortUrl, loading, error, reset } = useCreateUrl();

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!url.trim() || !isValid) {
      return;
    }

    try {
      const trimmedUrl = url.trim();
      setPendingOriginalUrl(trimmedUrl);
      await createUrl(trimmedUrl);
      // onSuccess will be called via useEffect when shortUrl updates
    } catch (err) {
      console.error('[CreateUrlForm] Error creating URL:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear URL';
      onError?.(errorMessage);
    }
  }, [url, isValid, createUrl, onError]);

  // Effect to handle success when shortUrl updates
  useEffect(() => {
    if (shortUrl && pendingOriginalUrl) {
      onSuccess?.(pendingOriginalUrl, shortUrl);
      setUrl('');
      setPendingOriginalUrl(null);
    }
  }, [shortUrl, pendingOriginalUrl, onSuccess]);

  const handleReset = useCallback(() => {
    setUrl('');
    setPendingOriginalUrl(null);
    reset();
  }, [reset]);

  const canSubmit = url.trim() && isValid && !loading;

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <UrlInput
          value={url}
          onChange={setUrl}
          onValidationChange={setIsValid}
          disabled={loading}
          autoFocus
        />

        {error && (
          <Alert
            variant="error"
            onClose={handleReset}
            className="animate-in fade-in-50 duration-200"
          >
            {error}
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!canSubmit}
            loading={loading}
            className="flex-1 sm:flex-initial"
            data-testid="submit-button"
          >
            {loading ? 'Acortando...' : 'Acortar URL'}
          </Button>

          {(url || error) && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleReset}
              disabled={loading}
              data-testid="reset-button"
            >
              Limpiar
            </Button>
          )}
        </div>
      </form>

      {/* Form hints */}
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Compatible con HTTP, HTTPS, FTP
        </p>
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Validación automática según RFC 1738
        </p>
        <p className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Códigos únicos de 6-8 caracteres
        </p>
      </div>
    </div>
  );
};

export default CreateUrlForm;