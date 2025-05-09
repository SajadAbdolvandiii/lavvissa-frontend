import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import "./UserOrders.css";

const UserOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(ordersQuery);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("خطا در دریافت سفارش‌ها. لطفا دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "نامشخص";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Get status text and class
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "در انتظار پرداخت",
          className: "status-pending",
        };
      case "processing":
        return {
          text: "در حال پردازش",
          className: "status-processing",
        };
      case "shipped":
        return {
          text: "ارسال شده",
          className: "status-shipped",
        };
      case "delivered":
        return {
          text: "تحویل داده شده",
          className: "status-delivered",
        };
      case "cancelled":
        return {
          text: "لغو شده",
          className: "status-cancelled",
        };
      default:
        return {
          text: "نامشخص",
          className: "",
        };
    }
  };

  if (loading) {
    return (
      <div className="user-orders">
        <h2 className="section-title">سفارش‌های من</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-orders">
        <h2 className="section-title">سفارش‌های من</h2>
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="user-orders">
        <h2 className="section-title">سفارش‌های من</h2>
        <div className="empty-orders">
          <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link to="/shop" className="shop-now-button">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders">
      <h2 className="section-title">سفارش‌های من</h2>

      <div className="orders-list">
        {orders.map((order) => {
          const { text: statusText, className: statusClass } = getStatusInfo(
            order.status
          );

          return (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-date">
                  <span>تاریخ سفارش:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="order-id">
                  <span>شماره سفارش:</span>
                  <span>{order.id.split("_")[1]}</span>
                </div>
                <div className={`order-status ${statusClass}`}>
                  {statusText}
                </div>
              </div>

              <div className="order-items">
                {order.items.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="order-item-preview"
                  >
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `/assets/images/products/${item.image}`
                      }
                      alt={item.name}
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">+{order.items.length - 3}</div>
                )}
              </div>

              <div className="order-summary">
                <div className="order-amount">
                  <span>مبلغ کل:</span>
                  <span>{order.subtotal.toLocaleString()} TL</span>
                </div>
                <div className="delivery-amount">
                  <span>هزینه ارسال:</span>
                  <span>{order.deliveryTotal.toLocaleString()} تومان</span>
                </div>
              </div>

              <div className="order-actions">
                <Link
                  to={`/order-success/${order.id}`}
                  className="view-order-details"
                >
                  مشاهده جزئیات
                </Link>

                {order.status === "pending" && (
                  <Link to="/checkout/payment" className="pay-now-button">
                    پرداخت سفارش
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrders;
