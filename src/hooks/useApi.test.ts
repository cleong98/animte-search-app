import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useApi } from './useApi';
import { AxiosError } from 'axios';

describe('useApi', () => {
  it('has correct initial state', () => {
    const mockApiFunction = vi.fn();
    const { result } = renderHook(() => useApi(mockApiFunction));

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.execute).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('sets loading to true when execute is called', async () => {
    const mockApiFunction = vi.fn().mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useApi(mockApiFunction));

    result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('sets data on successful API call', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockApiFunction = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });
  });

  it('sets error on failed API call', async () => {
    const mockError = new AxiosError('API Error');
    const mockApiFunction = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('handles cancelled requests without setting error', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({ data: null, cancelled: true });
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  it('reset clears all state', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockApiFunction = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    result.current.reset();

    await waitFor(() => {
      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it('handles multiple sequential calls correctly', async () => {
    const mockData1 = { id: 1, name: 'First' };
    const mockData2 = { id: 2, name: 'Second' };
    const mockApiFunction = vi
      .fn()
      .mockResolvedValueOnce(mockData1)
      .mockResolvedValueOnce(mockData2);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });

    expect(mockApiFunction).toHaveBeenCalledTimes(2);
  });

  it('passes parameters to API function correctly', async () => {
    const mockApiFunction = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute('param1', 123, { key: 'value' });

    expect(mockApiFunction).toHaveBeenCalledWith('param1', 123, { key: 'value' });
  });

  it('clears previous data when new request starts', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockApiFunction = vi.fn()
      .mockResolvedValueOnce(mockData)
      .mockResolvedValueOnce({ id: 2, name: 'New' });

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });

    // Start new request
    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2, name: 'New' });
    });
  });

  it('handles error after successful call', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockError = new AxiosError('Error');
    const mockApiFunction = vi
      .fn()
      .mockResolvedValueOnce(mockData)
      .mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toBe(null);
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('handles success after error call', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockError = new AxiosError('Error');
    const mockApiFunction = vi
      .fn()
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useApi(mockApiFunction));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBe(null);
    });

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });
  });
});
