import apiClient from "./client";
import type {
  AnimeSearchResponse,
  AnimeDetailsResponse,
  AnimeSearchParams,
} from "./types";

interface AnimeApi {
  searchAnime: (params: AnimeSearchParams) => Promise<AnimeSearchResponse>;
  getAnimeById: (id: number) => Promise<AnimeDetailsResponse>;
}

interface SearchRequestParams {
  q?: string;
  page: number;
  limit: number;
}

export const animeApi: AnimeApi = {
  searchAnime: async (params: AnimeSearchParams) => {
    const searchParams: SearchRequestParams = {
      page: params.page || 1,
      limit: params.limit || 25,
    };
    if (params.q) {
      searchParams.q = params.q;
    }
    const response = await apiClient.get<AnimeSearchResponse>("/anime", {
      params: searchParams,
      signal: params.signal,
    });
    return response.data;
  },

  // Get anime by ID
  getAnimeById: async (id: number) => {
    const response = await apiClient.get<AnimeDetailsResponse>(`/anime/${id}`);
    return response.data;
  },
};
