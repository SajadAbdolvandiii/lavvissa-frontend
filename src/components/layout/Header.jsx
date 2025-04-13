import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-text">LAVVISSA</span>
        </Link>
        <nav className="nav-menu">
          <Link to="/shop" className="nav-link">
            فروشگاه
          </Link>
          <Link to="/about" className="nav-link">
            درباره ما
          </Link>
          <Link to="/contact" className="nav-link">
            تماس با ما
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
