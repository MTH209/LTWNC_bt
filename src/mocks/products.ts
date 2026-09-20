import type { Product } from '../types';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Tai nghe Bluetooth Pro',
    price: 1290000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Tai nghe không dây chống ồn chủ động, pin 30 giờ',
  },
  {
    id: 2,
    name: 'Bàn phím cơ RGB',
    price: 1890000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
    description: 'Switch Cherry MX, đèn RGB 16.8 triệu màu',
  },
  {
    id: 3,
    name: 'Chuột gaming không dây',
    price: 990000,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    description: 'Sensor 25600 DPI, pin sạc nhanh 70 giờ',
  },
  {
    id: 4,
    name: 'Màn hình 4K 27 inch',
    price: 8990000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    description: 'IPS, HDR400, 144Hz, USB-C',
  },
  {
    id: 5,
    name: 'Ốp lưng iPhone cao cấp',
    price: 390000,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
    description: 'Chất liệu da PU, chống sốc MagSafe',
  },
  {
    id: 6,
    name: 'Sạc nhanh GaN 65W',
    price: 690000,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
    description: '3 cổng (2 USB-C + 1 USB-A), công nghệ GaN III',
  },
  {
    id: 7,
    name: 'Loa Bluetooth di động',
    price: 1590000,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    description: 'Chống nước IP67, pin 20 giờ, âm bass sâu',
  },

];

/**
 * Giả lập API call lấy danh sách sản phẩm
 * Delay 800ms để mô phỏng network latency
 */
export const fetchProductsFromAPI = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 800);
  });
};
