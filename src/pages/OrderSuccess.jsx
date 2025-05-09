import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("شناسه سفارش یافت نشد");
        setLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));

        if (orderDoc.exists()) {
          const orderData = orderDoc.data();

          // Ensure this order belongs to the current user
          if (orderData.userId === currentUser?.uid) {
            setOrder({ id: orderDoc.id, ...orderData });
          } else {
            setError("شما اجازه دسترسی به این سفارش را ندارید");
          }
        } else {
          setError("سفارش مورد نظر یافت نشد");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("خطا در دریافت اطلاعات سفارش");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, currentUser]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری اطلاعات سفارش...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>خطا در بارگذاری سفارش</h2>
          <p>{error}</p>
          <Link to="/shop" className="back-to-shop-button">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="error-state">
          <div className="error-icon">!</div>
          <h2>سفارش یافت نشد</h2>
          <p>متأسفانه اطلاعات سفارش شما در سیستم ثبت نشده است.</p>
          <Link to="/shop" className="back-to-shop-button">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "نامشخص";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="success-icon">✓</div>
        <h1>سفارش شما با موفقیت ثبت شد</h1>
        <div className="order-id">
          شماره سفارش: <span>{orderId}</span>
        </div>

        <div className="success-message">
          <p>
            از خرید شما متشکریم! سفارش شما با موفقیت در سیستم ثبت شد و در حال
            پردازش است. اطلاعات سفارش به ایمیل شما ارسال شده است.
          </p>
        </div>

        <div className="order-details">
          <div className="order-details-section">
            <h3>اطلاعات سفارش</h3>
            <div className="detail-row">
              <span>تاریخ سفارش:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span>وضعیت سفارش:</span>
              <span className="order-status">
                {order.status === "pending"
                  ? "در انتظار پرداخت"
                  : order.status === "processing"
                  ? "در حال پردازش"
                  : order.status === "shipped"
                  ? "ارسال شده"
                  : order.status === "delivered"
                  ? "تحویل داده شده"
                  : order.status === "cancelled"
                  ? "لغو شده"
                  : "نامشخص"}
              </span>
            </div>
            <div className="detail-row">
              <span>روش پرداخت:</span>
              <span>
                {order.paymentMethod === "kart-be-kart"
                  ? "کارت به کارت"
                  : order.paymentMethod}
              </span>
            </div>
          </div>

          <div className="order-details-section">
            <h3>اطلاعات ارسال</h3>
            <div className="shipping-info">
              <p>
                <strong>گیرنده:</strong> {order.shippingInfo.fullName}
              </p>
              <p>
                <strong>آدرس:</strong> {order.shippingInfo.address}
              </p>
              <p>
                {order.shippingInfo.city}، {order.shippingInfo.province}{" "}
                {order.shippingInfo.postalCode}
              </p>
              <p>
                <strong>تلفن تماس:</strong> {order.shippingInfo.phone}
              </p>
            </div>
          </div>

          <div className="order-details-section">
            <h3>اقلام سفارش</h3>
            <div className="order-items-list">
              {order.items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="order-item"
                >
                  <div className="order-item-image">
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `/assets/images/products/${item.image}`
                      }
                      alt={item.name}
                    />
                  </div>
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <div className="order-item-meta">
                      {item.selectedSize && (
                        <span>سایز: {item.selectedSize}</span>
                      )}
                      {item.selectedColor && (
                        <span>
                          رنگ: {item.selectedColor}
                          <span
                            className="color-dot"
                            style={{ backgroundColor: item.selectedColor }}
                          ></span>
                        </span>
                      )}
                      <span>تعداد: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="order-item-price">
                    <span>
                      {(item.price * item.quantity).toLocaleString()} TL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-details-section">
            <h3>خلاصه پرداخت</h3>
            <div className="payment-summary">
              <div className="summary-row">
                <span>مجموع اقلام:</span>
                <span>{order.subtotal.toLocaleString()} TL</span>
              </div>
              <div className="summary-row">
                <span>هزینه ارسال به ایران:</span>
                <span>{order.deliveryTotal.toLocaleString()} تومان</span>
              </div>
              <div className="summary-row total">
                <span>مجموع (تی ال):</span>
                <span>{order.subtotal.toLocaleString()} TL</span>
              </div>
              <div className="summary-row total">
                <span>قیمت تحویل در ایران:</span>
                <span>{order.deliveryTotal.toLocaleString()} تومان</span>
              </div>
            </div>
          </div>

          <div className="payment-instructions">
            <h3>راهنمای پرداخت</h3>
            <div className="instruction-content">
              <p>
                لطفاً مبلغ {order.subtotal.toLocaleString()} لیر ترکیه را به
                شماره کارت زیر واریز نمایید:
              </p>
              <div className="card-number">6104-3377-7014-2720</div>
              <p>به نام: سجاد عبدالوندی</p>
              <p>
                پس از واریز، رسید پرداخت را از طریق واتساپ به شماره 09123456789
                ارسال کنید. بعد از تأیید پرداخت، سفارش شما پردازش خواهد شد.
              </p>

              <div className="payment-note">
                <strong>توجه:</strong> در صورت عدم پرداخت تا 48 ساعت، سفارش شما
                به صورت خودکار لغو خواهد شد.
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <Link to="/profile/orders" className="view-orders-button">
            مشاهده سفارش‌های من
          </Link>
          <Link to="/shop" className="continue-shopping-button">
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
