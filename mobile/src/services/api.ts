import axios from 'axios';
import { auth } from '../config/firebase';

// Backend production (Vercel)
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

export const syncUserWithBackendWithRole = async (desiredRole?: 'ORGANIZER', organizationName?: string) => {
  const body = desiredRole ? { desiredRole, organizationName } : undefined;
  const response = await api.post('/auth/sync', body);
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

export const deleteEvent = async (eventId: string) => {
  const response = await api.delete(`/events/${eventId}`);
  return unwrap(response.data);
};

export const updateEvent = async (eventId: string, eventData: FormData) => {
  const response = await api.put(`/events/${eventId}`, eventData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response.data);
};

export const getEventStats = async (eventId: string) => {
  const response = await api.get(`/events/${eventId}/stats`);
  return unwrap(response.data);
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return unwrap(response.data);
};

export const updateProfile = async (data: { name?: string; organizationName?: string; email?: string; bio?: string; avatar?: string }) => {
  const response = await api.put('/auth/profile', data);
  return unwrap(response.data);
};

export const uploadAvatar = async (image: { uri: string; name: string; type: string }) => {
  const formData = new FormData();
  formData.append('avatar', image as any);
  const response = await api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrap(response.data);
};

export const getEventInteractions = async (eventId: string) => {
  const response = await api.get(`/interactions/events/${eventId}`);
  return unwrap(response.data);
};

export const registerToEvent = async (eventId: string) => {
  const response = await api.post(`/interactions/events/${eventId}/register`);
  return unwrap(response.data);
};

export const unregisterFromEvent = async (eventId: string) => {
  const response = await api.delete(`/interactions/events/${eventId}/register`);
  return unwrap(response.data);
};

export const toggleFavorite = async (eventId: string) => {
  const response = await api.post(`/interactions/events/${eventId}/favorite`);
  return unwrap(response.data);
};

export const toggleFollowOrganizer = async (organizerId: string) => {
  const response = await api.post(`/interactions/organizers/${organizerId}/follow`);
  return unwrap(response.data);
};

export default api;
