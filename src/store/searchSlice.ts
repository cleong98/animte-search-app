import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AnimeSearchResponse } from "../api/types";

interface SearchState {
  query: string;
  currentPage: number;
  cachedQuery: string;
  cachedPage: number;
  cachedData: AnimeSearchResponse | null;
}

const initialState: SearchState = {
  query: "",
  currentPage: 1,
  cachedQuery: "",
  cachedPage: 0,
  cachedData: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.currentPage = 1; // Reset to page 1 on new search
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCachedData: (
      state,
      action: PayloadAction<{
        query: string;
        page: number;
        data: AnimeSearchResponse;
      }>
    ) => {
      state.cachedQuery = action.payload.query;
      state.cachedPage = action.payload.page;
      state.cachedData = action.payload.data;
    },
    resetSearch: (state) => {
      state.query = "";
      state.currentPage = 1;
      state.cachedQuery = "";
      state.cachedPage = 0;
      state.cachedData = null;
    },
  },
});

export const { setSearchQuery, setCurrentPage, setCachedData, resetSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
