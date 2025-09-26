/**
 * Redirect Page - Handles URL redirection with advertisement display
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from '../../shared/components';
import { ROUTES } from '../../core/constants/config';
import { AdvertisementSection, RedirectTimer } from './components';

const RedirectPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code || code.length < 6) {
      setError(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to the short URL endpoint
          window.location.href = `/${code}`;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [code]);

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
            <RedirectTimer code={code} countdown={countdown} />
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