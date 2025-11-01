import type { AnimeSearchResponse, Anime, AnimeDetailsResponse } from '../api/types';

export const mockAnime: Anime = {
  mal_id: 1,
  url: 'https://myanimelist.net/anime/1',
  images: {
    jpg: {
      image_url: 'https://cdn.myanimelist.net/images/anime/1/1.jpg',
      small_image_url: 'https://cdn.myanimelist.net/images/anime/1/1.jpg',
      large_image_url: 'https://cdn.myanimelist.net/images/anime/1/1.jpg',
    },
    webp: {
      image_url: 'https://cdn.myanimelist.net/images/anime/1/1.webp',
      small_image_url: 'https://cdn.myanimelist.net/images/anime/1/1.webp',
      large_image_url: 'https://cdn.myanimelist.net/images/anime/1/1.webp',
    },
  },
  title: 'Test Anime',
  title_english: 'Test Anime EN',
  title_japanese: 'テストアニメ',
  type: 'TV',
  source: 'Manga',
  episodes: 24,
  status: 'Finished Airing',
  airing: false,
  aired: {
    from: '2020-01-01T00:00:00+00:00',
    to: '2020-06-30T00:00:00+00:00',
    string: 'Jan 1, 2020 to Jun 30, 2020',
  },
  duration: '24 min per ep',
  rating: 'PG-13 - Teens 13 or older',
  score: 8.5,
  scored_by: 100000,
  rank: 100,
  popularity: 50,
  members: 200000,
  favorites: 5000,
  synopsis: 'This is a test anime synopsis.',
  background: 'This is test background information.',
  season: 'winter',
  year: 2020,
  broadcast: {
    day: 'Sundays',
    time: '00:00',
    timezone: 'Asia/Tokyo',
    string: 'Sundays at 00:00 (JST)',
  },
  producers: [
    { mal_id: 1, type: 'anime', name: 'Test Producer', url: 'https://myanimelist.net/anime/producer/1' },
  ],
  licensors: [
    { mal_id: 2, type: 'anime', name: 'Test Licensor', url: 'https://myanimelist.net/anime/licensor/2' },
  ],
  studios: [
    { mal_id: 3, type: 'anime', name: 'Test Studio', url: 'https://myanimelist.net/anime/studio/3' },
  ],
  genres: [
    { mal_id: 1, type: 'anime', name: 'Action', url: 'https://myanimelist.net/anime/genre/1' },
    { mal_id: 2, type: 'anime', name: 'Adventure', url: 'https://myanimelist.net/anime/genre/2' },
  ],
  demographics: [
    { mal_id: 27, type: 'anime', name: 'Shounen', url: 'https://myanimelist.net/anime/genre/27' },
  ],
};

export const mockAnime2: Anime = {
  ...mockAnime,
  mal_id: 2,
  title: 'Another Test Anime',
  title_english: 'Another Test Anime EN',
  score: 7.5,
};

export const mockSearchResponse: AnimeSearchResponse = {
  data: [mockAnime, mockAnime2],
  pagination: {
    last_visible_page: 10,
    has_next_page: true,
    current_page: 1,
    items: {
      count: 2,
      total: 250,
      per_page: 25,
    },
  },
};

export const mockEmptySearchResponse: AnimeSearchResponse = {
  data: [],
  pagination: {
    last_visible_page: 1,
    has_next_page: false,
    current_page: 1,
    items: {
      count: 0,
      total: 0,
      per_page: 25,
    },
  },
};

export const mockAnimeDetailsResponse: AnimeDetailsResponse = {
  data: mockAnime,
};
