import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatPriceTHB, getProducts } from '../lib/productsStore';
import styles from '../styles/ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) setProducts(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  useEffect(() => {
    setActiveIndex(0);
  }, [id]);

  if (!product) {
    return (
      <div className={styles.canvas}>
        <div className={styles.header}>
          <button className={styles.backButton} type="button" onClick={() => navigate('/')}
          >
            Back
          </button>
          <div className={styles.title}>Product detail</div>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length ? product.images : ['/placeholder.svg'];
  const safeIndex = ((activeIndex % images.length) + images.length) % images.length;

  return (
    <div className={styles.canvas}>
      <div className={styles.header}>
        <button className={styles.backButton} type="button" onClick={() => navigate('/')}
        >
          Back
        </button>
        <div className={styles.title}>Product detail</div>
      </div>

      <div className={styles.content}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            <img className={styles.mainImage} src={images[safeIndex]} alt={product.name} />
          </div>
          <div className={styles.thumbs}>
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                className={i === safeIndex ? styles.thumbActive : styles.thumb}
                onClick={() => setActiveIndex(i)}
              >
                <img className={styles.thumbImage} src={src} alt={`${product.name}-${i}`} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.metaRow}>
            <div className={styles.metaLabel}>Code</div>
            <div className={styles.code}>{product.code}</div>
          </div>
          <div className={styles.metaRow}>
            <div className={styles.metaLabel}>Price</div>
            <div className={styles.price}>{formatPriceTHB(product.price)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
