import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { RootState } from "../store";
import {
  setTypeFilter,
  setStatusFilter,
  setRatingFilter,
  toggleGenreFilter,
  clearAllFilters,
  toggleFilterPanel,
} from "../store/searchSlice";
import {
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  RATING_OPTIONS,
  type FilterOption,
  type Genre,
} from "../api/types";
import { animeApi } from "../api/animeApi";

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValue?: string;
  selectedValues?: number[];
  onChange?: (value: string) => void;
  onToggle?: (value: number) => void;
  multiSelect?: boolean;
}

const FilterSection = ({
  title,
  options,
  selectedValue,
  selectedValues = [],
  onChange,
  onToggle,
  multiSelect = false,
}: FilterSectionProps) => {
  const handleSelect = (value: string) => {
    if (!multiSelect && onChange) {
      // Single select: toggle if same value
      if (selectedValue === value) {
        onChange("");
      } else {
        onChange(value);
      }
    }
  };

  const handleToggle = (value: number) => {
    if (multiSelect && onToggle) {
      onToggle(value);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-base-content mb-3 text-sm">
        {title}
      </h3>
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2">
        {options.map((option) => {
          const value = multiSelect ? Number(option.value) : option.value;
          const isSelected = multiSelect
            ? selectedValues.includes(value as number)
            : selectedValue === option.value;

          return (
            <button
              key={option.value}
              onClick={() => multiSelect ? handleToggle(value as number) : handleSelect(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shrink-0 ${
                isSelected
                  ? "bg-primary hover:bg-primary-focus text-primary-content shadow-md"
                  : "bg-base-200 hover:bg-base-300 text-base-content"
              }`}
              title={option.description}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface FilterPanelProps {
  onApplyFilters: () => void;
}

export const FilterPanel = ({ onApplyFilters }: FilterPanelProps) => {
  const dispatch = useDispatch();
  const { isFilterOpen, selectedType, selectedStatus, selectedRating, selectedGenres } =
    useSelector((state: RootState) => state.search);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true);
      try {
        const response = await animeApi.getGenres();
        setGenres(response.data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  const handleApply = () => {
    onApplyFilters();
    dispatch(toggleFilterPanel());
  };

  const genreOptions: FilterOption[] = genres.map((genre) => ({
    value: String(genre.mal_id),
    label: genre.name,
  }));

  const totalFilters =
    (selectedType ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    selectedGenres.length;

  return (
    <>
      {/* Mobile backdrop - only show on mobile */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm animate-fade-in"
          onClick={() => dispatch(toggleFilterPanel())}
        />
      )}

      {/* Mobile: Fixed bottom modal */}
      {isFilterOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 h-[66vh] bg-base-100 rounded-t-2xl shadow-2xl border border-base-300 flex flex-col animate-slide-up md:hidden">
            {/* Header - mobile only */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  Filters
                </h2>
                {totalFilters > 0 && (
                  <p className="text-sm text-base-content/60">
                    {totalFilters} filter{totalFilters !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
              <button
                onClick={() => dispatch(toggleFilterPanel())}
                className="p-2 hover:bg-base-200 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <MdClose className="w-6 h-6 text-base-content" />
              </button>
            </div>
            {/* Mobile scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 bg-base-100">
              <div className="space-y-4">
                <FilterSection
                  title="Type"
                  options={TYPE_OPTIONS}
                  selectedValue={selectedType}
                  onChange={(value) => dispatch(setTypeFilter(value))}
                />
                <FilterSection
                  title="Status"
                  options={STATUS_OPTIONS}
                  selectedValue={selectedStatus}
                  onChange={(value) => dispatch(setStatusFilter(value))}
                />
                <FilterSection
                  title="Rating"
                  options={RATING_OPTIONS}
                  selectedValue={selectedRating}
                  onChange={(value) => dispatch(setRatingFilter(value))}
                />
                {!isLoadingGenres && genreOptions.length > 0 && (
                  <FilterSection
                    title="Genres"
                    options={genreOptions}
                    selectedValues={selectedGenres}
                    onToggle={(genreId) => dispatch(toggleGenreFilter(genreId))}
                    multiSelect={true}
                  />
                )}
              </div>
            </div>
            {/* Mobile footer */}
            <div className="p-3 border-t border-base-300 bg-base-100">
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleApply}
                  className="btn btn-primary btn-sm font-semibold"
                >
                  Apply Filters
                </button>
                {totalFilters > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="btn btn-outline btn-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <MdClose className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Desktop: In-flow panel wrapper with max-height transition */}
      <div
        className={`
          hidden md:block
          overflow-hidden transition-all duration-300 ease-in-out
          ${isFilterOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        {/* Desktop panel content */}
        <div className="bg-base-100 rounded-lg border border-base-300 mb-6 flex flex-col">
          {/* Desktop content - scrollable with max height */}
          <div className="p-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            <FilterSection
              title="Type"
              options={TYPE_OPTIONS}
              selectedValue={selectedType}
              onChange={(value) => dispatch(setTypeFilter(value))}
            />

            <FilterSection
              title="Status"
              options={STATUS_OPTIONS}
              selectedValue={selectedStatus}
              onChange={(value) => dispatch(setStatusFilter(value))}
            />

            <FilterSection
              title="Rating"
              options={RATING_OPTIONS}
              selectedValue={selectedRating}
              onChange={(value) => dispatch(setRatingFilter(value))}
            />

            {!isLoadingGenres && genreOptions.length > 0 && (
              <FilterSection
                title="Genres"
                options={genreOptions}
                selectedValues={selectedGenres}
                onToggle={(genreId) => dispatch(toggleGenreFilter(genreId))}
                multiSelect={true}
              />
            )}
          </div>
          </div>

          {/* Desktop footer */}
          <div className="p-3 border-t border-base-300 bg-base-100">
            <div className="flex flex-row gap-3">
              <button
                onClick={handleApply}
                className="flex-1 btn btn-primary btn-md font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Apply Filters
              </button>
              {totalFilters > 0 && (
                <button
                  onClick={handleClearAll}
                  className="btn btn-outline btn-md font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MdClose className="w-5 h-5" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* End desktop wrapper */}
    </>
  );
};
