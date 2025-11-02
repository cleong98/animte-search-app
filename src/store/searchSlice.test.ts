import { describe, it, expect } from 'vitest';
import searchReducer, {
  setSearchQuery,
  setCurrentPage,
  setCachedData,
  resetSearch,
} from './searchSlice';
import { mockSearchResponse } from '../test/mockData';

describe('searchSlice', () => {
  const initialState = {
    query: '',
    currentPage: 1,
    cachedQuery: '',
    cachedPage: 0,
    cachedData: null,
    selectedType: '',
    selectedStatus: '',
    selectedRating: '',
    isFilterOpen: false,
    cachedType: '',
    cachedStatus: '',
    cachedRating: '',
  };

  it('should return initial state', () => {
    expect(searchReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setSearchQuery updates query and resets page to 1', () => {
    const state = searchReducer(
      { ...initialState, currentPage: 5 },
      setSearchQuery('naruto')
    );

    expect(state.query).toBe('naruto');
    expect(state.currentPage).toBe(1);
  });

  it('setSearchQuery handles empty string', () => {
    const state = searchReducer(
      { ...initialState, query: 'test', currentPage: 3 },
      setSearchQuery('')
    );

    expect(state.query).toBe('');
    expect(state.currentPage).toBe(1);
  });

  it('setCurrentPage updates current page', () => {
    const state = searchReducer(
      initialState,
      setCurrentPage(3)
    );

    expect(state.currentPage).toBe(3);
  });

  it('setCurrentPage handles page 1', () => {
    const state = searchReducer(
      { ...initialState, currentPage: 5 },
      setCurrentPage(1)
    );

    expect(state.currentPage).toBe(1);
  });

  it('setCachedData stores all cache information', () => {
    const state = searchReducer(
      initialState,
      setCachedData({
        query: 'test',
        page: 2,
        data: mockSearchResponse,
        type: 'tv',
        status: 'airing',
        rating: 'pg13',
      })
    );

    expect(state.cachedQuery).toBe('test');
    expect(state.cachedPage).toBe(2);
    expect(state.cachedData).toEqual(mockSearchResponse);
    expect(state.cachedType).toBe('tv');
    expect(state.cachedStatus).toBe('airing');
    expect(state.cachedRating).toBe('pg13');
  });

  it('setCachedData can update existing cache', () => {
    const existingState = {
      ...initialState,
      cachedQuery: 'old',
      cachedPage: 1,
      cachedData: mockSearchResponse,
      cachedType: 'movie',
      cachedStatus: 'complete',
      cachedRating: 'g',
    };

    const state = searchReducer(
      existingState,
      setCachedData({
        query: 'new',
        page: 3,
        data: mockSearchResponse,
        type: 'tv',
        status: 'airing',
        rating: 'pg13',
      })
    );

    expect(state.cachedQuery).toBe('new');
    expect(state.cachedPage).toBe(3);
    expect(state.cachedType).toBe('tv');
    expect(state.cachedStatus).toBe('airing');
    expect(state.cachedRating).toBe('pg13');
  });

  it('resetSearch returns to initial state', () => {
    const dirtyState = {
      query: 'naruto',
      currentPage: 5,
      cachedQuery: 'naruto',
      cachedPage: 5,
      cachedData: mockSearchResponse,
      selectedType: 'tv',
      selectedStatus: 'airing',
      selectedRating: 'pg13',
      isFilterOpen: true,
      cachedType: 'tv',
      cachedStatus: 'airing',
      cachedRating: 'pg13',
    };

    const state = searchReducer(dirtyState, resetSearch());
    expect(state).toEqual(initialState);
  });

  it('resetSearch works when already in initial state', () => {
    const state = searchReducer(initialState, resetSearch());
    expect(state).toEqual(initialState);
  });

  it('maintains state immutability', () => {
    const state1 = searchReducer(initialState, setSearchQuery('test'));
    const state2 = searchReducer(state1, setCurrentPage(2));

    expect(state1).not.toBe(state2);
    expect(state1.currentPage).toBe(1);
    expect(state2.currentPage).toBe(2);
  });
});
