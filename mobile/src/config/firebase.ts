import { initializeApp } from 'firebase/app';
import { getApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore - 'getReactNativePersistence' is missing in types but exists at runtime per Firebase console warning
import { getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD8diuE9DafkW2Q8yGelyVbuOdQ_vxQ0Vg',
  authDomain: 'eventhub-4e196.firebaseapp.com',
  projectId: 'eventhub-4e196',
  storageBucket: 'eventhub-4e196.firebasestorage.app',
  messagingSenderId: '573518128565',
  appId: '1:573518128565:android:446ec487ea74adfb9465fc',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();
export default app;
