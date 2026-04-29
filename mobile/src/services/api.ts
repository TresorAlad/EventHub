import axios from 'axios';
import { auth } from '../config/firebase';

// ✅ Pour le développement local avec Expo Go :
//    Le téléphone doit être sur le MÊME réseau Wi-Fi que votre machine.
//    Remplacez l'IP par celle affichée par "hostname -I" sur votre machine.
//
// ✅ Pour la production (EAS Build) :
//    Décommentez la ligne PROD_URL et commentez la DEV_URL.

const DEV_URL = process.env.EXPO_PUBLIC_API_URL_DEV || 'http://192.168.1.74:5000/api';
const PROD_URL = process.env.EXPO_PUBLIC_API_URL_PROD || 'https://backend-vhub.vercel.app/api';

// Change to PROD_URL when deploying via EAS Build
const API_URL = __DEV__ ? DEV_URL : PROD_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes max
});

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === 'object' && 'success' in (payload as Record<string, unknown>)) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

// Attach Firebase ID token to every authenticated request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (err) {
      console.warn('Impossible de récupérer le token Firebase:', err);
    }
  }
  return config;
});

// Global response error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.config?.url || '';
    const status = error?.response?.status || 'Réseau';
    console.error(`[API Error] ${status} → ${url}`, error?.response?.data || error?.message);
    return Promise.reject(error);
  }
);

export const syncUserWithBackend = async () => {
  const response = await api.post('/auth/sync');
  return unwrap(response.data);
};

export const getEvents = async () => {
  const response = await api.get('/events');
  return unwrap(response.data);
};

export const createEvent = async (eventData: FormData) => {
  const response = await api.post('/events', eventData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response.data);
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return unwrap(response.data);
};

export const updateProfile = async (data: { name?: string; bio?: string; avatar?: string }) => {
  const response = await api.put('/auth/profile', data);
  return unwrap(response.data);
};

export default api;
