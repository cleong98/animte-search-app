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
import AppBar from "../components/AppBar";
import SearchBar from "../components/SearchBar";
import AnimeGrid from "../components/AnimeGrid";
import Pagination from "../components/Pagination";
import ErrorAlert from "../components/ErrorAlert";
import EmptyState from "../components/EmptyState";
import { FilterPanel } from "../components/FilterPanel";

function SearchPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get state from Redux
  const searchQuery = useAppSelector((state) => state.search.query);
  const currentPage = useAppSelector((state) => state.search.currentPage);
  const cachedQuery = useAppSelector((state) => state.search.cachedQuery);
  const cachedPage = useAppSelector((state) => state.search.cachedPage);
  const cachedData = useAppSelector((state) => state.search.cachedData);
  const selectedType = useAppSelector((state) => state.search.selectedType);
  const selectedStatus = useAppSelector((state) => state.search.selectedStatus);
  const selectedRating = useAppSelector((state) => state.search.selectedRating);
  const cachedType = useAppSelector((state) => state.search.cachedType);
  const cachedStatus = useAppSelector((state) => state.search.cachedStatus);
  const cachedRating = useAppSelector((state) => state.search.cachedRating);

  const { data, loading, error, execute } = useApi(animeApi.searchAnime);

  const dataQueryRef = useRef<string>("");
  const dataPageRef = useRef<number>(0);
  const dataTypeRef = useRef<string>("");
  const dataStatusRef = useRef<string>("");
  const dataRatingRef = useRef<string>("");

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
      dataTypeRef.current = selectedType;
      dataStatusRef.current = selectedStatus;
      dataRatingRef.current = selectedRating;

      dispatch(
        setCachedData({
          query: searchQuery.trim(),
          page: currentPage,
          data,
          type: selectedType,
          status: selectedStatus,
          rating: selectedRating,
        })
      );
    }
  }, [data, searchQuery, currentPage, selectedType, selectedStatus, selectedRating, dispatch]);

  const isDataFresh =
    data &&
    dataQueryRef.current === searchQuery.trim() &&
    dataPageRef.current === currentPage &&
    dataTypeRef.current === selectedType &&
    dataStatusRef.current === selectedStatus &&
    dataRatingRef.current === selectedRating;

  const isCacheValid =
    cachedData &&
    cachedQuery === searchQuery.trim() &&
    cachedPage === currentPage &&
    cachedType === selectedType &&
    cachedStatus === selectedStatus &&
    cachedRating === selectedRating;

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

  const handleApplyFilters = () => {
    execute({
      q: searchQuery.trim(),
      page: currentPage,
      limit: 25,
      type: selectedType,
      status: selectedStatus,
      rating: selectedRating,
    });
  };

  return (
    <>
      <AppBar title="Anime App" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="relative">
          <SearchBar value={searchQuery} onChange={handleSearchChange} />
          <FilterPanel onApplyFilters={handleApplyFilters} />
        </div>

        <div className="min-h-[400px]">
          {error && (
            <ErrorAlert
              message={error.message || "An error occurred. Please try again."}
              showRetry
              onRetry={() =>
                execute({
                  q: searchQuery.trim(),
                  page: currentPage,
                  limit: 25,
                  type: selectedType,
                  status: selectedStatus,
                  rating: selectedRating,
                })
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
    </>
  );
}

export default SearchPage;
