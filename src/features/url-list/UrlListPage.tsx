/**
 * URL List Page - Displays and manages all shortened URLs
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, Alert } from '../../shared/components';
import { UrlGrid, SearchBar } from './components';
import { useUrls } from './hooks/useUrls';
import { ROUTES } from '../../core/constants/config';

const UrlListPage: React.FC = () => {
  const { urls, loading, error, refetch, updateUrl, deleteUrl } = useUrls();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter URLs based on search term
  const filteredUrls = useMemo(() => {
    if (!searchTerm.trim()) return urls;

    const term = searchTerm.toLowerCase();
    return urls.filter(url =>
      url.original_url.toLowerCase().includes(term) ||
      url.short_code.toLowerCase().includes(term)
    );
  }, [urls, searchTerm]);

  const handleUpdate = async (id: number, newUrl: string): Promise<void> => {
    await updateUrl(id, { original_url: newUrl });
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteUrl(id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mis URLs Acortadas
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona y rastrea todas tus URLs acortadas
          </p>
        </header>

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <Link to={ROUTES.HOME}>
                <Button
                  variant="primary"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Nueva URL
                </Button>
              </Link>

              <Button
                onClick={handleRefresh}
                variant="ghost"
                disabled={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Actualizar
              </Button>

              {/* Stats */}
              {!loading && (
                <div className="hidden sm:flex items-center text-sm text-gray-600">
                  <span className="font-medium">{filteredUrls.length}</span>
                  <span className="mx-1">de</span>
                  <span className="font-medium">{urls.length}</span>
                  <span className="ml-1">URLs</span>
                </div>
              )}
            </div>

            {/* Search */}
            <div className="w-full sm:w-80">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={handleClearSearch}
                placeholder="Buscar por URL o código..."
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert
              variant="error"
              title="Error al cargar URLs"
              onClose={handleRefresh}
            >
              {error}
              <div className="mt-2">
                <Button
                  onClick={handleRefresh}
                  variant="ghost"
                  size="sm"
                >
                  Reintentar
                </Button>
              </div>
            </Alert>
          )}

          {/* Search Results Info */}
          {searchTerm && !loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    {filteredUrls.length === 0
                      ? 'No se encontraron resultados'
                      : `${filteredUrls.length} resultado${filteredUrls.length === 1 ? '' : 's'} encontrado${filteredUrls.length === 1 ? '' : 's'}`
                    }
                  </span>
                </div>
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            </div>
          )}

          {/* URL Grid */}
          <UrlGrid
            urls={filteredUrls}
            loading={loading}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />

          {/* Empty State for Search */}
          {searchTerm && filteredUrls.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta con otros términos de búsqueda o{' '}
                <button
                  onClick={handleClearSearch}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  limpia la búsqueda
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlListPage;