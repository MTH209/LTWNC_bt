import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from './productsSlice';
import { useGetProductsQuery } from './productsApiSlice';
import { addToCart } from '../cart/cartSlice';
import type { Product } from '../../types';

function ProductList() {
  const dispatch = useAppDispatch();
  const [useRTKQuery, setUseRTKQuery] = useState(false);

  // === createAsyncThunk approach ===
  const {
    items: asyncItems,
    status: asyncStatus,
    error: asyncError,
  } = useAppSelector((state) => state.products);

  // === RTK Query approach ===
  const {
    data: rtkItems,
    isLoading: rtkLoading,
    error: rtkError,
  } = useGetProductsQuery(undefined, { skip: !useRTKQuery });

  useEffect(() => {
    if (!useRTKQuery && asyncStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [useRTKQuery, asyncStatus, dispatch]);

  // Xác định data hiển thị dựa trên toggle
  const products: Product[] = useRTKQuery ? (rtkItems ?? []) : asyncItems;
  const isLoading = useRTKQuery ? rtkLoading : asyncStatus === 'loading';
  const hasError = useRTKQuery ? !!rtkError : asyncStatus === 'failed';
  const errorMessage = useRTKQuery
    ? 'Lỗi khi tải sản phẩm (RTK Query)'
    : asyncError ?? 'Lỗi không xác định';

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <section className="products-section">
      <div className="section-header">
        <h2>
          <span className="icon">🛍️</span> Sản phẩm
        </h2>
        <div className="api-toggle">
          <span className={!useRTKQuery ? 'active' : ''}>AsyncThunk</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={useRTKQuery}
              onChange={(e) => setUseRTKQuery(e.target.checked)}
            />
            <span className="slider" />
          </label>
          <span className={useRTKQuery ? 'active' : ''}>RTK Query</span>
        </div>
      </div>

      {isLoading && (
        <div className="products-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="product-card skeleton">
              <div className="skeleton-img" />
              <div className="skeleton-text" />
              <div className="skeleton-text short" />
              <div className="skeleton-btn" />
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <div className="error-banner">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {!isLoading && !hasError && (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-img-wrapper">
                <img src={product.image} alt={product.name} loading="lazy" />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <p className="product-price">{formatPrice(product.price)}</p>
                <button
                  className="btn btn-add"
                  onClick={() => handleAddToCart(product)}
                >
                  <span>+</span> Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
