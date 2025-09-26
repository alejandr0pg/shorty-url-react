/**
 * URL Service - Handles all URL-related API operations
 * Implements business logic for URL shortening, retrieval, and management
 */

import { apiClient } from './client';
import {
  Url,
  CreateUrlRequest,
  CreateUrlResponse,
  UpdateUrlRequest,
  LaravelPaginatedResponse
} from '../../shared/types';

export class UrlService {
  constructor() {
    // Ensure device ID is set on the API client
    this.initializeDeviceId();
  }

  /**
   * Creates a new shortened URL
   */
  async createUrl(request: CreateUrlRequest): Promise<CreateUrlResponse> {
    try {
      const response = await apiClient.post<CreateUrlResponse>('/urls', request);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create URL';
      throw new Error(message);
    }
  }

  /**
   * Retrieves all URLs for the current device
   */
  async getUrls(): Promise<Url[]> {
    try {
      const response = await apiClient.get<LaravelPaginatedResponse<Url> | Url[]>('/urls');

      // Handle paginated response from Laravel
      if (response && typeof response === 'object' && 'data' in response) {
        const paginatedResponse = response as LaravelPaginatedResponse<Url>;
        return Array.isArray(paginatedResponse.data) ? paginatedResponse.data : [];
      }

      // Handle direct array response
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch URLs';
      throw new Error(message);
    }
  }

  /**
   * Retrieves a specific URL by ID
   */
  async getUrlById(id: number): Promise<Url> {
    try {
      const response = await apiClient.get<Url>(`/urls/${id}`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch URL';
      throw new Error(message);
    }
  }

  /**
   * Updates an existing URL
   */
  async updateUrl(id: number, request: UpdateUrlRequest): Promise<Url> {
    try {
      const response = await apiClient.put<Url>(`/urls/${id}`, request);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update URL';
      throw new Error(message);
    }
  }

  /**
   * Deletes a URL
   */
  async deleteUrl(id: number): Promise<void> {
    try {
      await apiClient.delete(`/urls/${id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete URL';
      throw new Error(message);
    }
  }

  /**
   * Gets URL statistics
   */
  async getUrlStats(id: number): Promise<{ clicks: number; lastClicked?: string }> {
    try {
      const response = await apiClient.get<{ clicks: number; lastClicked?: string }>(`/urls/${id}/stats`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch URL stats';
      throw new Error(message);
    }
  }

  /**
   * Resolves a short code to get the destination URL
   */
  async resolveShortCode(code: string): Promise<{ original_url: string; short_url: string }> {
    try {
      const response = await apiClient.get<{ original_url: string; short_url: string }>(`/resolve/${code}`);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve short code';
      throw new Error(message);
    }
  }

  /**
   * Checks if a short code is available
   */
  async isShortCodeAvailable(code: string): Promise<boolean> {
    try {
      await apiClient.get(`/urls/check/${code}`);
      return false; // If request succeeds, code exists
    } catch {
      return true; // If request fails, code is available
    }
  }

  /**
   * Validates a URL before shortening
   */
  async validateUrl(url: string): Promise<{ valid: boolean; message?: string }> {
    try {
      const response = await apiClient.post<{ valid: boolean; message?: string }>('/urls/validate', { url });
      return response;
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : 'URL validation failed'
      };
    }
  }

  /**
   * Bulk operations for URLs
   */
  async bulkDelete(ids: number[]): Promise<void> {
    try {
      await apiClient.delete('/urls/bulk', {
        body: JSON.stringify({ ids })
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete URLs';
      throw new Error(message);
    }
  }

  /**
   * Export URLs data
   */
  async exportUrls(format: 'csv' | 'json' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(apiClient.getBaseURL() + `/urls/export?format=${format}`, {
        headers: {
          'X-Device-ID': this.getDeviceId()
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to export URLs';
      throw new Error(message);
    }
  }

  /**
   * Search URLs
   */
  async searchUrls(query: string, limit?: number): Promise<Url[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(limit && { limit: limit.toString() })
      });

      const response = await apiClient.get<Url[]>(`/urls/search?${params}`);
      // Ensure response is always an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search URLs';
      throw new Error(message);
    }
  }

  /**
   * Initializes device ID and sets it on the API client
   */
  private initializeDeviceId(): void {
    const deviceId = this.getDeviceId();
    apiClient.setDeviceId(deviceId);
  }

  /**
   * Gets device ID from localStorage
   */
  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }
}

// Create and export singleton instance
export const urlService = new UrlService();

export default urlService;