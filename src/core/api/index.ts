/**
 * API layer barrel exports
 * Provides a clean interface to all API services
 */

export { apiClient, default as client } from './client';
export { urlService, UrlService, default as urls } from './urlService';

// Initialize API client with device ID
import { apiClient } from './client';

// Set device ID on initialization
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Configure API client
apiClient.setDeviceId(getDeviceId());