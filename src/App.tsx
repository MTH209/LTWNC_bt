import ProductList from './features/products/ProductList';
import Cart from './features/cart/Cart';
import FavoritesList from './features/favorites/FavoritesList';
import { FavoritesProvider } from './features/favorites/FavoritesContext';
import './App.css';

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
            <Cart />
            <FavoritesList />
          </aside>
        </main>
      </div>
    </FavoritesProvider>
  );
}

export default App;
