import React, { useState } from 'react';
import { getEnvVar } from '../utils/env';

interface VersionInfoProps {
  className?: string;
}

export const VersionInfo: React.FC<VersionInfoProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use the environment utility for cross-environment compatibility
  const version = getEnvVar('VITE_APP_VERSION', 'dev');
  const buildTime = getEnvVar('VITE_BUILD_TIME', new Date().toISOString());
  const environment = getEnvVar('VITE_APP_ENV', 'development');
  const commitHash = getEnvVar('VITE_COMMIT_HASH', 'unknown');
  const commitMessage = getEnvVar('VITE_COMMIT_MESSAGE', 'No commit message');
  const branch = getEnvVar('VITE_GIT_BRANCH', 'unknown');

  const getEnvironmentColor = () => {
    switch (environment) {
      case 'production':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div
        className={`
          border rounded-lg shadow-lg backdrop-blur-sm cursor-pointer transition-all duration-300
          ${getEnvironmentColor()}
          ${isExpanded ? 'p-4 min-w-80' : 'p-2 px-3'}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Click para ver detalles de la versión"
      >
        {!isExpanded ? (
          <div className="flex items-center space-x-2 text-sm font-mono">
            <span className="font-semibold">{environment}</span>
            <span>v{version}</span>
            <span className="text-xs opacity-75">#{commitHash.substring(0, 7)}</span>
          </div>
        ) : (
          <div className="text-xs font-mono space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">{environment.toUpperCase()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="space-y-1.5 border-t pt-2 border-current/20">
              <div className="flex justify-between">
                <span className="opacity-75">Version:</span>
                <span className="font-semibold">v{version}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-75">Commit:</span>
                <span className="font-semibold">#{commitHash.substring(0, 7)}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-75">Branch:</span>
                <span className="font-semibold">{branch}</span>
              </div>

              <div className="flex justify-between">
                <span className="opacity-75">Build:</span>
                <span className="font-semibold">{formatDate(buildTime)}</span>
              </div>

              {commitMessage && commitMessage !== 'No commit message' && (
                <div className="pt-2 border-t border-current/20">
                  <div className="opacity-75 mb-1">Mensaje:</div>
                  <div className="text-xs bg-black/5 rounded p-2 break-words">
                    {commitMessage.length > 100
                      ? `${commitMessage.substring(0, 100)}...`
                      : commitMessage
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionInfo;