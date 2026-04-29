import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { syncUserWithBackend } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!auth.currentUser) {
      setDbUser(null);
      return null;
    }

    try {
      await auth.currentUser.getIdToken(true);
      const syncedUser = await syncUserWithBackend();
      setDbUser(syncedUser);
      return syncedUser;
    } catch (error) {
      console.error('Failed to refresh user with backend', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await refreshUser();
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return { user, dbUser, loading, refreshUser, logout };
};
