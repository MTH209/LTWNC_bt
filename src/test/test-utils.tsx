import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import { productsApi } from '../features/products/productsApiSlice';
import type { CartItem } from '../types';

interface PreloadedState {
  cart?: { items: CartItem[] };
  products?: {
    items: any[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

export function createTestStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: {
      products: productsReducer,
      cart: cartReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
    preloadedState,
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: PreloadedState;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
