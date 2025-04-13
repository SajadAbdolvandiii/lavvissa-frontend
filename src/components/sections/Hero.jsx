import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>لوازم آرایش و مراقبت پوست</h1>
        <p>بهترین محصولات آرایشی و مراقبت پوست را از ما بخواهید</p>
        <Link to="/shop" className="cta-button">
          خرید کنید
        </Link>
      </div>
    </section>
  );
};

export default Hero;
