/**
 * Custom hook for managing URLs list with CRUD operations
 */

import { useState, useCallback, useEffect } from 'react';
import { urlService } from '../../../core/api';
import { Url, UseUrlsResult, UpdateUrlRequest } from '../../../shared/types';
import { ERROR_MESSAGES } from '../../../core/constants/config';

export const useUrls = (): UseUrlsResult => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const data = await urlService.getUrls();
      setUrls(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUrl = useCallback(async (id: number, data: UpdateUrlRequest): Promise<void> => {
    try {
      const updatedUrl = await urlService.updateUrl(id, data);
      setUrls(prevUrls =>
        prevUrls.map(url => url.id === id ? updatedUrl : url)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      throw new Error(errorMessage);
    }
  }, []);

  const deleteUrl = useCallback(async (id: number): Promise<void> => {
    try {
      await urlService.deleteUrl(id);
      setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      throw new Error(errorMessage);
    }
  }, []);

  // Load URLs on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    urls,
    loading,
    error,
    refetch,
    updateUrl,
    deleteUrl
  };
};

export default useUrls;