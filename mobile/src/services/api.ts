import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = 'http://localhost:5000/api'; // Change to your machine's IP if testing on real device

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const syncUserWithBackend = async () => {
  try {
    const response = await api.post('/auth/sync');
    return response.data;
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = async (eventData: FormData) => {
  try {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export default api;
