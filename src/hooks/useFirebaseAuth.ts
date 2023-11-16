// src/hooks/useFirebaseAuth.ts
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/firebasedb';
import { useDispatch } from 'react-redux';

export const useFirebaseAuth = () => {
  const dispatch = useDispatch();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            profilePic: firebaseUser.photoURL,
          };
          dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch]);

  return { auth };
};
