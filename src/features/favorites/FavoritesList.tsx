import { useFavorites } from './FavoritesContext';

function FavoritesList() {
  const { favorites, favoriteCount, toggleFavorite, clearFavorites } =
    useFavorites();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <section className="favorites-section">
      <div className="section-header">
        <h2>
          <span className="icon">❤️</span> Yêu thích
          {favoriteCount > 0 && (
            <span className="badge badge-fav">{favoriteCount}</span>
          )}
        </h2>
        {favorites.length > 0 && (
          <button className="btn btn-clear" onClick={clearFavorites}>
            Xoá tất cả
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">💔</div>
          <p>Chưa có sản phẩm yêu thích</p>
          <span>Nhấn ❤️ trên sản phẩm để thêm!</span>
        </div>
      ) : (
        <div className="fav-items">
          {favorites.map((item) => (
            <div key={item.id} className="fav-item">
              <img src={item.image} alt={item.name} />
              <div className="fav-item-info">
                <h4>{item.name}</h4>
                <p className="fav-item-price">{formatPrice(item.price)}</p>
              </div>
              <button
                className="btn btn-unfav"
                onClick={() => toggleFavorite(item)}
                title="Bỏ yêu thích"
              >
                ❤️
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritesList;
