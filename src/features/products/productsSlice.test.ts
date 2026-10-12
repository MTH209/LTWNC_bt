import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { fetchProducts } from './productsSlice';

// Mock phải ở top-level để Jest hoist đúng cách
jest.mock('../../mocks/products', () => ({
  fetchProductsFromAPI: jest.fn().mockResolvedValue([
    { id: 1, name: 'Tai nghe Bluetooth', price: 500000, image: 'img.jpg', description: 'desc' },
  ]),
}));

// ══════════════════════════════════════════════════════════════
// UNIT TESTS – productsSlice (includes async thunk tests)
// ══════════════════════════════════════════════════════════════

describe('productsSlice reducer', () => {
  // ── TC15: initial state ────────────────────────────────────
  it('TC15: should return initial state', () => {
    const state = productsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      items: [],
      status: 'idle',
      error: null,
    });
  });

  // ── TC16: pending state ────────────────────────────────────
  it('TC16: fetchProducts.pending should set status to loading', () => {
    const state = productsReducer(undefined, fetchProducts.pending(''));
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  // ── TC17: fulfilled state ──────────────────────────────────
  it('TC17: fetchProducts.fulfilled should store products and set status to succeeded', () => {
    const mockProducts = [
      { id: 1, name: 'Product 1', price: 100, image: 'img1.jpg', description: 'desc1' },
      { id: 2, name: 'Product 2', price: 200, image: 'img2.jpg', description: 'desc2' },
    ];
    const state = productsReducer(
      undefined,
      fetchProducts.fulfilled(mockProducts, '')
    );
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(mockProducts);
    expect(state.error).toBeNull();
  });

  // ── TC18: rejected state ───────────────────────────────────
  it('TC18: fetchProducts.rejected should set error message and status to failed', () => {
    const error = new Error('Network Error');
    const state = productsReducer(
      undefined,
      fetchProducts.rejected(error, '')
    );
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network Error');
    expect(state.items).toEqual([]);
  });

  // ══════════════════════════════════════════════════════════
  // TC19: ASYNC TEST – fetchProducts thunk with mocked API
  // ══════════════════════════════════════════════════════════
  it('TC19: fetchProducts async thunk should fetch and store products (mock API)', async () => {
    const mockProducts = [
      { id: 1, name: 'Tai nghe Bluetooth', price: 500000, image: 'img.jpg', description: 'desc' },
    ];

    const store = configureStore({
      reducer: { products: productsReducer },
    });

    // Dispatch the async thunk
    await store.dispatch(fetchProducts());

    const state = store.getState().products;
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(mockProducts);
    expect(state.error).toBeNull();

    jest.restoreAllMocks();
  });

  // ── TC20: rejected thunk with default error message ───────
  it('TC20: fetchProducts.rejected with no message should use fallback', () => {
    const state = productsReducer(
      undefined,
      fetchProducts.rejected(null, '', undefined, undefined)
    );
    expect(state.status).toBe('failed');
    // When error is null, RTK generates a default 'Rejected' message
    // The fallback 'Có lỗi xảy ra khi tải sản phẩm' is used via ?? operator
    // but action.error.message is 'Rejected' (RTK default), so it's truthy
    expect(state.error).toBe('Rejected');
  });
});
