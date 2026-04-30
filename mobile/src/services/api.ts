import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = 'https://backend-vhub.vercel.app/api';

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
