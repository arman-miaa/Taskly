import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState('') ;
  const [loading, setLoading] = useState(true);


  // Google Sign-In
  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Logout Function
  const logOutUser = () => {
    return signOut(auth);
  };

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = { user, signInWithGoogle, logOutUser, loading };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
