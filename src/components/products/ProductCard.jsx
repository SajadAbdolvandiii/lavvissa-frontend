import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, addToCart }) => {
  const { id, name, description, price, deliveryPrice, image, tag, discount } =
    product;
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div
        className="product-card-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="product-image-container">
          <img
            src={
              image.startsWith("http")
                ? image
                : `/assets/images/products/${image}`
            }
            alt={name}
            className="product-image"
          />
          {tag && <span className="product-tag">{tag}</span>}
          {discount > 0 && (
            <span className="product-discount">-{discount}%</span>
          )}

          {isHovered && (
            <div className="product-actions">
              <button
                className="quick-view-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Quick view logic here
                }}
              >
                نمایش سریع
              </button>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                افزودن به سبد خرید
              </button>
            </div>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">
            {description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </p>
          <div className="product-price-container">
            {discount > 0 && (
              <span className="product-original-price">
                {((price * (100 + discount)) / 100).toLocaleString()} TL
              </span>
            )}
            <span className="product-price">{price.toLocaleString()} TL</span>
            <span className="product-delivery-price">
              {deliveryPrice.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
