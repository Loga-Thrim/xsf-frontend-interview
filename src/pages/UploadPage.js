import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, createId, getProducts, saveProducts } from '../lib/productsStore';
import styles from '../styles/UploadPage.module.css';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) setProducts(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const imageCountLabel = useMemo(() => `Image upload (${images.length}/6)`, [images.length]);

  async function onChooseFiles(fileList) {
    const files = Array.from(fileList || []).slice(0, Math.max(0, 6 - images.length));
    if (!files.length) return;

    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    setImages((prev) => [...prev, ...dataUrls].slice(0, 6));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const n = name.trim();
    const c = code.trim();
    const p = Number(String(price).replace(/,/g, ''));

    if (!n || !c || !Number.isFinite(p)) return;

    const product = {
      id: createId(),
      name: n,
      code: c,
      price: p,
      images: images.length ? images : ['/placeholder.svg']
    };

    const next = addProduct(products, product);
    saveProducts(next);
    navigate('/');
  }

  function onCancel() {
    navigate('/');
  }

  return (
    <div className={styles.canvas}>
      <div className={styles.title}>Upload Product</div>

      <div className={styles.uploadLabel}>Upload image</div>
      <div className={styles.counter}>{imageCountLabel}</div>

      <label className={styles.dropzone}>
        <input
          className={styles.fileInput}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={(e) => onChooseFiles(e.target.files)}
        />
        <div className={styles.dropIcon} />
        <div className={styles.dropText}>
          <span className={styles.dropTextMuted}>Drag &amp; Drop or </span>
          <span className={styles.dropTextLink}>Choose file</span>
          <span className={styles.dropTextMuted}> to upload</span>
        </div>
        <div className={styles.dropHint}>JPG. or PNG Maximum file size 50MB.</div>

        {images.length > 0 ? (
          <div className={styles.previewInside}>
            {images.map((src, idx) => (
              <img key={idx} className={styles.previewImage} src={src} alt={`upload-${idx}`} />
            ))}
          </div>
        ) : null}
      </label>

      <form onSubmit={onSubmit}>
        <div className={styles.fieldLabelName}>Product name</div>
        <input
          className={styles.inputName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
        />

        <div className={styles.fieldLabelCode}>Code</div>
        <input
          className={styles.inputCode}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code"
        />

        <div className={styles.fieldLabelPrice}>Price</div>
        <div className={styles.priceWrap}>
          <div className={styles.pricePrefix}>฿</div>
          <input
            className={styles.priceInput}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="1,000"
          />
        </div>

        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          ยกเลิก
        </button>
        <button type="submit" className={styles.submitButton}>
          ยืนยัน
        </button>
      </form>
    </div>
  );
}
