import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

const mockProduct: Product = {
  id: 1,
  name: 'Tai nghe Bluetooth',
  price: 500000,
  image: 'https://example.com/img.jpg',
  description: 'Tai nghe chất lượng cao',
};

// ══════════════════════════════════════════════════════════════
// UNIT / INTEGRATION TESTS – ProductCard component (RTL)
// ══════════════════════════════════════════════════════════════

describe('ProductCard Component', () => {
  // ── TC31: render product info ──────────────────────────────
  it('TC31: should render product name heading, description and formatted price', () => {
    render(
      <ProductCard
        product={mockProduct}
        isFav={false}
        onAddToCart={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Tai nghe Bluetooth' })).toBeInTheDocument();
    expect(screen.getByText('Tai nghe chất lượng cao')).toBeInTheDocument();
    expect(screen.getByText(/500\.000/)).toBeInTheDocument();
  });

  // ── TC32: add to cart callback ─────────────────────────────
  it('TC32: clicking "Thêm vào giỏ" button should call onAddToCart callback', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    render(
      <ProductCard
        product={mockProduct}
        isFav={false}
        onAddToCart={onAddToCart}
        onToggleFavorite={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Thêm vào giỏ/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  // ── TC33: toggle favorite callback ─────────────────────────
  it('TC33: clicking favorite button should call onToggleFavorite callback', async () => {
    const user = userEvent.setup();
    const onToggleFavorite = jest.fn();
    render(
      <ProductCard
        product={mockProduct}
        isFav={false}
        onAddToCart={jest.fn()}
        onToggleFavorite={onToggleFavorite}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Yêu thích' }));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith(mockProduct);
  });

  // ── TC34: favorite icon active state ───────────────────────
  it('TC34: should show filled heart and "Bỏ yêu thích" title when isFav is true', () => {
    render(
      <ProductCard
        product={mockProduct}
        isFav={true}
        onAddToCart={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    expect(screen.getByText('❤️')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toBeInTheDocument();
  });

  // ── TC35: favorite icon inactive state ─────────────────────
  it('TC35: should show empty heart and "Yêu thích" title when isFav is false', () => {
    render(
      <ProductCard
        product={mockProduct}
        isFav={false}
        onAddToCart={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    expect(screen.getByText('🤍')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yêu thích' })).toBeInTheDocument();
  });

  // ── TC36: product image with accessible name ───────────────
  it('TC36: should render product image with accessible name and correct src', () => {
    render(
      <ProductCard
        product={mockProduct}
        isFav={false}
        onAddToCart={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    const img = screen.getByRole('img', { name: 'Tai nghe Bluetooth' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.image);
  });
});
