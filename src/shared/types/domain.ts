/**
 * Domain entities and business objects
 */

export interface Url {
  id: number;
  original_url: string;
  short_code: string;
  device_id: string;
  clicks: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface UrlCreationData {
  original_url: string;
  device_id: string;
}

export interface UrlUpdateData {
  original_url?: string;
  expires_at?: string;
}