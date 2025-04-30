import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showError("لطفا ایمیل خود را وارد کنید");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      showSuccess(
        "ایمیل بازیابی رمز عبور ارسال شد. لطفا صندوق ایمیل خود را بررسی کنید."
      );
    } catch (error) {
      showError("خطا در ارسال ایمیل بازیابی رمز عبور. لطفا دوباره تلاش کنید.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>بازیابی رمز عبور</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            required
          />
        </div>
        <button type="submit" className="reset-button" disabled={loading}>
          {loading ? "در حال پردازش..." : "ارسال ایمیل بازیابی"}
        </button>
      </form>
      <div className="back-to-login">
        <button onClick={() => navigate("/login")} className="back-button">
          بازگشت به صفحه ورود
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
