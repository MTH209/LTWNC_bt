import { memo, type ReactElement } from 'react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isFav: boolean;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  style?: React.CSSProperties;
  ariaAttributes?: Record<string, unknown>;
}

const ProductCard = memo(function ProductCard({
  product,
  isFav,
  onAddToCart,
  onToggleFavorite,
  style,
  ariaAttributes,
}: ProductCardProps): ReactElement {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <div style={style} {...ariaAttributes}>
      <div className="product-card">
        <div className="product-img-wrapper">
          <img src={product.image} alt={product.name} loading="lazy" />
          <button
            className={`btn-fav ${isFav ? 'active' : ''}`}
            onClick={() => onToggleFavorite(product)}
            title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
            aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-desc">{product.description}</p>
          <p className="product-price">{formatPrice(product.price)}</p>
          <button
            className="btn btn-add"
            onClick={() => onAddToCart(product)}
          >
            <span>+</span> Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
