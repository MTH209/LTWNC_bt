import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react';
import type { Product } from '../../types';

type FavoritesAction =
  | { type: 'TOGGLE_FAVORITE'; payload: Product }
  | { type: 'CLEAR_FAVORITES' };

interface FavoritesState {
  items: Product[];
}

const initialState: FavoritesState = {
  items: [],
};

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'CLEAR_FAVORITES':
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface FavoritesContextValue {
  favorites: Product[];
  favoriteCount: number;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  const value = useMemo<FavoritesContextValue>(() => {
    const favoriteIds = new Set(state.items.map((item) => item.id));

    return {
      favorites: state.items,
      favoriteCount: state.items.length,
      isFavorite: (productId: number) => favoriteIds.has(productId),
      toggleFavorite: (product: Product) =>
        dispatch({ type: 'TOGGLE_FAVORITE', payload: product }),
      clearFavorites: () => dispatch({ type: 'CLEAR_FAVORITES' }),
    };
  }, [state.items]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
