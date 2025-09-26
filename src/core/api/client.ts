/**
 * HTTP Client for API communication
 * Handles authentication, error handling, and request/response processing
 */

import { HttpClient, HttpClientConfig, ApiError } from "../../shared/types";
import { getEnvVar } from "../../utils/env";

class ApiClient implements HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    // Use the environment utility for cross-environment compatibility
    const apiUrl = getEnvVar("VITE_API_URL", "/api");
    const requestTimeout = getEnvVar("VITE_REQUEST_TIMEOUT", "10000");


    this.baseURL = config.baseURL || apiUrl;
    this.timeout = config.timeout || parseInt(requestTimeout);
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
  }

  /**
   * Makes HTTP requests with proper error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Handle empty responses
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        // Return null instead of empty object to allow proper error handling
        return null as T;
      }

      const jsonResponse = await response.json();

      return jsonResponse;
    } catch (error) {
      if (error instanceof Error) {
        // Check for network/connection errors
        if (error.name === "AbortError") {
          throw new Error("Request timed out - please try again");
        }
        if (error.message.includes("fetch")) {
          throw new Error(
            "Unable to connect to server - please check your connection"
          );
        }
        throw new Error(`API Request failed: ${error.message}`);
      }
      throw new Error("Unknown API error occurred");
    }
  }

  /**
   * Handles error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      try {
        const errorData: ApiError = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      } catch (parseError) {
        // If JSON parsing fails, fall back to status text
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Sets authentication token for all requests
   */
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  /**
   * Sets device ID header for all requests
   */
  setDeviceId(deviceId: string): void {
    this.defaultHeaders["X-Device-ID"] = deviceId;
  }

  /**
   * Removes authentication token
   */
  clearAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  /**
   * Updates base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Gets current base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

export default apiClient;
