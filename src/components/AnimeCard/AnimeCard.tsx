import type { Anime } from "../../api/types";
import { useBreakpoint } from "../../hooks/useWindowSize";
import { useCardHover } from "./useCardHover";
import { CardSkeleton } from "./CardSkeleton";
import { CardImage } from "./CardImage";
import { TypeBadge, MembersBadge, ScoreBadge } from "./CardBadges";
import { ExpandedContent } from "./ExpandedContent";
import { formatMetadata } from "../../utils/format";

export interface AnimeCardProps {
  anime?: Anime;
  onClick?: (id: number) => void;
  isLoading?: boolean;
}

function AnimeCard({ anime, onClick, isLoading = false }: AnimeCardProps) {
  const { isMobile } = useBreakpoint();
  const { isHovered, handleMouseEnter, handleMouseLeave } = useCardHover({
    isMobile,
  });

  if (isLoading) {
    return <CardSkeleton />;
  }

  if (!anime) {
    return null;
  }

  const handleClick = () => {
    onClick?.(anime.mal_id);
  };

  const metadata = formatMetadata(anime.episodes, anime.year);

  const showExpandedContent = isHovered && !isMobile;
  const showInfoBelow = !showExpandedContent;

  return (
    <div className="card-wrapper">
      <div
        className={`card-image-container ${
          showExpandedContent ? "card-hover-expanded" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <CardImage
          imageUrl={anime.images.jpg.image_url}
          webpUrl={anime.images.webp.image_url}
          title={anime.title}
        />

        {!isHovered && (
          <>
            <div className="absolute inset-0 card-overlay"></div>

            {anime.type && (
              <div className="absolute top-3 left-3">
                <TypeBadge type={anime.type} />
              </div>
            )}
          </>
        )}

        <div className="absolute bottom-3 left-3 z-10">
          <MembersBadge members={anime.members} />
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <ScoreBadge score={anime.score} />
        </div>

        {showExpandedContent && (
          <ExpandedContent
            type={anime.type}
            title={anime.title}
            synopsis={anime.synopsis}
            episodes={anime.episodes}
            year={anime.year}
            genres={anime.genres}
          />
        )}
      </div>

      {/* Info Below Card - Hidden when hovering on desktop */}
      {showInfoBelow && (
        <div className="card-info-below">
          <h3>{anime.title}</h3>
          <p>{metadata}</p>
        </div>
      )}
    </div>
  );
}

export default AnimeCard;
