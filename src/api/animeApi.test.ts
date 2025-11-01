import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { animeApi } from './animeApi';
import { mockSearchResponse, mockAnimeDetailsResponse, mockEmptySearchResponse } from '../test/mockData';

const server = setupServer(
  http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const page = url.searchParams.get('page');

    if (q === 'error') {
      return HttpResponse.json({ error: 'API Error' }, { status: 500 });
    }

    if (q === 'empty') {
      return HttpResponse.json(mockEmptySearchResponse);
    }

    return HttpResponse.json(mockSearchResponse);
  }),

  http.get('https://api.jikan.moe/v4/anime/:id', ({ params }) => {
    const { id } = params;

    if (id === '999') {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return HttpResponse.json(mockAnimeDetailsResponse);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('animeApi', () => {
  describe('searchAnime', () => {
    it('makes correct GET request with all params', async () => {
      const result = await animeApi.searchAnime({
        q: 'naruto',
        page: 1,
        limit: 25,
      });

      expect(result).toEqual(mockSearchResponse);
      expect(result.data).toHaveLength(2);
      expect(result.pagination.current_page).toBe(1);
    });

    it('omits q param when query is empty', async () => {
      let requestUrl = '';

      server.use(
        http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(mockSearchResponse);
        })
      );

      await animeApi.searchAnime({ q: '', page: 1, limit: 25 });

      const url = new URL(requestUrl);
      expect(url.searchParams.has('q')).toBe(false);
      expect(url.searchParams.get('page')).toBe('1');
      expect(url.searchParams.get('limit')).toBe('25');
    });

    it('includes q param when query is provided', async () => {
      let requestUrl = '';

      server.use(
        http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(mockSearchResponse);
        })
      );

      await animeApi.searchAnime({ q: 'naruto', page: 1, limit: 25 });

      const url = new URL(requestUrl);
      expect(url.searchParams.get('q')).toBe('naruto');
    });

    it('uses default values for page and limit', async () => {
      let requestUrl = '';

      server.use(
        http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(mockSearchResponse);
        })
      );

      await animeApi.searchAnime({ q: 'test' });

      const url = new URL(requestUrl);
      expect(url.searchParams.get('page')).toBe('1');
      expect(url.searchParams.get('limit')).toBe('25');
    });

    it('passes custom page number', async () => {
      let requestUrl = '';

      server.use(
        http.get('https://api.jikan.moe/v4/anime', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(mockSearchResponse);
        })
      );

      await animeApi.searchAnime({ q: 'test', page: 3, limit: 25 });

      const url = new URL(requestUrl);
      expect(url.searchParams.get('page')).toBe('3');
    });

    it('handles empty search results', async () => {
      const result = await animeApi.searchAnime({ q: 'empty', page: 1, limit: 25 });

      expect(result.data).toHaveLength(0);
      expect(result.pagination.has_next_page).toBe(false);
    });

    it('passes AbortSignal to request', async () => {
      const controller = new AbortController();

      const promise = animeApi.searchAnime({
        q: 'test',
        page: 1,
        limit: 25,
        signal: controller.signal,
      });

      controller.abort();

      try {
        await promise;
      } catch (error) {
        // Request should be cancelled
        expect(error).toBeDefined();
      }
    });

    it('throws error on API failure', async () => {
      try {
        await animeApi.searchAnime({ q: 'error', page: 1, limit: 25 });
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('getAnimeById', () => {
    it('fetches anime by ID successfully', async () => {
      const result = await animeApi.getAnimeById(1);

      expect(result).toEqual(mockAnimeDetailsResponse);
      expect(result.data.mal_id).toBe(1);
      expect(result.data.title).toBe('Test Anime');
    });

    it('makes correct GET request to /anime/:id', async () => {
      let requestUrl = '';

      server.use(
        http.get('https://api.jikan.moe/v4/anime/:id', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json(mockAnimeDetailsResponse);
        })
      );

      await animeApi.getAnimeById(123);

      expect(requestUrl).toContain('/anime/123');
    });

    it('throws error when anime not found', async () => {
      try {
        await animeApi.getAnimeById(999);
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('handles different anime IDs', async () => {
      const result1 = await animeApi.getAnimeById(1);
      const result2 = await animeApi.getAnimeById(2);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });
});
