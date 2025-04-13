import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Shop.css";

const Shop = () => {
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const brands = [
    "ZARA",
    "MANGO",
    "MASSIMO DUTTI",
    "PULL&BEAR",
    "BERSHKA",
    "STRADIVARIUS",
    "OYSHO",
    "ZARA HOME",
    "LEFTIES",
    "UTERQÜE",
    "ZARA KIDS",
    "ZARA TRF",
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className="shop-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="gender-selector">
        <button
          className={`gender-btn ${selectedGender === "all" ? "active" : ""}`}
          onClick={() => setSelectedGender("all")}
        >
          همه
        </button>
        <button
          className={`gender-btn ${selectedGender === "men" ? "active" : ""}`}
          onClick={() => setSelectedGender("men")}
        >
          مردانه
        </button>
        <button
          className={`gender-btn ${selectedGender === "women" ? "active" : ""}`}
          onClick={() => setSelectedGender("women")}
        >
          زنانه
        </button>
      </div>

      <div className="brands-grid">
        {brands.map((brand, index) => (
          <motion.div
            key={brand}
            className={`brand-item ${selectedBrand === brand ? "active" : ""}`}
            onClick={() => setSelectedBrand(brand)}
            variants={itemVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="brand-name">{brand}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Shop;
