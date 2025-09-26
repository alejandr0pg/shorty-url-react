/**
 * URL Result component - Displays the shortened URL with copy functionality
 */

import React from 'react';
import { Card, Button, Alert } from '../../../shared/components';
import { useCopyToClipboard } from '../../../shared/hooks';

interface UrlResultProps {
  shortUrl: string;
  originalUrl: string;
  onReset?: () => void;
  className?: string;
}

const UrlResult: React.FC<UrlResultProps> = ({
  shortUrl,
  originalUrl,
  onReset,
  className
}) => {
  const { copiedText, copy, reset: resetCopy } = useCopyToClipboard();
  const isThisUrlCopied = copiedText === shortUrl;

  const handleCopy = async () => {
    const success = await copy(shortUrl);
    if (success) {
      // Auto-reset copy state after 2 seconds
      setTimeout(resetCopy, 2000);
    }
  };

  const handleCreateAnother = () => {
    onReset?.();
    resetCopy();
  };

  return (
    <Card className={`${className} border-green-200 bg-green-50`} shadow="md">
      <Alert variant="success" title="¡URL acortada con éxito!">
        <div className="space-y-4">
          {/* Original URL */}
          <div className="text-sm">
            <p className="text-green-800 font-medium mb-1">URL original:</p>
            <p className="text-green-700 break-all">{originalUrl}</p>
          </div>

          {/* Short URL */}
          <div>
            <p className="text-green-800 font-medium mb-2">URL acortada:</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium break-all underline"
                  data-testid="short-url-link"
                >
                  {shortUrl}
                </a>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  onClick={handleCopy}
                  variant={isThisUrlCopied ? 'success' : 'secondary'}
                  size="sm"
                  icon={
                    isThisUrlCopied ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )
                  }
                  data-testid="copy-button"
                >
                  {isThisUrlCopied ? 'Copiado' : 'Copiar'}
                </Button>

                <Button
                  onClick={() => window.open(shortUrl, '_blank')}
                  variant="ghost"
                  size="sm"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  }
                  data-testid="open-button"
                >
                  Abrir
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          {onReset && (
            <div className="pt-2 border-t border-green-200">
              <Button
                onClick={handleCreateAnother}
                variant="primary"
                size="sm"
                data-testid="create-another-button"
              >
                Crear otra URL
              </Button>
            </div>
          )}
        </div>
      </Alert>
    </Card>
  );
};

export default UrlResult;