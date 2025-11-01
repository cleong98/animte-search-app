import type { Anime } from "../api/types";
import { MdPeople, MdStar } from "react-icons/md";

interface AnimeCardProps {
  anime?: Anime;
  onClick?: (id: number) => void;
  isLoading?: boolean;
}

function AnimeCard({ anime, onClick, isLoading = false }: AnimeCardProps) {
  if (isLoading) {
    return (
      <div className="relative h-96 rounded-lg overflow-hidden bg-base-200 shadow-xl">
        <div className="skeleton h-full w-full"></div>
      </div>
    );
  }

  if (!anime) {
    return null;
  }

  const formatMembers = (members: number | null) => {
    if (!members) return "N/A";
    if (members >= 1000000) return `${(members / 1000000).toFixed(1)}M`;
    if (members >= 1000) return `${(members / 1000).toFixed(1)}K`;
    return members.toString();
  };

  return (
    <div
      className="relative h-96 rounded-lg overflow-hidden shadow-xl cursor-pointer group"
      onClick={() => onClick?.(anime.mal_id)}
    >
      {/* Background Image */}
      <picture>
        <source srcSet={anime.images.webp.image_url} type="image/webp" />
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </picture>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
        {/* Members Badge */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
          <MdPeople className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-semibold">
            {formatMembers(anime.members)}
          </span>
        </div>

        {/* Score Badge */}
        {anime.score && (
          <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <MdStar className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold">{anime.score}</span>
          </div>
        )}
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Title */}
        <h2 className="text-white font-bold text-lg mb-2 line-clamp-2">
          {anime.title}
        </h2>

        {/* Synopsis */}
        {anime.synopsis && (
          <p className="text-gray-200 text-xs mb-3 line-clamp-3">
            {anime.synopsis}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          {anime.type && <span className="bg-white/10 px-2 py-1 rounded">{anime.type}</span>}
          {anime.episodes && <span className="bg-white/10 px-2 py-1 rounded">{anime.episodes} eps</span>}
          {anime.year && <span className="bg-white/10 px-2 py-1 rounded">{anime.year}</span>}
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;
