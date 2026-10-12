import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from './Cart';
import { renderWithProviders } from '../../test/test-utils';
import type { CartItem } from '../../types';

// ── Mock cart items ──────────────────────────────────────────
const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Tai nghe Bluetooth',
    price: 500000,
    image: 'https://example.com/img1.jpg',
    description: 'Tai nghe chất lượng cao',
    quantity: 2,
  },
  {
    id: 2,
    name: 'Bàn phím cơ RGB',
    price: 1200000,
    image: 'https://example.com/img2.jpg',
    description: 'Bàn phím gaming',
    quantity: 1,
  },
];

// ══════════════════════════════════════════════════════════════
// INTEGRATION TESTS – Cart component with Redux store (RTL)
// ══════════════════════════════════════════════════════════════

describe('Cart Component (Integration)', () => {
  // ── TC21: empty cart message ────────────────────────────────
  it('TC21: should display empty cart message and section heading when no items', () => {
    renderWithProviders(<Cart />);
    expect(screen.getByRole('heading', { level: 2, name: /Giỏ hàng/i })).toBeInTheDocument();
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
    expect(screen.getByText('Hãy thêm sản phẩm vào giỏ!')).toBeInTheDocument();
  });

  // ── TC22: render cart items ────────────────────────────────
  it('TC22: should render cart item headings when items exist in store', () => {
    renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: mockCartItems } },
    });
    expect(screen.getByRole('heading', { level: 4, name: 'Tai nghe Bluetooth' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Bàn phím cơ RGB' })).toBeInTheDocument();
  });

  // ── TC23: display item count badge ─────────────────────────
  it('TC23: should display correct total item count in badge', () => {
    renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: mockCartItems } },
    });
    // Total quantity: 2 + 1 = 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // ── TC24: display total price ──────────────────────────────
  it('TC24: should display correct total price formatted in VND', () => {
    renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: mockCartItems } },
    });
    // Total: 500000*2 + 1200000*1 = 2200000 VND
    const totalElement = screen.getByText(/2\.200\.000/);
    expect(totalElement).toBeInTheDocument();
  });

  // ── TC25: remove item from cart ────────────────────────────
  it('TC25: clicking remove button should remove item from cart', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: [mockCartItems[0]] } },
    });

    expect(screen.getByRole('heading', { level: 4, name: 'Tai nghe Bluetooth' })).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: 'Xoá' });
    await user.click(removeButton);

    // After removal, the cart should be empty
    expect(store.getState().cart.items).toHaveLength(0);
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
  });

  // ── TC26: clear all items ──────────────────────────────────
  it('TC26: clicking "Xoá tất cả" button should clear the entire cart', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: mockCartItems } },
    });

    const clearButton = screen.getByRole('button', { name: 'Xoá tất cả' });
    await user.click(clearButton);

    expect(store.getState().cart.items).toHaveLength(0);
    expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument();
  });

  // ── TC27: increment quantity ───────────────────────────────
  it('TC27: clicking "+" button should increment item quantity', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: [{ ...mockCartItems[0], quantity: 1 }] } },
    });

    const plusButton = screen.getByRole('button', { name: '+' });
    await user.click(plusButton);

    expect(store.getState().cart.items[0].quantity).toBe(2);
  });

  // ── TC28: decrement quantity removes item at 1 ─────────────
  it('TC28: clicking "−" button when quantity is 1 should remove item from cart', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: [{ ...mockCartItems[0], quantity: 1 }] } },
    });

    const minusButton = screen.getByRole('button', { name: '−' });
    await user.click(minusButton);

    // quantity becomes 0, item should be removed
    expect(store.getState().cart.items).toHaveLength(0);
  });

  // ── TC29: "Xoá tất cả" button not shown for empty cart ─────
  it('TC29: "Xoá tất cả" button should not be rendered when cart is empty', () => {
    renderWithProviders(<Cart />);
    expect(screen.queryByRole('button', { name: 'Xoá tất cả' })).not.toBeInTheDocument();
  });

  // ── TC30: checkout button is displayed ─────────────────────
  it('TC30: checkout button should be rendered when cart has items', () => {
    renderWithProviders(<Cart />, {
      preloadedState: { cart: { items: mockCartItems } },
    });
    expect(screen.getByRole('button', { name: 'Thanh toán' })).toBeInTheDocument();
  });
});
