import type { Anime } from "../api/types";
import AnimeCard from "./AnimeCard";

interface AnimeGridProps {
  animes?: Anime[];
  onAnimeClick?: (id: number) => void;
  isLoading?: boolean;
  skeletonCount?: number;
}

function AnimeGrid({
  animes,
  onAnimeClick,
  isLoading = false,
  skeletonCount = 8,
}: AnimeGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: skeletonCount }).map((_, index) => (
            <AnimeCard key={`skeleton-${index}`} isLoading />
          ))
        : animes?.map((anime) => (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              onClick={onAnimeClick}
            />
          ))}
    </div>
  );
}

export default AnimeGrid;
