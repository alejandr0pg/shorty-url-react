/**
 * Redirect Page - Handles URL redirection with advertisement display
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from '../../shared/components';
import { ROUTES } from '../../core/constants/config';
import { AdvertisementSection, RedirectTimer } from './components';
import { urlService } from '../../core/api';

const RedirectPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [countdown, setCountdown] = useState(10);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!code || code.length < 6) {
      setError(true);
      setLoading(false);
      return;
    }

    let timer: NodeJS.Timeout | null = null;
    let isMounted = true;

    // First resolve the short code to get the destination URL
    const resolveCode = async () => {
      try {
        const result = await urlService.resolveShortCode(code);

        if (!isMounted) return; // Component unmounted, don't continue

        setDestinationUrl(result.original_url);
        setLoading(false);

        // Start countdown timer after successful resolution
        timer = setInterval(() => {
          if (!isMounted) {
            if (timer) clearInterval(timer);
            return;
          }

          setCountdown((prev) => {
            if (prev <= 1) {
              if (timer) clearInterval(timer);
              // Redirect to the actual destination URL
              window.location.href = result.original_url;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to resolve short code:', error);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    resolveCode();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="text-center" padding="lg">
            <svg className="animate-spin w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Resolviendo enlace...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras verificamos el enlace
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="text-center" padding="lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              URL no encontrada
            </h2>

            <p className="text-gray-600 mb-6">
              El código de URL proporcionado no es válido o ha expirado.
            </p>

            <div className="space-y-3">
              <Link to={ROUTES.HOME}>
                <Button variant="primary" className="w-full">
                  Crear nueva URL
                </Button>
              </Link>

              <Link to={ROUTES.LIST}>
                <Button variant="ghost" className="w-full">
                  Ver mis URLs
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen py-8">
          {/* Main Redirect Timer */}
          <div className="order-2 lg:order-1">
            <RedirectTimer code={code} countdown={countdown} destinationUrl={destinationUrl} />
          </div>

          {/* Advertisement Section */}
          <div className="order-1 lg:order-2">
            <AdvertisementSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;