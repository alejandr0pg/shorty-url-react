/**
 * Redirect Timer - Handles countdown and redirection logic
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Spinner } from '../../../shared/components';
import { ROUTES } from '../../../core/constants/config';

interface RedirectTimerProps {
  code: string;
  countdown: number;
  className?: string;
}

const RedirectTimer: React.FC<RedirectTimerProps> = ({
  code,
  countdown,
  className
}) => {
  return (
    <Card className={`text-center ${className}`} padding="lg">
      <div className="mb-6">
        <Spinner size="lg" className="mx-auto mb-4" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Redirigiendo...
      </h2>

      <p className="text-gray-600 mb-4">
        Serás redirigido en {countdown} segundo{countdown !== 1 ? 's' : ''}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${((5 - countdown) / 5) * 100}%` }}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Código: <span className="font-mono font-medium">{code}</span>
        </p>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Si no eres redirigido automáticamente:
          </p>

          <div className="space-y-2">
            <a
              href={`/${code}`}
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Hacer clic aquí
            </a>

            <Link to={ROUTES.HOME}>
              <Button variant="ghost" size="sm" className="w-full">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RedirectTimer;