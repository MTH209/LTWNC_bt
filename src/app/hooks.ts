import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

/**
 * Typed dispatch hook — dùng thay cho useDispatch trong toàn bộ app
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed selector hook — dùng thay cho useSelector trong toàn bộ app
 */
export const useAppSelector = useSelector.withTypes<RootState>();
