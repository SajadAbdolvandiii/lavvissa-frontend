import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ShoppingCart.css";

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotals } = useCart();
  const { itemsCount, subtotal, deliveryTotal } = getCartTotals();
  const [animateExit, setAnimateExit] = useState(false);

  const handleClose = () => {
    setAnimateExit(true);
    setTimeout(() => {
      setAnimateExit(false);
      onClose();
    }, 300);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-overlay" onClick={handleOutsideClick}>
      <div
        className={`shopping-cart ${animateExit ? "slide-out" : "slide-in"}`}
      >
        <div className="cart-header">
          <h2>سبد خرید</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        {itemsCount === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon"></div>
            <p>سبد خرید شما خالی است</p>
            <Link
              to="/shop"
              onClick={handleClose}
              className="continue-shopping"
            >
              برو به فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="cart-item"
                >
                  <div className="item-image">
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `/assets/images/products/${item.image}`
                      }
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-options">
                      {item.selectedSize && (
                        <span className="item-size">
                          اندازه: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="item-color">
                          رنگ: {item.selectedColor}
                          <span
                            className="color-dot"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </span>
                      )}
                    </div>
                    <div className="item-price">
                      <span>{item.price.toLocaleString()} TL</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>قیمت محصولات:</span>
                <span>{subtotal.toLocaleString()} TL</span>
              </div>
              <div className="summary-row">
                <span>هزینه ارسال به ایران:</span>
                <span>{deliveryTotal.toLocaleString()} تومان</span>
              </div>
              <div className="summary-total">
                <span>مجموع (تی ال):</span>
                <span>{subtotal.toLocaleString()} TL</span>
              </div>
              <div className="summary-total">
                <span>قیمت تحویل در ایران:</span>
                <span>{deliveryTotal.toLocaleString()} تومان</span>
              </div>
            </div>

            <div className="cart-actions">
              <Link
                to="/checkout"
                onClick={handleClose}
                className="checkout-button"
              >
                نهایی کردن خرید
              </Link>
              <button onClick={handleClose} className="continue-button">
                ادامه خرید
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
