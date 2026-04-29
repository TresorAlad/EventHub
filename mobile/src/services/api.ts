import axios from 'axios';
import { auth } from '../config/firebase';

// ✅ Pour le développement local avec Expo Go :
//    Le téléphone doit être sur le MÊME réseau Wi-Fi que votre machine.
//    Remplacez l'IP par celle affichée par "hostname -I" sur votre machine.
//
// ✅ Pour la production (EAS Build) :
//    Décommentez la ligne PROD_URL et commentez la DEV_URL.

const DEV_URL  = 'http://192.168.1.74:5000/api';   // Serveur local (Wi-Fi)
const PROD_URL = 'https://backend-vhub.vercel.app/api'; // Vercel (production)

// Change to PROD_URL when deploying via EAS Build
const API_URL = __DEV__ ? DEV_URL : PROD_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes max
});

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
  return response.data;
};

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (eventData: FormData) => {
  const response = await api.post('/events', eventData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: { name?: string; bio?: string; avatar?: string }) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export default api;
