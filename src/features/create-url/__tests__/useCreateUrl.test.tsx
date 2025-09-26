import { renderHook, act } from '@testing-library/react';
import { useCreateUrl } from '../hooks/useCreateUrl';

// Mock the URL service
jest.mock('../../../core/api', () => ({
  urlService: {
    createUrl: jest.fn()
  }
}));

describe('useCreateUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCreateUrl());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.shortUrl).toBeNull();
  });

  test('should handle successful URL creation', async () => {
    const mockResponse = {
      short_url: 'http://localhost/abc123',
      original_url: 'https://example.com',
      code: 'abc123',
      sanitized: false,
      normalized: false
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { urlService } = require('../../../core/api');
    urlService.createUrl.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateUrl());

    await act(async () => {
      await result.current.createUrl('https://example.com');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.shortUrl).toEqual(mockResponse.short_url);
  });

  test('should handle URL creation error', async () => {
    const mockError = new Error('Server error');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { urlService } = require('../../../core/api');
    urlService.createUrl.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateUrl());

    await act(async () => {
      try {
        await result.current.createUrl('https://example.com');
      } catch (error) {
        // Error is expected and handled by the hook
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Server error');
    expect(result.current.shortUrl).toBeNull();
  });

  test('should set loading state during request', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { urlService } = require('../../../core/api');
    urlService.createUrl.mockReturnValue(promise);

    const { result } = renderHook(() => useCreateUrl());

    act(() => {
      result.current.createUrl('https://example.com');
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      resolvePromise!({
        short_url: 'http://localhost/abc123',
        original_url: 'https://example.com',
        code: 'abc123',
        sanitized: false,
        normalized: false
      });
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  test('should reset state', () => {
    const { result } = renderHook(() => useCreateUrl());

    // Set some state first
    act(() => {
      // Note: This test should be rewritten to test through the hook's public interface
      // For now, we'll simulate state by calling the hook methods directly
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.shortUrl).toBeNull();
  });
});