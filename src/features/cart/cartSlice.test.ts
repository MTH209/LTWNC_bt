import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from './cartSlice';
import type { Product } from '../../types';

// ── Mock data ────────────────────────────────────────────────
const mockProduct: Product = {
  id: 1,
  name: 'Tai nghe Bluetooth',
  price: 500000,
  image: 'https://example.com/img.jpg',
  description: 'Tai nghe chất lượng cao',
};

const mockProduct2: Product = {
  id: 2,
  name: 'Bàn phím cơ RGB',
  price: 1200000,
  image: 'https://example.com/img2.jpg',
  description: 'Bàn phím gaming',
};

// ══════════════════════════════════════════════════════════════
// UNIT TESTS – cartSlice reducer
// ══════════════════════════════════════════════════════════════

describe('cartSlice reducer', () => {
  // ── TC1: initial state ─────────────────────────────────────
  it('TC1: should return initial state with empty items', () => {
    const state = cartReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ items: [] });
  });

  // ── TC2: addToCart – new product ───────────────────────────
  it('TC2: addToCart should add a new product with quantity 1', () => {
    const state = cartReducer(undefined, addToCart(mockProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ ...mockProduct, quantity: 1 });
  });

  // ── TC3: addToCart – existing product increments qty ───────
  it('TC3: addToCart should increment quantity for existing product', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(state, addToCart(mockProduct));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  // ── TC4: addToCart – multiple different products ───────────
  it('TC4: addToCart should handle multiple different products', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(state, addToCart(mockProduct2));
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe(1);
    expect(state.items[1].id).toBe(2);
  });

  // ── TC5: removeFromCart ────────────────────────────────────
  it('TC5: removeFromCart should remove product by id', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(state, addToCart(mockProduct2));
    state = cartReducer(state, removeFromCart(1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(2);
  });

  // ── TC6: removeFromCart – non-existent id ──────────────────
  it('TC6: removeFromCart with non-existent id should not change state', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(state, removeFromCart(999));
    expect(state.items).toHaveLength(1);
  });

  // ── TC7: updateQuantity – set specific quantity ────────────
  it('TC7: updateQuantity should set the quantity to a specific value', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(
      state,
      updateQuantity({ productId: 1, quantity: 5 })
    );
    expect(state.items[0].quantity).toBe(5);
  });

  // ── TC8: updateQuantity – quantity <= 0 removes item ───────
  it('TC8: updateQuantity with quantity <= 0 should remove item from cart', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(
      state,
      updateQuantity({ productId: 1, quantity: 0 })
    );
    expect(state.items).toHaveLength(0);
  });

  // ── TC9: updateQuantity – negative quantity removes item ───
  it('TC9: updateQuantity with negative quantity should remove item from cart', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(
      state,
      updateQuantity({ productId: 1, quantity: -1 })
    );
    expect(state.items).toHaveLength(0);
  });

  // ── TC10: clearCart ────────────────────────────────────────
  it('TC10: clearCart should remove all items', () => {
    let state = cartReducer(undefined, addToCart(mockProduct));
    state = cartReducer(state, addToCart(mockProduct2));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });
});

// ══════════════════════════════════════════════════════════════
// UNIT TESTS – selectors
// ══════════════════════════════════════════════════════════════

describe('cart selectors', () => {
  // ── TC11: selectCartItems ──────────────────────────────────
  it('TC11: selectCartItems should return all cart items', () => {
    const state = {
      cart: {
        items: [
          { ...mockProduct, quantity: 2 },
          { ...mockProduct2, quantity: 1 },
        ],
      },
    };
    expect(selectCartItems(state)).toHaveLength(2);
  });

  // ── TC12: selectCartTotal ──────────────────────────────────
  it('TC12: selectCartTotal should calculate the correct total price', () => {
    const state = {
      cart: {
        items: [
          { ...mockProduct, quantity: 2 },   // 500000 * 2 = 1000000
          { ...mockProduct2, quantity: 1 },  // 1200000 * 1 = 1200000
        ],
      },
    };
    expect(selectCartTotal(state)).toBe(2200000);
  });

  // ── TC13: selectCartItemCount ──────────────────────────────
  it('TC13: selectCartItemCount should return total quantity of all items', () => {
    const state = {
      cart: {
        items: [
          { ...mockProduct, quantity: 2 },
          { ...mockProduct2, quantity: 3 },
        ],
      },
    };
    expect(selectCartItemCount(state)).toBe(5);
  });

  // ── TC14: selectors with empty cart ────────────────────────
  it('TC14: selectors should return correct values for empty cart', () => {
    const state = { cart: { items: [] } };
    expect(selectCartItems(state)).toEqual([]);
    expect(selectCartTotal(state)).toBe(0);
    expect(selectCartItemCount(state)).toBe(0);
  });
});
