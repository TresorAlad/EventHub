import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncUserWithBackend, syncUserWithBackendWithRole } from '../services/api';

const SIGNUP_ROLE_KEY = 'eventhub:signupDesiredRole';
const SIGNUP_ORG_NAME_KEY = 'eventhub:signupOrganizationName';

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
      const desiredRole = await AsyncStorage.getItem(SIGNUP_ROLE_KEY);
      const orgName = await AsyncStorage.getItem(SIGNUP_ORG_NAME_KEY);
      const syncedUser =
        desiredRole === 'ORGANIZER'
          ? await syncUserWithBackendWithRole('ORGANIZER', orgName || undefined)
          : await syncUserWithBackend();
      setDbUser(syncedUser);
      if (desiredRole === 'ORGANIZER') {
        await AsyncStorage.removeItem(SIGNUP_ROLE_KEY);
        await AsyncStorage.removeItem(SIGNUP_ORG_NAME_KEY);
      }
      return syncedUser;
    } catch (error) {
      console.error('Failed to refresh user with backend', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          await refreshUser();
        } else {
          setDbUser(null);
        }
      } catch (error) {
        console.error('Auth state handler error:', error);
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return { user, dbUser, loading, refreshUser, logout };
};
