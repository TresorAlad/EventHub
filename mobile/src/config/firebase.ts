import { initializeApp, getApp, getApps } from 'firebase/app';
// Enregistre le provider Auth avant getAuth (important avec Metro + Hermes).
import 'firebase/auth';
import { getAuth } from 'firebase/auth';

function expoPublicEnv(key: string, fallback: string): string {
  if (typeof process === 'undefined') return fallback;
  const raw = (process.env as Record<string, string | undefined>)[key];
  const trimmed = raw?.trim();
  return trimmed || fallback;
}

const firebaseConfig = {
  apiKey: expoPublicEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'AIzaSyD8diuE9DafkW2Q8yGelyVbuOdQ_vxQ0Vg'),
  authDomain: expoPublicEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'eventhub-4e196.firebaseapp.com'),
  projectId: expoPublicEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'eventhub-4e196'),
  storageBucket: expoPublicEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'eventhub-4e196.firebasestorage.app'),
  messagingSenderId: expoPublicEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '573518128565'),
  appId: expoPublicEnv('EXPO_PUBLIC_FIREBASE_APP_ID', '1:573518128565:android:446ec487ea74adfb9465fc'),
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
