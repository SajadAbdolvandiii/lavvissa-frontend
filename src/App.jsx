import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import "./LavvissaLanding.css";
import Shop from "./components/Shop";
import Login from "./pages/Login";

// Import product images
import crossbodyBag from "./assets/images/products/bags/crossbody-bag.jpg";
import shoulderBag from "./assets/images/products/bags/shoulder-bag.jpg";
import toteBag from "./assets/images/products/bags/tote-bag.jpg";
import clutchBag from "./assets/images/products/bags/clutch-bag.jpg";
import backpack from "./assets/images/products/bags/backpack.jpg";
import wallet from "./assets/images/products/bags/wallet.jpg";

const LavvissaLanding = () => {
  const [animationState, setAnimationState] = useState("initial");
  const [loaded, setLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const firstText = "!مثل ما نیستا";
  const secondText = "LAVVISSA";

  useEffect(() => {
    setLoaded(true);

    const firstTextTimeout = setTimeout(() => {
      setAnimationState("firstText");
    }, 300);

    const secondTextTimeout = setTimeout(() => {
      setAnimationState("secondText");
    }, 2000);

    const finalTextTimeout = setTimeout(() => {
      setAnimationState("finalText");
    }, 3700);

    return () => {
      clearTimeout(firstTextTimeout);
      clearTimeout(secondTextTimeout);
      clearTimeout(finalTextTimeout);
    };
  }, []);

  const handleNavigation = (page) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <Router>
      <div className="landing-container">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/shop" element={<Shop />} />
            <Route
              path="/"
              element={
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`animation-container ${
                      animationState === "finalText" ? "hidden" : ""
                    }`}
                  >
                    <div
                      className={`text-animation first-text ${
                        animationState === "firstText" ? "visible" : ""
                      }`}
                    >
                      {firstText}
                    </div>
                    <div
                      className={`text-animation second-text ${
                        animationState === "secondText" ? "visible" : ""
                      }`}
                    >
                      {secondText}
                    </div>
                  </div>

                  <div
                    className={`site-content ${
                      animationState === "finalText" ? "visible" : ""
                    }`}
                  >
                    <div className="main-content">
                      <header className="header">
                        <div
                          className="logo"
                          onClick={() => handleNavigation("home")}
                          style={{ cursor: "pointer" }}
                        >
                          LAVVISSA
                        </div>
                        <nav className="nav">
                          <ul>
                            <li>
                              <Link to="/collection">مجموعه محصولات</Link>
                            </li>
                            <li>
                              <Link to="/shop">فروشگاه</Link>
                            </li>
                            <li>
                              <Link to="/about">درباره ما</Link>
                            </li>
                            <li>
                              <Link to="/contact">تماس با ما</Link>
                            </li>
                          </ul>
                        </nav>
                        <div className="nav-icons">
                          <span className="icon search-icon"></span>
                          <span className="icon cart-icon"></span>
                          <Link to="/login" className="icon user-icon"></Link>
                        </div>
                      </header>

                      <section className="hero">
                        <h1 className="hero-title">ظرافت بازتعریف شده</h1>
                        <p className="hero-subtitle">
                          مجموعه منحصر به فرد ما را کشف کنید
                        </p>
                        <button className="cta-button">خرید کنید</button>
                      </section>

                      <section className="weekly-picks">
                        <h2 className="section-title">منتخب هفته</h2>
                        <div className="picks-grid">
                          <div className="pick-card">
                            <div
                              className="pick-image"
                              style={{
                                backgroundImage: `url(${crossbodyBag})`,
                              }}
                            >
                              <div className="pick-tag">جدید</div>
                            </div>
                            <div className="pick-content">
                              <h3>ZARA LEATHER CROSSBODY BAG</h3>
                              <p className="pick-description">
                                Crossbody bag with adjustable strap. Made of
                                leather with gold-tone hardware.
                              </p>
                              <div className="pick-price">1,299 TL</div>
                              <div className="pick-price-toman">
                                قیمت تحویل درب منزل: ۲,۸۰۰,۰۰۰ تومان
                              </div>
                              <button className="pick-button">
                                افزودن به سبد
                              </button>
                            </div>
                          </div>

                          <div className="pick-card">
                            <div
                              className="pick-image"
                              style={{
                                backgroundImage: `url(${shoulderBag})`,
                              }}
                            >
                              <div className="pick-tag">پرفروش</div>
                            </div>
                            <div className="pick-content">
                              <h3>ZARA MINI SHOULDER BAG</h3>
                              <p className="pick-description">
                                Mini shoulder bag with chain strap. Made of
                                leather with silver-tone hardware.
                              </p>
                              <div className="pick-price">999 TL</div>
                              <div className="pick-price-toman">
                                قیمت تحویل درب منزل: ۲,۲۰۰,۰۰۰ تومان
                              </div>
                              <button className="pick-button">
                                افزودن به سبد
                              </button>
                            </div>
                          </div>

                          <div className="pick-card">
                            <div
                              className="pick-image"
                              style={{
                                backgroundImage: `url(${toteBag})`,
                              }}
                            >
                              <div className="pick-tag">محدود</div>
                            </div>
                            <div className="pick-content">
                              <h3>ZARA LEATHER TOTE BAG</h3>
                              <p className="pick-description">
                                Large tote bag with handles. Made of leather
                                with gold-tone hardware.
                              </p>
                              <div className="pick-price">1,599 TL</div>
                              <div className="pick-price-toman">
                                قیمت تحویل درب منزل: ۳,۵۰۰,۰۰۰ تومان
                              </div>
                              <button className="pick-button">
                                افزودن به سبد
                              </button>
                            </div>
                          </div>

                          <div className="pick-card">
                            <div
                              className="pick-image"
                              style={{
                                backgroundImage: `url(${clutchBag})`,
                              }}
                            >
                              <div className="pick-tag">ویژه</div>
                            </div>
                            <div className="pick-content">
                              <h3>ZARA LEATHER CLUTCH</h3>
                              <p className="pick-description">
                                Leather clutch with chain strap. Made of leather
                                with gold-tone hardware.
                              </p>
                              <div className="pick-price">799 TL</div>
                              <div className="pick-price-toman">
                                قیمت تحویل درب منزل: ۱,۸۰۰,۰۰۰ تومان
                              </div>
                              <button className="pick-button">
                                افزودن به سبد
                              </button>
                            </div>
                          </div>

                          <div className="pick-card">
                            <div
                              className="pick-image"
                              style={{
                                backgroundImage: `url(${backpack})`,
                              }}
                            >
                              <div className="pick-tag">جدید</div>
                            </div>
                            <div className="pick-content">
                              <h3>ZARA LEATHER BACKPACK</h3>
                              <p className="pick-description">
                                Leather backpack with adjustable straps. Made of
                                leather with gold-tone hardware.
                              </p>
                              <div className="pick-price">1,899 TL</div>
                              <div className="pick-price-toman">
                                قیمت تحویل درب منزل: ۴,۲۰۰,۰۰۰ تومان
                              </div>
                              <button className="pick-button">
                                افزودن به سبد
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="testimonials">
                        <motion.div
                          className="testimonials-container"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                          whileHover={{ cursor: "default" }}
                        >
                          <div className="testimonials-track">
                            <div className="testimonials-column column-up">
                              {/* Column moving up */}
                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 25,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «واقعاً باورم نمیشه که همچین کیفیت و
                                    طراحی‌ای تو ایران داریم. من که عاشق کیف‌های
                                    لاویسا شدم. هر بار که استفاده می‌کنم، همه
                                    ازم می‌پرسن از کجا خریدی؟»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=1"
                                      alt="سارا نیک‌پور"
                                    />
                                    <div className="author-info">
                                      <h4>سارا نیک‌پور</h4>
                                      <p>طراح داخلی</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 25,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «کیف آرتمیس لاویسا یه شاهکار واقعیه. من خیلی
                                    وسواسی هستم روی کیفیت و جزئیات، ولی این کیف
                                    همه انتظاراتم رو برآورده کرد. دوخت تمیز، چرم
                                    درجه یک، و طراحی خاص.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=2"
                                      alt="مهسا رضایی"
                                    />
                                    <div className="author-info">
                                      <h4>مهسا رضایی</h4>
                                      <p>مدیر روابط عمومی</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 25,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «هر کیف لاویسا یه اثر هنری منحصر به فرده. من
                                    که مجموعه‌دار کیف هستم، واقعاً از کیفیت و
                                    خلاقیت کارهاشون شگفت‌زده شدم.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=3"
                                      alt="نگار محمدی"
                                    />
                                    <div className="author-info">
                                      <h4>نگار محمدی</h4>
                                      <p>طراح مد</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 25,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «بعد از یک سال استفاده روزانه، هنوز کیفم مثل
                                    روز اول تمیز و شیکه. این نشون میده که چقدر
                                    روی کیفیت کار دقت دارن.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=4"
                                      alt="پریا صادقی"
                                    />
                                    <div className="author-info">
                                      <h4>پریا صادقی</h4>
                                      <p>عکاس حرفه‌ای</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Duplicate cards for seamless loop */}
                              {/* ... Same cards repeated ... */}
                            </div>

                            <div className="testimonials-column column-down">
                              {/* Column moving down */}
                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "100%"] }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «طراحی کیف‌های لاویسا ترکیب هوشمندانه‌ای از
                                    سنت و مدرنیته است. هر کیف یک شاهکار هنری با
                                    هویت ایرانی است.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=5"
                                      alt="شیما کریمی"
                                    />
                                    <div className="author-info">
                                      <h4>شیما کریمی</h4>
                                      <p>وکیل دادگستری</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "100%"] }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «من همیشه دنبال کیف‌های خاص و باکیفیت بودم.
                                    لاویسا دقیقاً همون چیزی بود که می‌خواستم.
                                    الان سه تا از کیف‌هاشون رو دارم.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=6"
                                      alt="الناز حسینی"
                                    />
                                    <div className="author-info">
                                      <h4>الناز حسینی</h4>
                                      <p>مدیر بازاریابی</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "100%"] }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «کیفیت دوخت و چرم استفاده شده در کیف‌های
                                    لاویسا فوق‌العاده‌ست. من که به عنوان یه طراح
                                    لباس خیلی به جزئیات دقت می‌کنم، واقعاً تحت
                                    تأثیر قرار گرفتم.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=7"
                                      alt="مینا رضوی"
                                    />
                                    <div className="author-info">
                                      <h4>مینا رضوی</h4>
                                      <p>طراح لباس</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "100%"] }}
                                transition={{
                                  duration: 20,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «به عنوان یک عکاس، همیشه دنبال لوازمی هستم
                                    که هم کاربردی باشن و هم زیبا. کیف‌های لاویسا
                                    دقیقاً همین ترکیب رو دارن. مخصوصاً برای حمل
                                    تجهیزات عکاسی عالی هستن.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=8"
                                      alt="امیر رضایی"
                                    />
                                    <div className="author-info">
                                      <h4>امیر رضایی</h4>
                                      <p>عکاس مد</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Duplicate cards for seamless loop */}
                              {/* ... Same cards repeated ... */}
                            </div>

                            <div className="testimonials-column column-up">
                              {/* Third column moving up */}
                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «وقتی میگن صنعت مد ایران داره پیشرفت می‌کنه،
                                    منظورشون برندهایی مثل لاویساست. کیفیت در سطح
                                    برندهای لوکس جهانی.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=9"
                                      alt="ندا کمالی"
                                    />
                                    <div className="author-info">
                                      <h4>ندا کمالی</h4>
                                      <p>منتقد مد</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «برای من که همیشه درگیر جلسات کاری هستم،
                                    کیف‌های لاویسا هم شیک و رسمی هستن و هم عملی.
                                    واقعاً ارزش خریدشون رو داره.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=10"
                                      alt="لیلا حسنی"
                                    />
                                    <div className="author-info">
                                      <h4>لیلا حسنی</h4>
                                      <p>مدیر اجرایی</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «من عاشق توجه به جزئیات در کیف‌های لاویسا
                                    هستم. هر بار که یکی از کیف‌هاشون رو می‌بینم،
                                    یه چیز جدید کشف می‌کنم. این نشون میده چقدر
                                    روی طراحی وقت میذارن.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=11"
                                      alt="مریم احمدی"
                                    />
                                    <div className="author-info">
                                      <h4>مریم احمدی</h4>
                                      <p>طراح جواهرات</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «به عنوان یک عکاس، همیشه دنبال لوازمی هستم
                                    که هم کاربردی باشن و هم زیبا. کیف‌های لاویسا
                                    دقیقاً همین ترکیب رو دارن. مخصوصاً برای حمل
                                    تجهیزات عکاسی عالی هستن.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=12"
                                      alt="امیر رضایی"
                                    />
                                    <div className="author-info">
                                      <h4>امیر رضایی</h4>
                                      <p>عکاس مد</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «کیف‌های لاویسا نشون میدن که چطور میشه سنت و
                                    مدرنیته رو با هم ترکیب کرد. طرح‌های سنتی
                                    ایرانی با یک نگاه مدرن، واقعاً خیره‌کننده
                                    است.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=13"
                                      alt="نسرین محمودی"
                                    />
                                    <div className="author-info">
                                      <h4>نسرین محمودی</h4>
                                      <p>استاد دانشگاه هنر</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              <motion.div
                                className="testimonial-card"
                                animate={{ y: ["0%", "-100%"] }}
                                transition={{
                                  duration: 22,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                data-hover-pause="true"
                              >
                                <div className="testimonial-content">
                                  <p>
                                    «هر کیف لاویسا یک اثر هنری منحصر به فرده. من
                                    که مجموعه‌دار کیف هستم، از کیفیت و خلاقیت
                                    کارهاشون شگفت‌زده شدم. هر کدوم یک داستان خاص
                                    خودش رو داره.»
                                  </p>
                                  <div className="testimonial-author">
                                    <img
                                      src="https://i.pravatar.cc/100?img=14"
                                      alt="فرناز کریمی"
                                    />
                                    <div className="author-info">
                                      <h4>فرناز کریمی</h4>
                                      <p>مجموعه‌دار هنری</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </section>

                      <footer className="footer">
                        <div className="footer-content">
                          <div className="footer-column">
                            <h4>درباره ما</h4>
                            <ul>
                              <li>
                                <a href="#story">داستان ما</a>
                              </li>
                              <li>
                                <a href="#values">ارزش‌های ما</a>
                              </li>
                              <li>
                                <a href="#team">تیم ما</a>
                              </li>
                            </ul>
                          </div>
                          <div className="footer-column">
                            <h4>خدمات مشتری</h4>
                            <ul>
                              <li>
                                <a href="#shipping">اطلاعات ارسال</a>
                              </li>
                              <li>
                                <a href="#returns">بازگشت کالا</a>
                              </li>
                              <li>
                                <a href="#faq">سوالات متداول</a>
                              </li>
                            </ul>
                          </div>
                          <div className="footer-column">
                            <h4>تماس با ما</h4>
                            <ul>
                              <li>
                                <a href="#contact">ارتباط با ما</a>
                              </li>
                              <li>
                                <a href="#support">پشتیبانی</a>
                              </li>
                              <li>
                                <a href="#feedback">بازخورد</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="copyright">
                          © ۲۰۲۴ لاویسا. تمامی حقوق محفوظ است.
                        </div>
                      </footer>
                    </div>
                  </div>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default LavvissaLanding;
