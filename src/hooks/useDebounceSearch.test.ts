import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounceSearch } from "./useDebounceSearch";

describe("useDebounceSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("debounces search queries with 250ms delay", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ searchQuery }) =>
        useDebounceSearch({
          searchQuery,
          currentPage: 1,
          cachedQuery: "",
          cachedPage: 0,
          hasCachedData: false,
          execute,
          delay: 250,
        }),
      { initialProps: { searchQuery: "" } }
    );

    // Type "naruto" character by character
    rerender({ searchQuery: "n" });
    rerender({ searchQuery: "na" });
    rerender({ searchQuery: "nar" });
    rerender({ searchQuery: "naru" });
    rerender({ searchQuery: "narut" });
    rerender({ searchQuery: "naruto" });

    // Before 250ms, execute should not be called
    vi.advanceTimersByTime(249);
    expect(execute).not.toHaveBeenCalled();

    // After 250ms, execute should be called once with final value
    vi.advanceTimersByTime(1);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      q: "naruto",
      page: 1,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });

  it("uses custom delay when provided", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "test",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 500, // Custom delay
      })
    );

    // Should not execute at 250ms
    vi.advanceTimersByTime(250);
    expect(execute).not.toHaveBeenCalled();

    // Should execute at 500ms
    vi.advanceTimersByTime(250);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("cancels previous request when new search initiated", () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const abortSignals: AbortSignal[] = [];

    execute.mockImplementation((params) => {
      abortSignals.push(params.signal);
      return Promise.resolve();
    });

    const { rerender } = renderHook(
      ({ searchQuery }) =>
        useDebounceSearch({
          searchQuery,
          currentPage: 1,
          cachedQuery: "",
          cachedPage: 0,
          hasCachedData: false,
          execute,
          delay: 250,
        }),
      { initialProps: { searchQuery: "first" } }
    );

    vi.advanceTimersByTime(250);
    expect(abortSignals[0]?.aborted).toBe(false);

    // Change search query
    rerender({ searchQuery: "second" });

    // First request should be aborted
    expect(abortSignals[0]?.aborted).toBe(true);

    vi.advanceTimersByTime(250);
    expect(abortSignals[1]?.aborted).toBe(false);
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it("skips API call when cache is valid", () => {
    const execute = vi.fn();

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "naruto",
        currentPage: 1,
        cachedQuery: "naruto",
        cachedPage: 1,
        hasCachedData: true,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect(execute).not.toHaveBeenCalled();
  });

  it("makes API call when query changes from cache", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "onepiece",
        currentPage: 1,
        cachedQuery: "naruto",
        cachedPage: 1,
        hasCachedData: true,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      q: "onepiece",
      page: 1,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });

  it("makes API call when page changes from cache", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "naruto",
        currentPage: 2,
        cachedQuery: "naruto",
        cachedPage: 1,
        hasCachedData: true,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      q: "naruto",
      page: 2,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });

  it("trims whitespace from search query", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "  naruto  ",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect(execute).toHaveBeenCalledWith({
      q: "naruto",
      page: 1,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });

  it("handles empty search query", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect(execute).toHaveBeenCalledWith({
      q: "",
      page: 1,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });

  it("cleanup aborts pending request on unmount", () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    let capturedSignal: AbortSignal | null = null;

    execute.mockImplementation((params) => {
      capturedSignal = params.signal;
      return Promise.resolve();
    });

    const { unmount } = renderHook(() =>
      useDebounceSearch({
        searchQuery: "test",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);
    expect((capturedSignal as unknown as AbortSignal)?.aborted).toBe(false);

    unmount();
    expect((capturedSignal as unknown as AbortSignal)?.aborted).toBe(true);
  });

  it("cleanup clears timeout on unmount before execution", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    const { unmount } = renderHook(() =>
      useDebounceSearch({
        searchQuery: "test",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(100);
    unmount();
    vi.advanceTimersByTime(200);

    expect(execute).not.toHaveBeenCalled();
  });

  it("passes AbortSignal to execute function", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    renderHook(() =>
      useDebounceSearch({
        searchQuery: "test",
        currentPage: 1,
        cachedQuery: "",
        cachedPage: 0,
        hasCachedData: false,
        execute,
        delay: 250,
      })
    );

    vi.advanceTimersByTime(250);

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
  });

  it("handles rapid page changes correctly", () => {
    const execute = vi.fn().mockResolvedValue(undefined);

    const { rerender } = renderHook(
      ({ currentPage }) =>
        useDebounceSearch({
          searchQuery: "naruto",
          currentPage,
          cachedQuery: "",
          cachedPage: 0,
          hasCachedData: false,
          execute,
          delay: 250,
        }),
      { initialProps: { currentPage: 1 } }
    );

    // Rapidly change pages
    rerender({ currentPage: 2 });
    rerender({ currentPage: 3 });
    rerender({ currentPage: 4 });

    // Before 250ms, no calls
    vi.advanceTimersByTime(249);
    expect(execute).not.toHaveBeenCalled();

    // After 250ms, only final page should be called
    vi.advanceTimersByTime(1);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      q: "naruto",
      page: 4,
      limit: 25,
      signal: expect.any(AbortSignal),
    });
  });
});
