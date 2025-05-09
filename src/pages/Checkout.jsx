import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

const Checkout = () => {
  const { cart, getCartTotals, saveCheckoutInfo, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    paymentMethod: "kart-be-kart",
    orderNotes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  const { itemsCount, subtotal, deliveryTotal } = getCartTotals();
  const orderTotal = subtotal + deliveryTotal;

  useEffect(() => {
    // Redirect to shop if cart is empty
    if (cart.length === 0) {
      navigate("/shop");
    }

    // Pre-fill form with user data if logged in
    if (currentUser) {
      setFormData((prevData) => ({
        ...prevData,
        email: currentUser.email || "",
        fullName: currentUser.displayName || "",
      }));
    }
  }, [cart, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Shipping info validation
    if (step === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "نام و نام خانوادگی الزامی است";
      if (!formData.email.trim()) {
        newErrors.email = "ایمیل الزامی است";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "فرمت ایمیل صحیح نیست";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "شماره تلفن الزامی است";
      } else if (!/^09\d{9}$/.test(formData.phone)) {
        newErrors.phone = "فرمت شماره موبایل صحیح نیست";
      }
      if (!formData.address.trim()) newErrors.address = "آدرس الزامی است";
      if (!formData.city.trim()) newErrors.city = "شهر الزامی است";
      if (!formData.province.trim()) newErrors.province = "استان الزامی است";
    }

    // Payment validation
    if (step === 2) {
      if (!formData.paymentMethod)
        newErrors.paymentMethod = "انتخاب روش پرداخت الزامی است";
    }

    return newErrors;
  };

  const handleNextStep = () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setStep((prevStep) => prevStep + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Organize checkout data
      const checkoutData = {
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          province: formData.province,
        },
        paymentMethod: formData.paymentMethod,
        orderNotes: formData.orderNotes,
      };

      // Save order info
      const orderId = await saveCheckoutInfo(checkoutData);

      // Navigate to success page with order ID
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({
        submit:
          "خطا در ثبت سفارش. لطفا دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render shipping form
  const renderShippingForm = () => (
    <div className="checkout-form-section">
      <h2>اطلاعات ارسال</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">نام و نام خانوادگی *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? "error" : ""}
          />
          {errors.fullName && (
            <span className="error-message">{errors.fullName}</span>
          )}
        </div>
      </div>

      <div className="form-row two-columns">
        <div className="form-group">
          <label htmlFor="email">ایمیل *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">شماره موبایل *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="09xxxxxxxxx"
            className={errors.phone ? "error" : ""}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address">آدرس کامل *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? "error" : ""}
          />
          {errors.address && (
            <span className="error-message">{errors.address}</span>
          )}
        </div>
      </div>

      <div className="form-row three-columns">
        <div className="form-group">
          <label htmlFor="province">استان *</label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={errors.province ? "error" : ""}
          />
          {errors.province && (
            <span className="error-message">{errors.province}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city">شهر *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? "error" : ""}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">کد پستی</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="continue-button"
          onClick={handleNextStep}
        >
          ادامه به پرداخت
        </button>
      </div>
    </div>
  );

  // Render payment form
  const renderPaymentForm = () => (
    <div className="checkout-form-section">
      <h2>اطلاعات پرداخت</h2>

      <div className="payment-methods">
        <div className="payment-method">
          <input
            type="radio"
            id="kart-be-kart"
            name="paymentMethod"
            value="kart-be-kart"
            checked={formData.paymentMethod === "kart-be-kart"}
            onChange={handleChange}
          />
          <label htmlFor="kart-be-kart">
            <span className="payment-method-name">کارت به کارت</span>
            <p className="payment-method-description">
              پرداخت از طریق کارت به کارت به شماره 6104-3377-7014-2720 به نام
              سجاد عبدالوندی
            </p>
          </label>
        </div>

        {errors.paymentMethod && (
          <span className="error-message">{errors.paymentMethod}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="orderNotes">توضیحات سفارش (اختیاری)</label>
          <textarea
            id="orderNotes"
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleChange}
            placeholder="هرگونه اطلاعات اضافی که میخواهید ما بدانیم..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="back-button"
          onClick={handlePreviousStep}
        >
          بازگشت
        </button>
        <button
          type="button"
          className="continue-button"
          onClick={handleNextStep}
        >
          بررسی سفارش
        </button>
      </div>
    </div>
  );

  // Render order review
  const renderOrderReview = () => (
    <div className="checkout-form-section">
      <h2>بررسی سفارش</h2>

      <div className="order-review-section">
        <h3>اطلاعات شخصی</h3>
        <div className="review-info">
          <p>
            <strong>نام و نام خانوادگی:</strong> {formData.fullName}
          </p>
          <p>
            <strong>ایمیل:</strong> {formData.email}
          </p>
          <p>
            <strong>شماره موبایل:</strong> {formData.phone}
          </p>
        </div>
      </div>

      <div className="order-review-section">
        <h3>آدرس تحویل</h3>
        <div className="review-info">
          <p>{formData.address}</p>
          <p>
            {formData.city}، {formData.province} {formData.postalCode}
          </p>
        </div>
      </div>

      <div className="order-review-section">
        <h3>محصولات سفارش</h3>
        <div className="order-items">
          {cart.map((item) => (
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
                  {item.selectedSize && <span>سایز: {item.selectedSize}</span>}
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
                <span>{(item.price * item.quantity).toLocaleString()} TL</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-review-section">
        <h3>روش پرداخت</h3>
        <div className="review-info">
          <p>{formData.paymentMethod === "kart-be-kart" && "کارت به کارت"}</p>
        </div>
      </div>

      {errors.submit && <div className="error-banner">{errors.submit}</div>}

      <div className="form-actions">
        <button
          type="button"
          className="back-button"
          onClick={handlePreviousStep}
        >
          بازگشت
        </button>
        <button
          type="submit"
          className="place-order-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="checkout-container">
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-label">اطلاعات ارسال</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">پرداخت</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-label">بررسی سفارش</div>
        </div>
      </div>

      <div className="checkout-main">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            {step === 1 && renderShippingForm()}
            {step === 2 && renderPaymentForm()}
            {step === 3 && renderOrderReview()}
          </form>
        </div>

        <div className="checkout-summary">
          <div className="summary-content">
            <h3>خلاصه سفارش</h3>

            <div className="summary-row">
              <span>تعداد اقلام:</span>
              <span>{itemsCount}</span>
            </div>

            <div className="summary-row">
              <span>قیمت محصولات:</span>
              <span>{subtotal.toLocaleString()} TL</span>
            </div>

            <div className="summary-row">
              <span>هزینه ارسال به ایران:</span>
              <span>{deliveryTotal.toLocaleString()} تومان</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>مجموع (تی ال):</span>
              <span>{subtotal.toLocaleString()} TL</span>
            </div>

            <div className="summary-total">
              <span>قیمت تحویل در ایران:</span>
              <span>{deliveryTotal.toLocaleString()} تومان</span>
            </div>

            <div className="summary-note">
              <p>محصولات از ترکیه تهیه و به ایران ارسال می‌شوند</p>
              <p>تحویل بین ۷ تا ۱۴ روز کاری</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
