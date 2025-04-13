import React from "react";
import ProductCard from "../products/ProductCard";

const WeeklyPicks = () => {
  const products = [
    {
      id: 1,
      name: "ZARA LEATHER CROSSBODY BAG",
      description: "کیف چرمی زیبا و کاربردی",
      price: "2,499 TL",
      deliveryPrice: "150,000 تومان",
      image: "crossbody-bag.jpg",
      tag: "جدید",
    },
    {
      id: 2,
      name: "ZARA MINI SHOULDER BAG",
      description: "کیف شانه ای کوچک و شیک",
      price: "1,999 TL",
      deliveryPrice: "150,000 تومان",
      image: "shoulder-bag.jpg",
      tag: "پرفروش",
    },
    {
      id: 3,
      name: "ZARA LEATHER TOTE BAG",
      description: "کیف دستی چرمی بزرگ",
      price: "3,499 TL",
      deliveryPrice: "150,000 تومان",
      image: "tote-bag.jpg",
      tag: "محدود",
    },
    {
      id: 4,
      name: "ZARA LEATHER CLUTCH",
      description: "کیف دستی چرمی کوچک",
      price: "1,499 TL",
      deliveryPrice: "150,000 تومان",
      image: "clutch-bag.jpg",
      tag: "ویژه",
    },
    {
      id: 5,
      name: "ZARA LEATHER BACKPACK",
      description: "کوله پشتی چرمی",
      price: "2,999 TL",
      deliveryPrice: "150,000 تومان",
      image: "backpack.jpg",
      tag: "جدید",
    },
    {
      id: 6,
      name: "ZARA LEATHER WALLET",
      description: "کیف پول چرمی",
      price: "999 TL",
      deliveryPrice: "150,000 تومان",
      image: "wallet.jpg",
      tag: "پرفروش",
    },
  ];

  return (
    <section className="weekly-picks">
      <h2 className="section-title">پیشنهاد هفته</h2>
      <div className="picks-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default WeeklyPicks;
