import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";

// Create context
const ProductContext = createContext();

// Custom hook to use the product context
export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from Firestore
  const fetchCategories = async () => {
    try {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
      return categoriesData;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("خطا در دریافت دسته‌بندی محصولات");
      return [];
    }
  };

  // Fetch brands from Firestore
  const fetchBrands = async () => {
    try {
      const brandsSnapshot = await getDocs(collection(db, "brands"));
      const brandsData = brandsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBrands(brandsData);
      return brandsData;
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError("خطا در دریافت برندها");
      return [];
    }
  };

  // Fetch all products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
      return productsData;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("خطا در دریافت محصولات");
      setLoading(false);
      return [];
    }
  };

  // Fetch featured products from Firestore
  const fetchFeaturedProducts = async () => {
    try {
      const featuredQuery = query(
        collection(db, "products"),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(8)
      );

      const featuredSnapshot = await getDocs(featuredQuery);
      const featuredData = featuredSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFeaturedProducts(featuredData);
      return featuredData;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  };

  // Fetch a single product by ID
  const fetchProductById = async (productId) => {
    try {
      const productDoc = await getDoc(doc(db, "products", productId));

      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      } else {
        setError("محصول مورد نظر یافت نشد");
        return null;
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("خطا در دریافت اطلاعات محصول");
      return null;
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const categoryQuery = query(
        collection(db, "products"),
        where("categoryId", "==", categoryId)
      );

      const productsSnapshot = await getDocs(categoryQuery);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLoading(false);
      return productsData;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setError("خطا در دریافت محصولات دسته‌بندی");
      setLoading(false);
      return [];
    }
  };

  // Fetch products by brand
  const fetchProductsByBrand = async (brandId) => {
    setLoading(true);
    try {
      const brandQuery = query(
        collection(db, "products"),
        where("brandId", "==", brandId)
      );

      const productsSnapshot = await getDocs(brandQuery);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLoading(false);
      return productsData;
    } catch (error) {
      console.error("Error fetching products by brand:", error);
      setError("خطا در دریافت محصولات برند");
      setLoading(false);
      return [];
    }
  };

  // Search products by term
  const searchProducts = async (searchTerm) => {
    setLoading(true);
    try {
      // Currently, Firestore doesn't support text search natively
      // For MVP, we'll fetch all products and filter on the client side
      // In production, consider using Algolia or another search service

      const productsSnapshot = await getDocs(collection(db, "products"));
      const allProducts = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter products by search term
      const searchTermLower = searchTerm.toLowerCase();
      const filteredProducts = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTermLower) ||
          product.description.toLowerCase().includes(searchTermLower) ||
          (product.brandName &&
            product.brandName.toLowerCase().includes(searchTermLower)) ||
          (product.categoryName &&
            product.categoryName.toLowerCase().includes(searchTermLower))
      );

      setLoading(false);
      return filteredProducts;
    } catch (error) {
      console.error("Error searching products:", error);
      setError("خطا در جستجوی محصولات");
      setLoading(false);
      return [];
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchProducts(),
          fetchFeaturedProducts(),
        ]);
        setError(null);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("خطا در بارگذاری اطلاعات اولیه");
      }
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const value = {
    products,
    categories,
    brands,
    featuredProducts,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    fetchFeaturedProducts,
    fetchProductById,
    fetchProductsByCategory,
    fetchProductsByBrand,
    searchProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
