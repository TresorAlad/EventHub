import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration QueryClient pensée pour le scale (10K users) :
// - staleTime généreux : évite des refetch en cascade quand on navigue entre les onglets.
// - gcTime long : on garde les données en mémoire/disque le temps d'une session app.
// - retry exponentiel : compense les cold starts Vercel.
// - refetchOnWindowFocus désactivé (mobile, pas de focus pertinent).
// - structuralSharing actif (par défaut) : limite les re-render quand la donnée n'a pas
//   réellement changé après refetch.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min
      gcTime: 30 * 60 * 1000, // 30 min
      retry: (failureCount, error: any) => {
        // Pas de retry sur 4xx (sauf 408/429), 2 tentatives sinon.
        const status = error?.response?.status;
        if (status && status >= 400 && status < 500 && status !== 408 && status !== 429) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1500,
    },
  },
});

// Persister AsyncStorage : cache offline + reprise instantanée au cold start.
// throttleTime évite d'écrire trop souvent (perf I/O).
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'eventhub:react-query-cache',
  throttleTime: 1000,
});

// Clés centralisées : indispensable pour invalider proprement et éviter les typos.
export const queryKeys = {
  events: {
    all: ['events'] as const,
    list: () => [...queryKeys.events.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
    interactions: (id: string) => [...queryKeys.events.all, 'interactions', id] as const,
    stats: (id: string) => [...queryKeys.events.all, 'stats', id] as const,
  },
  profile: ['profile'] as const,
};
