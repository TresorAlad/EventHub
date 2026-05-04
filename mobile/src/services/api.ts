import axios from 'axios';
import axiosRetry, { exponentialDelay, isNetworkOrIdempotentRequestError } from 'axios-retry';
import { getCachedIdToken } from '../lib/firebaseToken';

// Backend production (Vercel)
const API_URL = 'https://backend-vhub.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  // Vercel peut avoir des cold starts ; 15s + axios-retry couvrent.
  timeout: 15000,
});

// Retry exponentiel : encaisse les cold starts Vercel et les pertes réseau passagères
// sans pénaliser l'utilisateur. On retry les erreurs réseau, les 5xx, 408 et 429.
axiosRetry(api, {
  retries: 3,
  retryDelay: exponentialDelay,
  shouldResetTimeout: true,
  retryCondition: (error) => {
    if (isNetworkOrIdempotentRequestError(error)) return true;
    const status = error.response?.status;
    if (!status) return true;
    if (status >= 500) return true;
    if (status === 408 || status === 429) return true;
    return false;
  },
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

// Attach Firebase ID token (depuis le cache mémoire) à chaque requête authentifiée.
// Le cache évite des appels `getIdToken()` réseau répétés à chaque requête API.
api.interceptors.request.use(async (config) => {
  try {
    const token = await getCachedIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn('Impossible de récupérer le token Firebase:', err);
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

export type OrganizerRequestPayload = {
  communityName: string;
  description: string;
  phone: string;
  website?: string;
  proofUrl?: string;
};

export const submitOrganizerRequest = async (payload: OrganizerRequestPayload) => {
  const response = await api.post('/organizer-requests', payload);
  return unwrap(response.data);
};

export const getMyOrganizerRequest = async () => {
  const response = await api.get('/organizer-requests/me');
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

export const requestOrganizerRole = async () => {
  const response = await api.post('/auth/request-organizer');
  return unwrap(response.data);
};

// Warmup : ping le backend Vercel au cold start app pour éviter qu'un user hit
// une fonction froide sur sa première vraie requête. Best-effort, ne bloque rien.
// On pointe sur GET /events car il est public, léger, et la réponse pré-chauffe
// le cache React Query (le Home aura ses events instantanément).
let warmupPromise: Promise<unknown> | null = null;
export const warmupBackend = (): Promise<unknown> => {
  if (warmupPromise) return warmupPromise;
  warmupPromise = api
    .get('/events', { timeout: 8000 })
    .catch(() => {
      // Permettre une re-tentative future si le ping initial a échoué.
      warmupPromise = null;
    });
  return warmupPromise;
};

export default api;
