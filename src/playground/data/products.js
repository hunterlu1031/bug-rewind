export const PRODUCTS = [
  {
    id: 'sku-101',
    name: 'Classic Cotton Tee',
    price: 24.99,
    category: 'Apparel',
    image: '👕',
    description: 'Soft crew-neck tee for everyday wear.',
  },
  {
    id: 'sku-102',
    name: 'Trail Runner Sneakers',
    price: 89.0,
    category: 'Footwear',
    image: '👟',
    description: 'Lightweight sneakers with responsive cushioning.',
  },
  {
    id: 'sku-103',
    name: 'Insulated Water Bottle',
    price: 32.5,
    category: 'Accessories',
    image: '🥤',
    description: 'Keeps drinks cold for 24 hours.',
  },
  {
    id: 'sku-104',
    name: 'Leather Weekender Bag',
    price: 129.99,
    category: 'Bags',
    image: '👜',
    description: 'Weekend travel bag with reinforced handles.',
  },
  {
    id: 'sku-105',
    name: 'Wireless Earbuds',
    price: 59.99,
    category: 'Electronics',
    image: '🎧',
    description: 'Noise-isolating earbuds with charging case.',
  },
  {
    id: 'sku-106',
    name: 'Organic Coffee Beans',
    price: 18.0,
    category: 'Grocery',
    image: '☕',
    description: 'Medium roast whole beans, 12 oz.',
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}
