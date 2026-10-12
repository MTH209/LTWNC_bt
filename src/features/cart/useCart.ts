import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
} from './cartSlice';
import type { Product } from '../../types';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  const addToCart = (product: Product) => {
    dispatch(addToCartAction(product));
  };

  const removeFromCart = (productId: number) => {
    dispatch(removeFromCartAction(productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch(updateQuantityAction({ productId, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  return {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
