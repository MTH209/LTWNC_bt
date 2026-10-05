import { lazy, Suspense } from 'react';
import ProductList from './features/products/ProductList';
import { FavoritesProvider } from './features/favorites/FavoritesContext';
import './App.css';

const Cart = lazy(() => import('./features/cart/Cart'));
const FavoritesList = lazy(() => import('./features/favorites/FavoritesList'));

function SidebarFallback() {
  return (
    <div className="sidebar-loading">
      <div className="skeleton-text" style={{ height: 24, marginBottom: 12 }} />
      <div className="skeleton-text" style={{ height: 80 }} />
    </div>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>
              <span className="logo-icon">⚡</span> TechStore
            </h1>
          </div>
        </header>
        <main className="app-main">
          <ProductList />
          <aside className="sidebar">
            <Suspense fallback={<SidebarFallback />}>
              <Cart />
              <FavoritesList />
            </Suspense>
          </aside>
        </main>
      </div>
    </FavoritesProvider>
  );
}

export default App;
