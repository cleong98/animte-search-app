import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { useDebounceSearch } from "../hooks/useDebounceSearch";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setSearchQuery,
  setCurrentPage,
  setCachedData,
} from "../store/searchSlice";
import { animeApi } from "../api/animeApi";
import SearchBar from "../components/SearchBar";
import AnimeGrid from "../components/AnimeGrid";
import Pagination from "../components/Pagination";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";

function SearchPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const searchQuery = useAppSelector((state) => state.search.query);
  const currentPage = useAppSelector((state) => state.search.currentPage);
  const cachedQuery = useAppSelector((state) => state.search.cachedQuery);
  const cachedPage = useAppSelector((state) => state.search.cachedPage);
  const cachedData = useAppSelector((state) => state.search.cachedData);

  const { data, loading, error, execute } = useApi(animeApi.searchAnime);

  const dataQueryRef = useRef<string>("");
  const dataPageRef = useRef<number>(0);

  useDebounceSearch({
    searchQuery,
    currentPage,
    cachedQuery,
    cachedPage,
    hasCachedData: cachedData !== null,
    execute,
    delay: 250,
  });

  useEffect(() => {
    if (data) {
      dataQueryRef.current = searchQuery.trim();
      dataPageRef.current = currentPage;

      dispatch(
        setCachedData({
          query: searchQuery.trim(),
          page: currentPage,
          data,
        })
      );
    }
  }, [data, searchQuery, currentPage, dispatch]);

  const isDataFresh =
    data &&
    dataQueryRef.current === searchQuery.trim() &&
    dataPageRef.current === currentPage;

  const isCacheValid =
    cachedData &&
    cachedQuery === searchQuery.trim() &&
    cachedPage === currentPage;

  const displayData = isDataFresh ? data : isCacheValid ? cachedData : null;

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleAnimeClick = (id: number) => {
    navigate(`/${id}`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Anime Search</h1>

      <SearchBar value={searchQuery} onChange={handleSearchChange} />

      <div className="min-h-[400px]">
        {error && (
          <ErrorAlert
            message={error.message || "An error occurred. Please try again."}
            showRetry
            onRetry={() =>
              execute({ q: searchQuery.trim(), page: currentPage, limit: 25 })
            }
          />
        )}

        {!error && (
          <>
            {displayData && displayData.data.length === 0 && !loading ? (
              <EmptyState searchQuery={searchQuery.trim()} />
            ) : (
              <>
                <AnimeGrid
                  animes={displayData?.data}
                  onAnimeClick={handleAnimeClick}
                  isLoading={loading || !displayData}
                />

                {displayData && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={displayData.pagination.last_visible_page}
                    onPageChange={handlePageChange}
                    hasNextPage={displayData.pagination.has_next_page}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
