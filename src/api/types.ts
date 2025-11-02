// Anime object from Jikan API
export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  duration: string | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

// Search response
export interface AnimeSearchResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

// Single anime response
export interface AnimeDetailsResponse {
  data: Anime;
}

// Search params
export interface AnimeSearchParams {
  q: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
  type?: string;
  status?: string;
  rating?: string;
}

// Filter option types
export type AnimeType = "tv" | "movie" | "ova" | "special" | "ona" | "music" | "cm" | "pv" | "tv_special";
export type AnimeStatus = "airing" | "complete" | "upcoming";
export type AnimeRating = "g" | "pg" | "pg13" | "r17" | "r" | "rx";

// Filter options with labels
export interface FilterOption {
  value: string;
  label: string;
  description?: string;
}

export const TYPE_OPTIONS: FilterOption[] = [
  { value: "tv", label: "TV" },
  { value: "movie", label: "Movie" },
  { value: "ova", label: "OVA" },
  { value: "special", label: "Special" },
  { value: "ona", label: "ONA" },
  { value: "music", label: "Music" },
  { value: "cm", label: "CM" },
  { value: "pv", label: "PV" },
  { value: "tv_special", label: "TV Special" },
];

export const STATUS_OPTIONS: FilterOption[] = [
  { value: "airing", label: "Airing" },
  { value: "complete", label: "Complete" },
  { value: "upcoming", label: "Upcoming" },
];

export const RATING_OPTIONS: FilterOption[] = [
  { value: "g", label: "G - All Ages", description: "All Ages" },
  { value: "pg", label: "PG - Children", description: "Children" },
  { value: "pg13", label: "PG-13 - Teens 13+", description: "Teens 13 or older" },
  { value: "r17", label: "R-17+", description: "17+ (violence & profanity)" },
  { value: "r", label: "R+ - Mild Nudity", description: "Mild Nudity" },
  { value: "rx", label: "Rx - Hentai", description: "Hentai" },
];
