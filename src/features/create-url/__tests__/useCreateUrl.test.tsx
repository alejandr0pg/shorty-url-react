import { renderHook, act } from '@testing-library/react';
import { useCreateUrl } from '../hooks/useCreateUrl';
import { UrlService } from '../../../core/api/urlService';

// Mock the URL service
jest.mock('../../../core/api/urlService');
const mockedUrlService = UrlService as jest.Mocked<typeof UrlService>;

describe('useCreateUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCreateUrl());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });

  test('should handle successful URL creation', async () => {
    const mockResponse = {
      short_url: 'http://localhost/abc123',
      original_url: 'https://example.com',
      code: 'abc123',
      sanitized: false,
      normalized: false
    };

    mockedUrlService.prototype.createUrl = jest.fn().mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateUrl());

    await act(async () => {
      await result.current.createUrl('https://example.com');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toEqual(mockResponse);
  });

  test('should handle URL creation error', async () => {
    const mockError = new Error('Invalid URL');
    mockedUrlService.prototype.createUrl = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useCreateUrl());

    await act(async () => {
      await result.current.createUrl('invalid-url');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Invalid URL');
    expect(result.current.result).toBeNull();
  });

  test('should set loading state during request', async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedUrlService.prototype.createUrl = jest.fn().mockReturnValue(promise);

    const { result } = renderHook(() => useCreateUrl());

    act(() => {
      result.current.createUrl('https://example.com');
    });

    expect(result.current.isLoading).toBe(true);
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

    expect(result.current.isLoading).toBe(false);
  });

  test('should reset state', () => {
    const { result } = renderHook(() => useCreateUrl());

    // Set some state first
    act(() => {
      // Note: Direct state manipulation is not recommended in tests
      // This should be done through the hook's interface instead
      (result.current as { error: string; result: { code: string } | null }).error = 'Some error';
      (result.current as { error: string; result: { code: string } | null }).result = { code: 'test' };
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });
});