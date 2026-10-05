# ⚡ TechStore — Tối Ưu Hiệu Năng ReactJS (10.000 sản phẩm)

## Mô tả

Trang quản lý sản phẩm TechStore được xây dựng bằng **React 19 + TypeScript + Vite + Redux Toolkit**. Trang hiển thị **10.000 sản phẩm** với chức năng thêm giỏ hàng, yêu thích, chuyển đổi giữa AsyncThunk và RTK Query.

Bài tập này tập trung vào việc **đo hiệu năng bằng Lighthouse** trước và sau khi áp dụng các kỹ thuật tối ưu.

## Công nghệ sử dụng

- React 19 + TypeScript
- Vite 5
- Redux Toolkit + RTK Query
- react-window v2 (virtualization)
- Context API + useReducer

---

## 📊 Báo Cáo Tối Ưu Hiệu Năng

### 1. Tổng Quan Kết Quả

| | TRƯỚC tối ưu | SAU tối ưu | Thay đổi |
|---|:---:|:---:|:---:|
| **Performance Score** | **64** 🟠 | **95** 🟢 | **+31 điểm ↑** |

### 2. So Sánh Chi Tiết Các Chỉ Số Lighthouse

| Chỉ số | TRƯỚC | SAU | Cải thiện |
|--------|:-----:|:---:|:---------:|
| **FCP** (First Contentful Paint) | 0.5s | 0.6s | ~ |
| **LCP** (Largest Contentful Paint) | 1.2s | 1.5s | ~ |
| **TBT** (Total Blocking Time) | **1,660 ms** ❌ | **0 ms** ✅ | **-1,660 ms (100%)** |
| **CLS** (Cumulative Layout Shift) | 0.001 | 0.001 | ~ |
| **SI** (Speed Index) | 2.0s | 0.8s | **-1.2s (60%)** |
| **TTI** (Time to Interactive) | 2.5s | 1.5s | **-1.0s (40%)** |
| **DOM Size** | **100,035** ❌ | **129** ✅ | **-99,906 (99.87%)** |
| **JS Execution Time** | 1.1s | 0.1s | **-1.0s (91%)** |
| **Main Thread Work** | 3.9s | 0.3s | **-3.6s (92%)** |

### 3. Vấn Đề Phát Hiện (TRƯỚC tối ưu)

**Vấn đề 1: DOM quá lớn (100,035 elements)**
- Render toàn bộ 10.000 sản phẩm ra DOM cùng lúc
- Mỗi product card ~10 DOM nodes → 10.000 × 10 = 100.000+ nodes
- Lighthouse khuyến nghị < 1.500 elements

**Vấn đề 2: TBT = 1,660ms (Total Blocking Time)**
- Main thread bị block do phải paint/layout 100.000+ DOM elements
- Target < 200ms (desktop)
- Trình duyệt mất 3.9s cho main thread work

**Vấn đề 3: Bundle JS đơn khối (308 KB)**
- Tất cả code nằm trong 1 file JS duy nhất
- Cart, FavoritesList load cùng lúc dù chưa cần thiết ngay

### 4. Giải Pháp Đã Áp Dụng

#### Kỹ thuật 1: Virtualization (react-window v2 Grid)

**File**: `src/features/products/ProductList.tsx`

Chỉ render các sản phẩm đang hiển thị trên viewport (~20 items), thay vì tất cả 10.000.

```tsx
<Grid<GridCellProps>
  cellComponent={VirtualCell}
  cellProps={cellProps}
  columnCount={columnCount}
  columnWidth={actualColumnWidth + GRID_GAP}
  rowCount={rowCount}
  rowHeight={ROW_HEIGHT + GRID_GAP}
  style={{ width: containerWidth, height: 720 }}
  overscanCount={2}
/>
```

Kết quả:
- DOM elements: 100,035 → **129** (giảm 99.87%)
- TBT: 1,660ms → **0ms** (giảm 100%)
- Main thread work: 3.9s → **0.3s** (giảm 92%)

#### Kỹ thuật 2: Memoization (React.memo, useCallback, useMemo)

**Files**: `src/features/products/ProductCard.tsx`, `src/features/products/ProductList.tsx`

Ngăn re-render không cần thiết khi state thay đổi.

```tsx
const ProductCard = memo(function ProductCard({ product, isFav, ... }) { ... });

const handleAddToCart = useCallback(
  (product: Product) => { dispatch(addToCart(product)); },
  [dispatch]
);

const columnCount = useMemo(() => {
  return Math.min(Math.floor(containerWidth / 280), 4);
}, [containerWidth]);

const cellProps: GridCellProps = useMemo(
  () => ({ products, columnCount, isFavorite, onAddToCart, onToggleFavorite }),
  [products, columnCount, isFavorite, handleAddToCart, handleToggleFavorite]
);
```

Kết quả: Khi user thêm sản phẩm vào giỏ/yêu thích, chỉ card liên quan re-render, không phải toàn bộ grid.

#### Kỹ thuật 3: Code-Splitting (React.lazy + Suspense)

**File**: `src/App.tsx`

Lazy load Cart và FavoritesList thành chunks riêng biệt, giảm initial JS payload.

```tsx
const Cart = lazy(() => import('./features/cart/Cart'));
const FavoritesList = lazy(() => import('./features/favorites/FavoritesList'));

<Suspense fallback={<SidebarFallback />}>
  <Cart />
  <FavoritesList />
</Suspense>
```

Kết quả build:

| | TRƯỚC | SAU |
|---|:---:|:---:|
| Main bundle | 308 KB (1 chunk) | 318 KB + 1.93 KB + 1.20 KB (3 chunks) |
| Cart | Nằm trong main | Chunk riêng: 1.93 KB |
| FavoritesList | Nằm trong main | Chunk riêng: 1.20 KB |

### 5. Kết Luận

| Metric | Trước | Sau | Đánh giá |
|--------|:-----:|:---:|:--------:|
| Performance Score | 64 🟠 | **95 🟢** | Excellent |
| TBT | 1,660ms ❌ | **0ms** ✅ | Perfect |
| DOM Size | 100,035 ❌ | **129** ✅ | Perfect |
| SI | 2.0s 🟡 | **0.8s** ✅ | Excellent |
| TTI | 2.5s | **1.5s** ✅ | Excellent |

Performance Score tăng từ **64 → 95** (+31 điểm). Vấn đề nghiêm trọng nhất (TBT = 1,660ms, DOM Size = 100,035) được giải quyết triệt để nhờ **Virtualization**. Code-Splitting giúp tách bundle thành chunks nhỏ hơn. Memoization đảm bảo hiệu suất runtime khi user tương tác.

---

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```
