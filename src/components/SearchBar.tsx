import { MdClose } from "react-icons/md";

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
  const handleClear = () => {
    onChange("");
  };

  const showClearButton = value.length > 0;

  return (
    <div className="mb-6 relative">
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
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-gray-600 active:scale-90 transition-all duration-150 p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Clear search"
        >
          <MdClose className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
