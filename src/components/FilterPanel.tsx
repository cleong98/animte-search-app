import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import type { RootState } from "../store";
import {
  setTypeFilter,
  setStatusFilter,
  setRatingFilter,
  clearAllFilters,
  toggleFilterPanel,
} from "../store/searchSlice";
import {
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  RATING_OPTIONS,
  type FilterOption,
} from "../api/types";

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const FilterSection = ({
  title,
  options,
  selectedValue,
  onChange,
}: FilterSectionProps) => {
  const handleSelect = (value: string) => {
    // Toggle: if clicking the same value, deselect it
    if (selectedValue === value) {
      onChange("");
    } else {
      onChange(value);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-base-content mb-3 text-sm">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
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
  const { isFilterOpen, selectedType, selectedStatus, selectedRating } =
    useSelector((state: RootState) => state.search);

  const handleClearAll = () => {
    dispatch(clearAllFilters());
  };

  const handleApply = () => {
    onApplyFilters();
    dispatch(toggleFilterPanel());
  };

  const totalFilters =
    (selectedType ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedRating ? 1 : 0);

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
        <div className="bg-base-100 rounded-lg border border-base-300 mb-6">
          {/* Desktop content */}
          <div className="p-4">
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
