import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AppleSignIn from "../components/AppleSignIn";
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "ایمیل نامعتبر است";
    }

    if (!formData.password) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (formData.password.length < 8) {
      newErrors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد";
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = "نام الزامی است";
      }
      if (!formData.lastName) {
        newErrors.lastName = "نام خانوادگی الزامی است";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        navigate("/"); // Redirect to home page after successful login
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update profile with first and last name
        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
        });

        navigate("/"); // Redirect to home page after successful registration
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "#ff4444";
      case 1:
        return "#ffbb33";
      case 2:
        return "#00C851";
      case 3:
        return "#007E33";
      case 4:
        return "#007E33";
      default:
        return "#ff4444";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "خیلی ضعیف";
      case 1:
        return "ضعیف";
      case 2:
        return "متوسط";
      case 3:
        return "قوی";
      case 4:
        return "خیلی قوی";
      default:
        return "خیلی ضعیف";
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>{isLogin ? "ورود" : "ثبت نام"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="firstName"
                  placeholder="نام"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="lastName"
                  placeholder="نام خانوادگی"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {!isLogin && formData.password && (
              <div className="password-strength">
                <div
                  className="strength-bar"
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                />
                <span
                  className="strength-text"
                  style={{ color: getPasswordStrengthColor() }}
                >
                  {getPasswordStrengthText()}
                </span>
              </div>
            )}
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          {errors.submit && (
            <span className="error-message">{errors.submit}</span>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "در حال پردازش..." : isLogin ? "ورود" : "ثبت نام"}
          </button>
        </form>
        <div className="social-login">
          <AppleSignIn />
        </div>
        <p className="toggle-form">
          {isLogin ? "حساب کاربری ندارید؟" : "حساب کاربری دارید؟"}{" "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "ثبت نام" : "ورود"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
