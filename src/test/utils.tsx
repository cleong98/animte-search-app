import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import searchReducer from '../store/searchSlice';
import { type ReactElement } from 'react';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: EnhancedStore;
}

export function renderWithRedux(
  ui: ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: { search: searchReducer },
      ...(preloadedState && { preloadedState }),
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
