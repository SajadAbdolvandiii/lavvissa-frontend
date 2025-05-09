import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onIdTokenChanged,
  getIdToken,
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

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Create a custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userToken, setUserToken] = useState(null);

  // Using ref for session timeout to avoid recreating timers on re-renders
  const sessionTimeoutRef = useRef(null);
  const userActivityRef = useRef(Date.now());

  const db = getFirestore();

  // Track user activity for session timeout
  const resetActivityTimer = () => {
    userActivityRef.current = Date.now();
  };

  // Check for session timeout
  const checkSessionTimeout = () => {
    if (!currentUser) return;

    const now = Date.now();
    const timeElapsed = now - userActivityRef.current;

    if (timeElapsed > SESSION_TIMEOUT) {
      console.log("Session timeout, logging out user");
      logout();
    }
  };

  // Setup session timeout checker
  useEffect(() => {
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetActivityTimer);
    });

    // Set interval to check for session timeout
    const intervalId = setInterval(checkSessionTimeout, 60000); // Check every minute

    return () => {
      // Clean up event listeners and interval
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetActivityTimer);
      });
      clearInterval(intervalId);
    };
  }, [currentUser]);

  // Get fresh token and handle token refresh
  const getToken = async (forceRefresh = false) => {
    if (!currentUser) return null;

    try {
      const token = await getIdToken(currentUser, forceRefresh);
      setUserToken(token);
      return token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      // Add scopes for additional security and information
      provider.addScope("email");
      provider.addScope("profile");

      // Set auth persistence
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get user token
      const token = await getIdToken(user);
      setUserToken(token);

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
            // Store additional user metadata
            isEmailVerified: user.emailVerified,
            provider: "google",
            // Store hashed IP and user agent for fraud detection
            clientInfo: {
              lastLoginIP: window.btoa(navigator.userAgent), // Simple obfuscation
              userAgent: window.btoa(navigator.userAgent),
            },
          });
        } else {
          // Update last login time and client info
          await setDoc(
            userRef,
            {
              lastLogin: serverTimestamp(),
              clientInfo: {
                lastLoginIP: window.btoa(navigator.userAgent),
                userAgent: window.btoa(navigator.userAgent),
              },
            },
            { merge: true }
          );
        }
      } catch (firestoreError) {
        // Log the error but don't fail the authentication
        console.error("Firestore operation failed:", firestoreError);
        // The authentication was still successful, so we continue
      }

      // Reset activity timer
      resetActivityTimer();

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      // Clear session timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }

      // Clear token
      setUserToken(null);

      // Sign out from Firebase
      await signOut(auth);

      // Clear any stored credentials
      localStorage.removeItem("authUser");
      sessionStorage.removeItem("authToken");

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
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
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Get token when user logs in
        await getToken();

        // Reset activity timer
        resetActivityTimer();
      } else {
        // Clear token when user logs out
        setUserToken(null);
      }

      setLoading(false);
    });

    // Handle token refresh
    const unsubscribeToken = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // Get fresh token when ID token changes
        const token = await getIdToken(user);
        setUserToken(token);

        // Store token in sessionStorage for API calls
        sessionStorage.setItem("authToken", token);
      } else {
        // Clear token when user is signed out
        setUserToken(null);
        sessionStorage.removeItem("authToken");
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeToken();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    userToken,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
