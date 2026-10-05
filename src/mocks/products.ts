import type { Product } from '../types';

const productNames = [
  'Tai nghe Bluetooth', 'Bàn phím cơ RGB', 'Chuột gaming', 'Màn hình 4K',
  'Ốp lưng iPhone', 'Sạc nhanh GaN', 'Loa Bluetooth', 'Webcam HD',
  'USB Flash Drive', 'Ổ cứng SSD', 'RAM DDR5', 'Card đồ họa',
  'Máy tính bảng', 'Smartwatch', 'Tai nghe TWS', 'Bàn di chuột',
  'Hub USB-C', 'Cáp sạc nhanh', 'Pin dự phòng', 'Đèn LED màn hình',
  'Giá đỡ laptop', 'Túi chống sốc', 'Bộ vệ sinh laptop', 'Miếng dán bảo vệ',
  'Quạt tản nhiệt', 'Tay cầm chơi game', 'Micro thu âm', 'Tripod điện thoại',
  'Kính VR', 'Router WiFi 6',
];

const descriptions = [
  'Sản phẩm chất lượng cao, thiết kế hiện đại',
  'Công nghệ tiên tiến, hiệu suất vượt trội',
  'Bền bỉ, nhẹ nhàng, dễ sử dụng',
  'Tương thích đa nền tảng, kết nối nhanh',
  'Pin trâu, sạc nhanh, tiết kiệm năng lượng',
  'Thiết kế ergonomic, sử dụng thoải mái',
  'Chống nước, chống bụi IP67',
  'Âm thanh sống động, bass mạnh mẽ',
  'Màu sắc trung thực, độ phân giải cao',
  'Nhỏ gọn, tiện lợi mang theo',
];

const imageTemplates = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop',
];

function generateMockProducts(count: number): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const nameIndex = i % productNames.length;
    const descIndex = i % descriptions.length;
    const imageIndex = i % imageTemplates.length;
    products.push({
      id: i,
      name: `${productNames[nameIndex]} #${i}`,
      price: Math.floor(100000 + Math.random() * 9900000),
      image: imageTemplates[imageIndex],
      description: descriptions[descIndex],
    });
  }
  return products;
}

const PRODUCT_COUNT = 10_000;
const mockProducts: Product[] = generateMockProducts(PRODUCT_COUNT);

export const fetchProductsFromAPI = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 800);
  });
};
