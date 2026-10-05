import { useEffect, useState, useCallback, useMemo, useRef, type ReactElement } from 'react';
import { Grid, type CellComponentProps } from 'react-window';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from './productsSlice';
import { useGetProductsQuery } from './productsApiSlice';
import { addToCart } from '../cart/cartSlice';
import { useFavorites } from '../favorites/FavoritesContext';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

const COLUMN_COUNT = 4;
const ROW_HEIGHT = 420;
const COLUMN_WIDTH = 260;
const GRID_GAP = 20;

interface GridCellProps {
  products: Product[];
  columnCount: number;
  isFavorite: (id: number) => boolean;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

function VirtualCell({
  ariaAttributes,
  rowIndex,
  columnIndex,
  style,
  products,
  columnCount,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: CellComponentProps<GridCellProps>): ReactElement | null {
  const index = rowIndex * columnCount + columnIndex;
  if (index >= products.length) return <div style={style} {...ariaAttributes} />;

  const product = products[index];
  const adjustedStyle: React.CSSProperties = {
    ...style,
    left: Number(style.left) + columnIndex * GRID_GAP,
    top: Number(style.top) + rowIndex * GRID_GAP,
    width: Number(style.width) - GRID_GAP,
    height: Number(style.height) - GRID_GAP,
  };

  return (
    <ProductCard
      ariaAttributes={ariaAttributes}
      product={product}
      isFav={isFavorite(product.id)}
      onAddToCart={onAddToCart}
      onToggleFavorite={onToggleFavorite}
      style={adjustedStyle}
    />
  );
}

function ProductList() {
  const dispatch = useAppDispatch();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [useRTKQuery, setUseRTKQuery] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1040);

  const {
    items: asyncItems,
    status: asyncStatus,
    error: asyncError,
  } = useAppSelector((state) => state.products);

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const products: Product[] = useRTKQuery ? (rtkItems ?? []) : asyncItems;
  const isLoading = useRTKQuery ? rtkLoading : asyncStatus === 'loading';
  const hasError = useRTKQuery ? !!rtkError : asyncStatus === 'failed';
  const errorMessage = useRTKQuery
    ? 'Lỗi khi tải sản phẩm (RTK Query)'
    : asyncError ?? 'Lỗi không xác định';

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  const handleToggleFavorite = useCallback(
    (product: Product) => {
      toggleFavorite(product);
    },
    [toggleFavorite]
  );

  const columnCount = useMemo(() => {
    const cols = Math.max(1, Math.floor(containerWidth / (COLUMN_WIDTH + GRID_GAP)));
    return Math.min(cols, COLUMN_COUNT);
  }, [containerWidth]);

  const rowCount = useMemo(
    () => Math.ceil(products.length / columnCount),
    [products.length, columnCount]
  );

  const actualColumnWidth = useMemo(
    () => (containerWidth - GRID_GAP * (columnCount - 1)) / columnCount,
    [containerWidth, columnCount]
  );

  const cellProps: GridCellProps = useMemo(
    () => ({
      products,
      columnCount,
      isFavorite,
      onAddToCart: handleAddToCart,
      onToggleFavorite: handleToggleFavorite,
    }),
    [products, columnCount, isFavorite, handleAddToCart, handleToggleFavorite]
  );

  return (
    <section className="products-section" ref={containerRef}>
      <div className="section-header">
        <h2>
          <span className="icon">🛍️</span> Sản phẩm
          {!isLoading && !hasError && (
            <span className="badge">{products.length.toLocaleString()}</span>
          )}
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

      {!isLoading && !hasError && products.length > 0 && (
        <Grid<GridCellProps>
          className="virtual-grid"
          cellComponent={VirtualCell}
          cellProps={cellProps}
          columnCount={columnCount}
          columnWidth={actualColumnWidth + GRID_GAP}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT + GRID_GAP}
          style={{ width: containerWidth, height: 720 }}
          overscanCount={2}
        />
      )}
    </section>
  );
}

export default ProductList;
