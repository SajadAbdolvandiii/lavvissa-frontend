import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import AppleSignIn from "../components/AppleSignIn";
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import "./Login.css";

// Animated Lock Component inspired by Lavvissa bag logo
const AnimatedLock = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(1); // 1: initial, 2: press down, 3: lift up
  const [transitionProgress, setTransitionProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Initial state
    const timer1 = setTimeout(() => {
      setAnimationPhase(2); // Move to press-down phase
    }, 500);

    // Phase 2: Press down slightly before lifting
    const timer2 = setTimeout(() => {
      setAnimationPhase(3); // Move to lift-up phase
      setIsLocked(false);

      // Start gradient transition animation
      let startTime = null;
      const duration = 800; // 800ms for the color sweep

      const animateTransition = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use cubic bezier for cinematic feel
        const cubicBezier = (t) => {
          // Cinematic curve - slow start, accelerate, then slow end
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        setTransitionProgress(cubicBezier(progress));

        if (progress < 1) {
          requestAnimationFrame(animateTransition);
        }
      };

      requestAnimationFrame(animateTransition);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Lavvissa gold/brown color from the brand palette
  const lavvissaGold = "#6A614E"; // Using the warm walnut brown from the palette

  // Calculate sweep gradient
  const getSweepGradient = () => {
    // Calculate transition positions - the sweep from bottom-left to top-right
    const progress = transitionProgress;

    // Start completely brown (when progress is 0)
    if (progress <= 0) {
      return {
        id: "brownGradient",
        content: (
          <>
            <stop offset="0%" stopColor={lavvissaGold} />
            <stop offset="100%" stopColor={lavvissaGold} />
          </>
        ),
      };
    }

    // Create a diagonal sweep effect (when progress is between 0 and 1)
    return {
      id: `sweepGradient-${Math.round(progress * 100)}`,
      content: (
        <>
          {/* Bottom-left remains brown until sweep passes */}
          <stop offset="0%" stopColor={lavvissaGold} />

          {/* Transition line starts at bottom left and moves to top right */}
          <stop
            offset={`${Math.max(0, progress - 0.2) * 100}%`}
            stopColor={lavvissaGold}
          />
          <stop
            offset={`${Math.min(progress * 100, 100)}%`}
            stopColor="#FFFFFF"
          />

          {/* Top-right becomes white as sweep passes */}
          <stop offset="100%" stopColor="#FFFFFF" />
        </>
      ),
    };
  };

  // Get the current gradient based on animation state
  const gradient =
    animationPhase < 3
      ? {
          id: "brownGradient",
          content: (
            <>
              <stop offset="0%" stopColor={lavvissaGold} />
              <stop offset="100%" stopColor={lavvissaGold} />
            </>
          ),
        }
      : getSweepGradient();

  return (
    <div className="lock-animation-container">
      {/* Lock Base */}
      <motion.div
        className="lock-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1], // Apple-like cubic-bezier
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          <defs>
            <linearGradient
              id="whiteGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F0F0F0" />
            </linearGradient>

            {/* Static brown gradient */}
            <linearGradient
              id="brownGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={lavvissaGold} />
              <stop offset="100%" stopColor={lavvissaGold} />
            </linearGradient>

            {/* Sweep gradient - from bottom-left to top-right */}
            <linearGradient
              id={gradient.id}
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              {gradient.content}
            </linearGradient>

            <filter id="lockGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Lock Body - Bag body starts brown, transitions to white with gradient sweep */}
          <motion.rect
            x="30"
            y="50"
            width="60"
            height="50"
            rx="10"
            ry="10"
            fill="none"
            stroke={`url(#${gradient.id})`}
            strokeWidth="3"
            filter="url(#lockGlow)"
          />

          {/* Handle attachments - animated to fade out with increased visibility */}
          <motion.rect
            x="38"
            y="50"
            width="6"
            height="3"
            fill="none"
            stroke={`url(#${gradient.id})`}
            animate={{
              opacity: animationPhase === 3 ? 0 : 1,
            }}
            transition={{
              duration: 0.2,
              ease: [0.42, 0, 0.58, 1],
            }}
          />

          <motion.rect
            x="76"
            y="50"
            width="6"
            height="3"
            fill="none"
            stroke={`url(#${gradient.id})`}
            animate={{
              opacity: animationPhase === 3 ? 0 : 1,
            }}
            transition={{
              duration: 0.2,
              ease: [0.42, 0, 0.58, 1],
            }}
          />

          {/* 30% smaller keyhole path - synced with handle release */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: animationPhase === 3 ? 1 : 0 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1], // Premium Apple-like cubic-bezier (sexy easing)
            }}
            transform="translate(60, 75) scale(0.245) translate(-50, -50)" // 0.35 * 0.7 = 0.245 (30% reduction)
          >
            <path
              fill="none"
              stroke="url(#whiteGradient)"
              strokeWidth="8" // Increased from 4 to 8 (2x thicker)
              d="M67.5,82.9l-8.8-39.7c3.9-2.7,6.5-7.2,6.5-12.2c0-8.2-6.6-14.9-14.9-14.9S35.5,22.8,35.5,31
              c0,4.6,2.1,8.6,5.3,11.4c0.4,0.3,0.8,0.6,1.2,0.9l-9.4,39.7H67.5z"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Lock Shackle/Handle with down-then-up motion and color transition */}
      <motion.div
        className="lock-shackle"
        initial={{ y: 0 }}
        animate={{
          y: animationPhase === 1 ? 0 : animationPhase === 2 ? 3 : -15, // 0 -> slight down (3px) -> up (-15px)
        }}
        transition={{
          type: "spring",
          stiffness: animationPhase === 2 ? 400 : 100, // Stiffer for down motion, smoother for up
          damping: animationPhase === 2 ? 15 : 25, // Less damping for down, more for up
          duration: animationPhase === 2 ? 0.2 : 0.7, // Faster down, slower up
          ease: [0.2, 0.8, 0.2, 1], // Premium Apple-like cubic-bezier
        }}
      >
        <svg width="120" height="60" viewBox="0 0 120 60">
          {/* Handle/Shackle - Bag handle with cinematic gradient transition */}
          <path
            d="M40 50 C40 25, 80 25, 80 50"
            fill="none"
            stroke={`url(#${gradient.id})`}
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#lockGlow)"
          />
        </svg>
      </motion.div>

      {/* Lock Shine Effect with white shimmer */}
      <motion.div
        className="lock-shine"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.2, 1.5] }}
        transition={{
          delay: 0.9, // Slightly delayed to appear after handle lifts
          duration: 1.2,
          times: [0, 0.4, 1],
          ease: [0.28, 0, 0.73, 1], // Luxurious Apple-like cubic-bezier
        }}
      />
    </div>
  );
};

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
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const db = getFirestore();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

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
        showSuccess("ورود با موفقیت انجام شد!");
        setTimeout(() => navigate("/"), 1000); // Redirect to home page after successful login with a short delay
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

        // Save additional user data to Firestore
        try {
          const userRef = doc(db, "users", userCredential.user.uid);
          await setDoc(userRef, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            displayName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError);
          // Continue with auth as it was successful, just log the Firestore error
        }

        showSuccess("ثبت نام با موفقیت انجام شد!");
        setTimeout(() => navigate("/"), 1000); // Redirect after short delay
      }
    } catch (error) {
      console.error("Authentication error:", error);
      let errorMessage = "خطا در احراز هویت. لطفا دوباره تلاش کنید.";

      // Provide more user-friendly error messages
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "ایمیل یا رمز عبور اشتباه است.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "این ایمیل قبلا ثبت شده است.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "خطا در اتصال به شبکه. لطفا اتصال اینترنت خود را بررسی کنید.";
      }

      showError(errorMessage);
      setErrors((prev) => ({
        ...prev,
        submit: errorMessage,
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

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-navbar">
        <button className="back-button" onClick={handleBackHome}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          بازگشت
        </button>
        <div className="nav-logo">LAVVISSA</div>
      </div>

      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedLock />

        <h2>{isLogin ? "ورود به حساب کاربری" : "ایجاد حساب جدید"}</h2>

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
          {isLogin && (
            <div className="forgot-password">
              <Link to="/forgot-password">بازیابی رمز عبور</Link>
            </div>
          )}
          {errors.submit && (
            <span className="error-message">{errors.submit}</span>
          )}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "در حال پردازش..." : isLogin ? "ورود" : "ثبت نام"}
          </button>
        </form>

        <div className="login-divider">
          <span>یا</span>
        </div>

        <div className="social-login">
          <GoogleSignIn />
          <AppleSignIn />
        </div>

        <div className="toggle-form">
          {isLogin ? "حساب کاربری ندارید؟ " : "قبلا ثبت نام کرده‌اید؟ "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
            className="toggle-btn"
          >
            {isLogin ? "ثبت نام کنید" : "وارد شوید"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
