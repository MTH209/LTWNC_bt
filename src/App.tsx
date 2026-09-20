import ProductList from './features/products/ProductList';
import Cart from './features/cart/Cart';
import './App.css';

function App() {
  return (
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
        <Cart />
      </main>
    </div>
  );
}

export default App;
