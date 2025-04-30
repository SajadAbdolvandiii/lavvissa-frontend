import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";

// Create the auth context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const db = getFirestore();

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Try to add user to Firestore, but don't fail authentication if it doesn't work
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          });
        } else {
          // Update last login time
          await setDoc(
            userRef,
            {
              lastLogin: serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (firestoreError) {
        // Log the error but don't fail the authentication
        console.error("Firestore operation failed:", firestoreError);
        // The authentication was still successful, so we continue
      }

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Password reset
  const resetPassword = async (email) => {
    try {
      setError("");
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      if (!currentUser) throw new Error("No authenticated user");

      // Update Firebase Auth profile
      await updateProfile(currentUser, data);

      // Try to update Firestore but don't fail if it doesn't work
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {
            ...data,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (firestoreError) {
        // Log the error but don't fail the profile update
        console.error("Firestore profile update failed:", firestoreError);
        // The profile update in Auth was still successful, so we continue
      }

      // Force refresh the currentUser object
      setCurrentUser({ ...currentUser, ...data });

      return true;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Effect for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
