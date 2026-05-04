import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { syncUserWithBackend, syncUserWithBackendWithRole } from '../services/api';
import { clearCachedIdToken, getCachedIdToken } from '../lib/firebaseToken';

const SIGNUP_ROLE_KEY = 'eventhub:signupDesiredRole';
const SIGNUP_ORG_NAME_KEY = 'eventhub:signupOrganizationName';

export type DbUser = {
  id?: string;
  uid?: string;
  email?: string;
  name?: string;
  role?: 'USER' | 'ORGANIZER' | 'ADMIN' | string;
  organizationName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  _count?: {
    followers?: number;
    following?: number;
    favorites?: number;
    organizedEvents?: number;
  };
} | null;

type AuthContextValue = {
  user: User | null;
  dbUser: DbUser;
  loading: boolean;
  initializing: boolean;
  refreshUser: () => Promise<DbUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  // Dédup : empêche plusieurs syncs concurrents si onAuthStateChanged s'emballe.
  const syncInflight = useRef<Promise<DbUser> | null>(null);
  // Évite de re-sync inutilement le même UID (quand le User Firebase est juste muté).
  const lastSyncedUid = useRef<string | null>(null);

  const performSync = useCallback(async (firebaseUser: User): Promise<DbUser> => {
    if (syncInflight.current) {
      return syncInflight.current;
    }

    syncInflight.current = (async () => {
      try {
        // Force refresh du token pour récupérer les claims les plus récents.
        await getCachedIdToken(true);

        const desiredRole = await AsyncStorage.getItem(SIGNUP_ROLE_KEY);
        const orgName = await AsyncStorage.getItem(SIGNUP_ORG_NAME_KEY);

        const synced =
          desiredRole === 'ORGANIZER'
            ? await syncUserWithBackendWithRole('ORGANIZER', orgName || undefined)
            : await syncUserWithBackend();

        if (desiredRole === 'ORGANIZER') {
          await AsyncStorage.removeItem(SIGNUP_ROLE_KEY);
          await AsyncStorage.removeItem(SIGNUP_ORG_NAME_KEY);
        }

        lastSyncedUid.current = firebaseUser.uid;
        return synced as DbUser;
      } catch (error) {
        console.error('[AuthProvider] failed to sync user', error);
        return null;
      } finally {
        syncInflight.current = null;
      }
    })();

    return syncInflight.current;
  }, []);

  const refreshUser = useCallback(async (): Promise<DbUser> => {
    const fbUser = auth.currentUser;
    if (!fbUser) {
      setDbUser(null);
      return null;
    }
    setLoading(true);
    try {
      const synced = await performSync(fbUser);
      setDbUser(synced);
      return synced;
    } finally {
      setLoading(false);
    }
  }, [performSync]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } finally {
      clearCachedIdToken();
      lastSyncedUid.current = null;
      setDbUser(null);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        clearCachedIdToken();
        lastSyncedUid.current = null;
        setDbUser(null);
        setInitializing(false);
        return;
      }

      // Évite un re-sync coûteux si l'événement concerne le même utilisateur déjà synchronisé.
      if (lastSyncedUid.current === firebaseUser.uid && dbUser) {
        setInitializing(false);
        return;
      }

      setLoading(true);
      try {
        const synced = await performSync(firebaseUser);
        setDbUser(synced);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performSync]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, dbUser, loading, initializing, refreshUser, logout }),
    [user, dbUser, loading, initializing, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être appelé à l\'intérieur d\'un <AuthProvider>');
  }
  return ctx;
};
