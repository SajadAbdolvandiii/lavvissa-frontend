import React from "react";

const ProductCard = ({ product }) => {
  const { name, description, price, deliveryPrice, image, tag } = product;

  return (
    <div className="pick-card">
      <div
        className="pick-image"
        style={{
          backgroundImage: `url(/src/assets/images/products/bags/${image})`,
        }}
      />
      <div className="pick-content">
        <span className="pick-tag">{tag}</span>
        <h3>{name}</h3>
        <p className="pick-description">{description}</p>
        <div className="pick-price">
          <span>{price}</span>
          <span className="pick-price-toman">{deliveryPrice}</span>
        </div>
        <button className="pick-button">افزودن به سبد خرید</button>
      </div>
    </div>
  );
};

export default ProductCard;
