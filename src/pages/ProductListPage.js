import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPriceTHB, getProducts } from '../lib/productsStore';
import styles from '../styles/ProductListPage.module.css';

function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const images = product.images && product.images.length ? product.images : ['/placeholder.svg'];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.id]);

  const col = index % 5;
  const row = Math.floor(index / 5);
  const left = 172 + 224 * col;
  const top = 272 + 375 * row;

  const safeIndex = ((activeIndex % images.length) + images.length) % images.length;

  function onNextImage(e) {
    e.stopPropagation();
    setActiveIndex((v) => (v + 1) % images.length);
  }

  function onDotClick(e, idx) {
    e.stopPropagation();
    if (idx < images.length) setActiveIndex(idx);
  }

  return (
    <div
      className={styles.card}
      style={{ left, top }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <img
        className={styles.cardImage}
        src={images[safeIndex]}
        alt={product.name}
        onClick={onNextImage}
      />
      <div className={styles.cardTitle}>{product.name}</div>
      <div className={styles.cardCode}>{product.code}</div>
      <div className={styles.cardPrice}>{formatPriceTHB(product.price)}</div>
      <div className={styles.dots}>
        {images.map((_, i) => {
          const className = i === safeIndex ? styles.dotActive : styles.dot;
          return <div key={i} className={className} onClick={(e) => onDotClick(e, i)} />;
        })}
      </div>
    </div>
  );
}

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) setProducts(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const name = (p.name || '').toLowerCase();
      const code = (p.code || '').toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [products, query]);

  return (
    <div className={styles.canvas}>
      <div className={styles.title}>Product list</div>

      <button className={styles.uploadButton} type="button" onClick={() => navigate('/upload')}>
        Upload Product
      </button>

      <div className={styles.searchWrap}>
        <div className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, Catalogue, Code"
        />
      </div>

      {filtered.slice(0, 15).map((p, idx) => (
        <ProductCard key={p.id} product={p} index={idx} />
      ))}
    </div>
  );
}
