import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from '../../types';
import { fetchProductsFromAPI } from '../../mocks/products';

/**
 * RTK Query API — cách thay thế createAsyncThunk
 * Sử dụng fakeBaseQuery vì dùng mock data, không có backend thật
 */
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
        try {
          const products = await fetchProductsFromAPI();
          return { data: products };
        } catch (error) {
          return { error: { status: 500, data: 'Có lỗi xảy ra khi tải sản phẩm' } };
        }
      },
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
