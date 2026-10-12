import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useCart } from './useCart';
import { createTestStore } from '../../test/test-utils';
import type { Product } from '../../types';

const mockProduct: Product = {
  id: 1,
  name: 'Tai nghe Bluetooth',
  price: 500000,
  image: 'https://example.com/img.jpg',
  description: 'Tai nghe chất lượng cao',
};

// ══════════════════════════════════════════════════════════════
// UNIT TESTS – useCart custom hook (tested with renderHook)
// ══════════════════════════════════════════════════════════════

describe('useCart Custom Hook (Unit - Hook)', () => {
  it('TC_H1: should return empty items, 0 total and 0 itemCount initially', () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('TC_H2: should add product to cart and update state via addToCart', () => {
    const store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ ...mockProduct, quantity: 1 });
    expect(result.current.total).toBe(500000);
    expect(result.current.itemCount).toBe(1);
  });

  it('TC_H3: should update quantity and recalculate total via updateQuantity', () => {
    const store = createTestStore({
      cart: { items: [{ ...mockProduct, quantity: 1 }] },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.total).toBe(1500000);
    expect(result.current.itemCount).toBe(3);
  });

  it('TC_H4: should remove product from cart via removeFromCart', () => {
    const store = createTestStore({
      cart: { items: [{ ...mockProduct, quantity: 1 }] },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('TC_H5: should clear all products via clearCart', () => {
    const store = createTestStore({
      cart: { items: [{ ...mockProduct, quantity: 2 }] },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });
});
