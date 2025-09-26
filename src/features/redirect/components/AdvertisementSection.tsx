/**
 * Advertisement Section - Displays animated advertisement content
 */

import React from 'react';
import { Card, Button } from '../../../shared/components';
import '../styles/animations.css';

interface AdvertisementSectionProps {
  className?: string;
}

const AdvertisementSection: React.FC<AdvertisementSectionProps> = ({ className }) => {
  const handleContactClick = () => {
    window.open('mailto:publicidad@shrt.com?subject=Quiero anunciar en Shrt', '_blank');
  };

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 ${className}`}
      padding="lg"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="animate-pulse-slow absolute top-0 left-0 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="animate-pulse-slow animation-delay-2000 absolute top-0 right-0 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="animate-pulse-slow animation-delay-4000 absolute -bottom-8 left-20 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Animated Title */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce-slow">
            ¡Anuncia Aquí!
          </h3>

          <div className="text-lg text-gray-700 space-y-2">
            <div className="animate-fade-in-up">
              <span className="inline-block animate-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-semibold">
                Llega a miles de usuarios
              </span>
            </div>
            <div className="animate-fade-in-up animation-delay-1000">
              <span className="inline-block animate-shimmer animation-delay-2000 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                Impulsa tu negocio
              </span>
            </div>
            <div className="animate-fade-in-up animation-delay-2000">
              <span className="inline-block animate-shimmer animation-delay-4000 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                Crece con nosotros
              </span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-white/50 rounded-lg p-3 animate-float">
            <div className="text-purple-600 font-semibold text-xl">📈</div>
            <div className="text-gray-700 mt-1 font-medium">Alto alcance</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3 animate-float animation-delay-1000">
            <div className="text-pink-600 font-semibold text-xl">🎯</div>
            <div className="text-gray-700 mt-1 font-medium">Audiencia target</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3 animate-float animation-delay-2000">
            <div className="text-blue-600 font-semibold text-xl">💰</div>
            <div className="text-gray-700 mt-1 font-medium">Precios bajos</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3 animate-float animation-delay-3000">
            <div className="text-green-600 font-semibold text-xl">📊</div>
            <div className="text-gray-700 mt-1 font-medium">Métricas reales</div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="animate-pulse-cta">
          <Button
            onClick={handleContactClick}
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all duration-200 animate-glow"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ¡Contactar Ahora!
            </span>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Espacio publicitario disponible • Precios desde $50/mes
        </p>
      </div>
    </Card>
  );
};

export default AdvertisementSection;