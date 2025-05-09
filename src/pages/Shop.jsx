import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ProductGrid from "../components/products/ProductGrid";
import ShoppingCart from "../components/common/ShoppingCart";
import { motion } from "framer-motion";
import "./Shop.css";

const Shop = () => {
  const { products, categories, brands, loading, fetchProducts } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch products if they haven't been loaded yet
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const term = searchTerm.toLowerCase();
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        (product.brandName && product.brandName.toLowerCase().includes(term)) ||
        (product.categoryName &&
          product.categoryName.toLowerCase().includes(term))
    );
    setSearchResults(results);
  }, [searchTerm, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Already searching as user types, so we don't need additional logic here
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <motion.div
      className="shop-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="shop-header">
        <h1>فروشگاه لاویسا</h1>
        <p>بهترین محصولات اورجینال از برندهای مطرح دنیا</p>

        <div className="shop-actions">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="جستجوی محصولات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
            <button type="submit" className="search-button">
              جستجو
            </button>
          </form>

          <button className="cart-toggle" onClick={toggleCart}>
            سبد خرید
            <span className="cart-icon"></span>
          </button>
        </div>
      </div>

      <div className="shop-categories">
        <h2>دسته‌بندی‌های محبوب</h2>
        <div className="category-list">
          {categories.slice(0, 5).map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="category-item"
            >
              {category.imageUrl && (
                <div className="category-image">
                  <img src={category.imageUrl} alt={category.name} />
                </div>
              )}
              <span className="category-name">{category.name}</span>
            </a>
          ))}
        </div>
      </div>

      {isSearching ? (
        <div className="search-results-section">
          <h2>نتایج جستجو برای: "{searchTerm}"</h2>
          {searchResults.length === 0 ? (
            <div className="no-results">
              <p>محصولی با این مشخصات یافت نشد.</p>
              <button onClick={clearSearch} className="back-to-shop">
                بازگشت به فروشگاه
              </button>
            </div>
          ) : (
            <ProductGrid
              products={searchResults}
              loading={loading}
              title={`${searchResults.length} محصول یافت شد`}
              categories={categories}
              brands={brands}
            />
          )}
        </div>
      ) : (
        <div className="shop-content">
          <ProductGrid
            products={products}
            loading={loading}
            categories={categories}
            brands={brands}
          />
        </div>
      )}

      <ShoppingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.div>
  );
};

export default Shop;
