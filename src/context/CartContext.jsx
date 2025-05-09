import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load cart from localStorage or Firestore on initial render
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          // User is logged in, get cart from Firestore
          const cartRef = doc(db, "carts", currentUser.uid);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            setCart(cartData.items || []);
          } else {
            // No cart exists in Firestore, check if there's one in localStorage
            const localCart = localStorage.getItem("lavvissaCart");
            if (localCart) {
              const parsedCart = JSON.parse(localCart);
              setCart(parsedCart);

              // Save local cart to Firestore
              await setDoc(cartRef, {
                items: parsedCart,
                updatedAt: serverTimestamp(),
              });
            } else {
              setCart([]);
            }
          }
        } else {
          // User is not logged in, use localStorage
          const localCart = localStorage.getItem("lavvissaCart");
          if (localCart) {
            setCart(JSON.parse(localCart));
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to localStorage if Firestore fails
        const localCart = localStorage.getItem("lavvissaCart");
        if (localCart) {
          setCart(JSON.parse(localCart));
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [currentUser]);

  // Save cart to localStorage and Firestore whenever it changes
  useEffect(() => {
    if (!loading) {
      // Always save to localStorage for quick access
      localStorage.setItem("lavvissaCart", JSON.stringify(cart));

      // If user is logged in, also save to Firestore
      if (currentUser) {
        const saveToFirestore = async () => {
          try {
            const cartRef = doc(db, "carts", currentUser.uid);
            const cartSnap = await getDoc(cartRef);

            if (cartSnap.exists()) {
              await updateDoc(cartRef, {
                items: cart,
                updatedAt: serverTimestamp(),
              });
            } else {
              await setDoc(cartRef, {
                items: cart,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
              });
            }
          } catch (error) {
            console.error("Error saving cart to Firestore:", error);
          }
        };

        saveToFirestore();
      }
    }
  }, [cart, currentUser, loading]);

  // Add item to cart
  const addToCart = (
    product,
    quantity = 1,
    selectedSize = null,
    selectedColor = null
  ) => {
    setCart((prevCart) => {
      // Check if product is already in cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex > -1) {
        // Product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Product doesn't exist in cart, add it
        return [
          ...prevCart,
          {
            ...product,
            quantity,
            selectedSize,
            selectedColor,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (
    itemId,
    selectedSize = null,
    selectedColor = null
  ) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === itemId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    );
  };

  // Update item quantity
  const updateQuantity = (
    itemId,
    quantity,
    selectedSize = null,
    selectedColor = null
  ) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedSize, selectedColor);
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (
          item.id === itemId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const getCartTotals = () => {
    return cart.reduce(
      (totals, item) => {
        const itemTotal = item.price * item.quantity;
        return {
          itemsCount: totals.itemsCount + item.quantity,
          subtotal: totals.subtotal + itemTotal,
          deliveryTotal:
            totals.deliveryTotal + (item.deliveryPrice || 0) * item.quantity,
        };
      },
      { itemsCount: 0, subtotal: 0, deliveryTotal: 0 }
    );
  };

  // Store the checkout information in Firestore
  const saveCheckoutInfo = async (checkoutData) => {
    if (!currentUser) throw new Error("User must be logged in to checkout");

    const { shippingInfo, paymentMethod, orderNotes } = checkoutData;
    const { subtotal, deliveryTotal } = getCartTotals();

    try {
      // Create a new order
      const orderRef = doc(db, "orders", `${currentUser.uid}_${Date.now()}`);

      await setDoc(orderRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName,
        items: cart,
        subtotal,
        deliveryTotal,
        total: subtotal + deliveryTotal,
        shippingInfo,
        paymentMethod,
        orderNotes,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update user's order history
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        orders: arrayUnion(orderRef.id),
        updatedAt: serverTimestamp(),
      });

      // Clear the cart after successful checkout
      clearCart();

      return orderRef.id;
    } catch (error) {
      console.error("Error saving checkout info:", error);
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
    saveCheckoutInfo,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
