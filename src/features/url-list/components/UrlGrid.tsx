/**
 * URL Grid component - Displays URLs in a responsive grid layout
 */

import React from 'react';
import { Spinner } from '../../../shared/components';
import { Url } from '../../../shared/types';
import UrlCard from './UrlCard';

interface UrlGridProps {
  urls: Url[];
  loading?: boolean;
  onUpdate?: (id: number, newUrl: string) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  className?: string;
}

const UrlGrid: React.FC<UrlGridProps> = ({
  urls,
  loading = false,
  onUpdate,
  onDelete,
  className
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay URLs acortadas aún
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza creando tu primera URL acortada
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {urls.map((url) => (
        <UrlCard
          key={url.id}
          url={url}
          onUpdate={onUpdate}
          onDelete={onDelete}
          className="h-fit"
        />
      ))}
    </div>
  );
};

export default UrlGrid;