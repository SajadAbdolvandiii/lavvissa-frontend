import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../../context/CartContext";
import "./ProductGrid.css";

const ProductGrid = ({
  products,
  loading,
  categories = [],
  brands = [],
  title = "محصولات",
}) => {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: null,
    brand: null,
    priceRange: [0, Infinity],
    sortBy: "newest",
  });

  // Initialize with all products
  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  // Apply filters when activeFilters change
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Filter by category
    if (activeFilters.category) {
      result = result.filter(
        (product) => product.categoryId === activeFilters.category
      );
    }

    // Filter by brand
    if (activeFilters.brand) {
      result = result.filter(
        (product) => product.brandId === activeFilters.brand
      );
    }

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= activeFilters.priceRange[0] &&
        product.price <= activeFilters.priceRange[1]
    );

    // Sort products
    switch (activeFilters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [activeFilters, products]);

  const handleCategoryFilter = (categoryId) => {
    setActiveFilters((prev) => ({
      ...prev,
      category: prev.category === categoryId ? null : categoryId,
    }));
  };

  const handleBrandFilter = (brandId) => {
    setActiveFilters((prev) => ({
      ...prev,
      brand: prev.brand === brandId ? null : brandId,
    }));
  };

  const handleSortChange = (e) => {
    setActiveFilters((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setActiveFilters((prev) => ({
      ...prev,
      priceRange: [min, max === 0 ? Infinity : max],
    }));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="product-grid-container">
        <div className="product-grid-skeleton">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-price"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2 className="product-grid-title">{title}</h2>
        <div className="product-grid-filters">
          <div className="filter-group">
            <span className="filter-label">مرتب‌سازی:</span>
            <select
              className="sort-select"
              value={activeFilters.sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">جدیدترین</option>
              <option value="priceAsc">قیمت: کم به زیاد</option>
              <option value="priceDesc">قیمت: زیاد به کم</option>
              <option value="popularity">محبوب‌ترین</option>
            </select>
          </div>
        </div>
      </div>

      <div className="product-grid-layout">
        <div className="filter-sidebar">
          {categories.length > 0 && (
            <div className="filter-section">
              <h3 className="filter-title">دسته‌بندی</h3>
              <ul className="filter-options">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      className={`filter-option ${
                        activeFilters.category === category.id ? "active" : ""
                      }`}
                      onClick={() => handleCategoryFilter(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {brands.length > 0 && (
            <div className="filter-section">
              <h3 className="filter-title">برند</h3>
              <ul className="filter-options">
                {brands.map((brand) => (
                  <li key={brand.id}>
                    <button
                      className={`filter-option ${
                        activeFilters.brand === brand.id ? "active" : ""
                      }`}
                      onClick={() => handleBrandFilter(brand.id)}
                    >
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="filter-section">
            <h3 className="filter-title">قیمت (TL)</h3>
            <div className="price-range-filter">
              <button
                className={`filter-option ${
                  activeFilters.priceRange[1] === Infinity &&
                  activeFilters.priceRange[0] === 0
                    ? "active"
                    : ""
                }`}
                onClick={() => handlePriceRangeChange(0, 0)}
              >
                همه قیمت‌ها
              </button>
              <button
                className={`filter-option ${
                  activeFilters.priceRange[1] === 500 ? "active" : ""
                }`}
                onClick={() => handlePriceRangeChange(0, 500)}
              >
                زیر ۵۰۰
              </button>
              <button
                className={`filter-option ${
                  activeFilters.priceRange[0] === 500 &&
                  activeFilters.priceRange[1] === 1000
                    ? "active"
                    : ""
                }`}
                onClick={() => handlePriceRangeChange(500, 1000)}
              >
                ۵۰۰ - ۱۰۰۰
              </button>
              <button
                className={`filter-option ${
                  activeFilters.priceRange[0] === 1000 &&
                  activeFilters.priceRange[1] === 2000
                    ? "active"
                    : ""
                }`}
                onClick={() => handlePriceRangeChange(1000, 2000)}
              >
                ۱۰۰۰ - ۲۰۰۰
              </button>
              <button
                className={`filter-option ${
                  activeFilters.priceRange[0] === 2000 &&
                  activeFilters.priceRange[1] === Infinity
                    ? "active"
                    : ""
                }`}
                onClick={() => handlePriceRangeChange(2000, 0)}
              >
                بالای ۲۰۰۰
              </button>
            </div>
          </div>

          <button
            className="clear-filters-button"
            onClick={() =>
              setActiveFilters({
                category: null,
                brand: null,
                priceRange: [0, Infinity],
                sortBy: "newest",
              })
            }
          >
            پاک کردن فیلترها
          </button>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products-message">
              <p>محصولی با این فیلترها یافت نشد.</p>
              <button
                className="clear-filters-button"
                onClick={() =>
                  setActiveFilters({
                    category: null,
                    brand: null,
                    priceRange: [0, Infinity],
                    sortBy: "newest",
                  })
                }
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={handleAddToCart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
