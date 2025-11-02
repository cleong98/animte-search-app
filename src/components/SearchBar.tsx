import { MdClose, MdFilterList } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilterPanel } from "../store/searchSlice";
import type { RootState } from "../store";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search for anime...",
}: SearchBarProps) {
  const dispatch = useDispatch();
  const { selectedType, selectedStatus, selectedRating } = useSelector(
    (state: RootState) => state.search
  );

  const handleClear = () => {
    onChange("");
  };

  const showClearButton = value.length > 0;
  const activeFilterCount =
    (selectedType ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedRating ? 1 : 0);

  return (
    <div className="mb-6 relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            className="input input-bordered w-full pr-12"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {showClearButton && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-base-content/60 hover:text-base-content/80 active:scale-90 transition-all duration-150 p-1 hover:bg-base-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Clear search"
            >
              <MdClose className="w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => dispatch(toggleFilterPanel())}
          className="relative btn btn-outline gap-2 min-w-fit"
          aria-label="Filter options"
        >
          <MdFilterList className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
