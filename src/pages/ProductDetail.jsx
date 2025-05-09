import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { fetchProductById } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = await fetchProductById(productId);
        if (productData) {
          setProduct(productData);
          // Set default selections if available
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].name);
          }
        } else {
          setError("محصول مورد نظر یافت نشد");
          navigate("/shop");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, fetchProductById, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      setError("لطفا سایز را انتخاب کنید");
      return;
    }

    if (!selectedColor && product.colors && product.colors.length > 0) {
      setError("لطفا رنگ را انتخاب کنید");
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);

    // Show success message or open cart
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);

    // If the color has a specific image, switch to it
    const colorIndex = product.colors.findIndex((c) => c.name === color);
    if (
      colorIndex !== -1 &&
      product.colors[colorIndex].imageIndex !== undefined
    ) {
      setActiveImage(product.colors[colorIndex].imageIndex);
    }
  };

  const findImageForActiveColor = () => {
    if (!product || !selectedColor || !product.colors) return null;

    const activeColor = product.colors.find(
      (color) => color.name === selectedColor
    );
    if (activeColor && activeColor.image) {
      return activeColor.image;
    }

    return null;
  };

  const getImages = () => {
    if (!product) return [];

    // Start with the main product images
    let images = product.images || [product.image];

    // Add color-specific images if they exist
    if (product.colors) {
      product.colors.forEach((color) => {
        if (color.image && !images.includes(color.image)) {
          images.push(color.image);
        }
      });
    }

    return images;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-skeleton">
          <div className="product-gallery-skeleton">
            <div className="main-image-skeleton"></div>
            <div className="thumbnail-list-skeleton">
              {[1, 2, 3].map((i) => (
                <div key={i} className="thumbnail-skeleton"></div>
              ))}
            </div>
          </div>
          <div className="product-info-skeleton">
            <div className="product-title-skeleton"></div>
            <div className="product-price-skeleton"></div>
            <div className="product-description-skeleton"></div>
            <div className="product-options-skeleton"></div>
            <div className="product-actions-skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-error">
          <h2>{error || "محصول مورد نظر یافت نشد"}</h2>
          <button onClick={() => navigate("/shop")} className="back-button">
            بازگشت به فروشگاه
          </button>
        </div>
      </div>
    );
  }

  const images = getImages();
  const colorSpecificImage = findImageForActiveColor();

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={colorSpecificImage || images[activeImage]}
              alt={product.name}
            />
            {product.tag && <span className="product-tag">{product.tag}</span>}
            {product.discount > 0 && (
              <span className="product-discount">-{product.discount}%</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-list">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    index === activeImage ? "active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-price-container">
            {product.discount > 0 ? (
              <>
                <span className="product-original-price">
                  {(
                    (product.price * (100 + product.discount)) /
                    100
                  ).toLocaleString()}{" "}
                  TL
                </span>
                <span className="product-price">
                  {product.price.toLocaleString()} TL
                </span>
              </>
            ) : (
              <span className="product-price">
                {product.price.toLocaleString()} TL
              </span>
            )}
            <span className="product-delivery-price">
              قیمت تحویل در ایران: {product.deliveryPrice.toLocaleString()}{" "}
              تومان
            </span>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="product-sizes">
              <span className="option-label">سایز:</span>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              <span className="option-label">رنگ:</span>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`color-option ${
                      selectedColor === color.name ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => handleColorSelect(color.name)}
                    title={color.name}
                  ></button>
                ))}
              </div>
              {selectedColor && (
                <span className="selected-color">{selectedColor}</span>
              )}
            </div>
          )}

          <div className="product-quantity">
            <span className="option-label">تعداد:</span>
            <div className="quantity-control">
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-button"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              افزودن به سبد خرید
            </button>

            {currentUser && (
              <button className="add-to-wishlist-button">
                افزودن به علاقه‌مندی‌ها
              </button>
            )}
          </div>

          <div className="product-meta">
            {product.categoryName && (
              <div className="meta-item">
                <span className="meta-label">دسته‌بندی:</span>
                <span className="meta-value">{product.categoryName}</span>
              </div>
            )}

            {product.brandName && (
              <div className="meta-item">
                <span className="meta-label">برند:</span>
                <span className="meta-value">{product.brandName}</span>
              </div>
            )}

            {product.sku && (
              <div className="meta-item">
                <span className="meta-label">کد محصول:</span>
                <span className="meta-value">{product.sku}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
