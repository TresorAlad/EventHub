import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD8diuE9DafkW2Q8yGelyVbuOdQ_vxQ0Vg",
  authDomain: "eventhub-4e196.firebaseapp.com",
  projectId: "eventhub-4e196",
  storageBucket: "eventhub-4e196.firebasestorage.app",
  messagingSenderId: "573518128565",
  appId: "1:573518128565:android:446ec487ea74adfb9465fc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
