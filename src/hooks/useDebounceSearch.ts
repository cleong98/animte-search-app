import { useEffect, useRef } from "react";
import type { AnimeSearchParams } from "../api/types";

interface UseDebounceSearchParams {
  searchQuery: string;
  currentPage: number;
  cachedQuery: string;
  cachedPage: number;
  hasCachedData: boolean;
  execute: (params: AnimeSearchParams) => Promise<void>;
  delay?: number;
}

export function useDebounceSearch({
  searchQuery,
  currentPage,
  cachedQuery,
  cachedPage,
  hasCachedData,
  execute,
  delay = 250,
}: UseDebounceSearchParams) {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Use refs for cache values so cache updates don't trigger re-fetch
  const cachedQueryRef = useRef(cachedQuery);
  const cachedPageRef = useRef(cachedPage);
  const hasCachedDataRef = useRef(hasCachedData);

  // Update refs when cache changes (doesn't trigger effect)
  cachedQueryRef.current = cachedQuery;
  cachedPageRef.current = cachedPage;
  hasCachedDataRef.current = hasCachedData;

  useEffect(() => {
    // Check if we have cached data for this exact query + page combination
    const isCacheValid =
      hasCachedDataRef.current &&
      searchQuery.trim() === cachedQueryRef.current &&
      currentPage === cachedPageRef.current;

    if (isCacheValid) {
      // Skip fetching, use cached data
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const timeoutId = setTimeout(() => {
      execute({
        q: searchQuery.trim(),
        page: currentPage,
        limit: 25,
        signal: abortController.signal,
      });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [searchQuery, currentPage, execute, delay]);
}
