import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from './cartSlice';

function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);

  return (
    <section className="cart-section">
      <div className="section-header">
        <h2>
          <span className="icon">🛒</span> Giỏ hàng
          {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </h2>
        {items.length > 0 && (
          <button
            className="btn btn-clear"
            onClick={() => dispatch(clearCart())}
          >
            Xoá tất cả
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p>Giỏ hàng trống</p>
          <span>Hãy thêm sản phẩm vào giỏ!</span>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="btn-qty"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="btn-qty"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            productId: item.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    className="btn btn-remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    title="Xoá"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="btn btn-checkout">Thanh toán</button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
