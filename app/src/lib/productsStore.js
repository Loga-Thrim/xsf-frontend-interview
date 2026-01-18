const STORAGE_KEY = 'products';

export async function getProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return [];
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(products, product) {
  return [product, ...products];
}

export function createId() {
  return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatPriceTHB(value) {
  const number = Number(value || 0);
  const formatted = number.toLocaleString('en-US');
  return `฿${formatted}`;
}
