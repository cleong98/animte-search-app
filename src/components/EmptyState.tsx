import { MdSearchOff } from "react-icons/md";

interface EmptyStateProps {
  searchQuery?: string;
}

function EmptyState({ searchQuery }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 mb-4">
        <MdSearchOff className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Anime Found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        {searchQuery ? (
          <>
            We couldn't find any anime matching{" "}
            <span className="font-medium text-gray-700">"{searchQuery}"</span>.
            Try searching with different keywords.
          </>
        ) : (
          "Start searching for your favorite anime using the search bar above."
        )}
      </p>
    </div>
  );
}

export default EmptyState;
