/**
 * Create URL Page - Main page for URL shortening
 * Orchestrates the URL creation flow with proper state management
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../shared/components";
import { CreateUrlForm, UrlResult } from "./components";
import { useCreateUrl } from "./hooks/useCreateUrl";

const CreateUrlPage: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const { reset } = useCreateUrl();

  const handleSuccess = (originalUrlValue: string, generatedShortUrl: string) => {
    setOriginalUrl(originalUrlValue);
    setShortUrl(generatedShortUrl);
    setShowResult(true);
  };

  const handleCreateAnother = () => {
    setShowResult(false);
    setOriginalUrl("");
    setShortUrl(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shrt</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acorta tus URLs de manera rápida y sencilla. Compatible con RFC 1738
            y optimizado para compartir.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Content */}
          {!showResult || !shortUrl ? (
            <Card className="w-full" padding="lg" shadow="xl" rounded="2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Crear URL corta
                  </h2>
                  <p className="text-gray-600">
                    Ingresa la URL que deseas acortar y obten un enlace más
                    fácil de compartir
                  </p>
                </div>

                <CreateUrlForm
                  onSuccess={handleSuccess}
                  className="space-y-6"
                />
              </div>
            </Card>
          ) : (
            <UrlResult
              shortUrl={shortUrl}
              originalUrl={originalUrl}
              onReset={handleCreateAnother}
              className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500"
            />
          )}

          {/* Navigation */}
          <div className="flex justify-center space-x-8">
            <Link
              to="/urls"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Ver mis URLs
            </Link>

            <a
              href="https://www.rfc-editor.org/rfc/rfc1738.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors group"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Sobre RFC 1738
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">URLs Seguras</h3>
              <p className="text-sm text-gray-600">
                Validación completa según RFC 1738 para garantizar URLs seguras
                y válidas
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Estadísticas</h3>
              <p className="text-sm text-gray-600">
                Rastrea clicks y estadísticas detalladas de todas tus URLs
                acortadas
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Privacidad</h3>
              <p className="text-sm text-gray-600">
                Tus URLs están asociadas solo a tu dispositivo, sin necesidad de
                registro
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUrlPage;
