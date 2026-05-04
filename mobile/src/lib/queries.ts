import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryClient';
import {
  getEvents,
  getEventInteractions,
  getEventStats,
  getProfile,
  registerToEvent,
  unregisterFromEvent,
  toggleFavorite,
  toggleFollowOrganizer,
  createEvent,
  updateEvent,
  deleteEvent,
  updateProfile,
  uploadAvatar,
} from '../services/api';

// Hooks data partagés. Chaque écran consommant les mêmes clés bénéficie du cache,
// de la déduplication d'appels concurrents, et des invalidations ciblées.

export const useEventsQuery = () => {
  return useQuery({
    queryKey: queryKeys.events.list(),
    queryFn: getEvents,
  });
};

export const useEventInteractionsQuery = (eventId: string | undefined) => {
  return useQuery({
    queryKey: eventId ? queryKeys.events.interactions(eventId) : ['events', 'interactions', 'none'],
    queryFn: () => getEventInteractions(eventId as string),
    enabled: Boolean(eventId),
    staleTime: 30 * 1000,
  });
};

export const useEventStatsQuery = (eventId: string | undefined) => {
  return useQuery({
    queryKey: eventId ? queryKeys.events.stats(eventId) : ['events', 'stats', 'none'],
    queryFn: () => getEventStats(eventId as string),
    enabled: Boolean(eventId),
    staleTime: 60 * 1000,
  });
};

export const useProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useToggleFavorite = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFavorite(eventId),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.events.interactions(eventId) });
      const prev = qc.getQueryData<any>(queryKeys.events.interactions(eventId));
      if (prev) {
        qc.setQueryData(queryKeys.events.interactions(eventId), {
          ...prev,
          favorited: !prev.favorited,
        });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(queryKeys.events.interactions(eventId), ctx.prev);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.interactions(eventId) });
    },
  });
};

export const useToggleFollowOrganizer = (organizerId: string | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFollowOrganizer(organizerId as string),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useRegisterToEvent = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => registerToEvent(eventId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.interactions(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    },
  });
};

export const useUnregisterFromEvent = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unregisterFromEvent(eventId),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.interactions(eventId) });
      qc.invalidateQueries({ queryKey: queryKeys.events.stats(eventId) });
    },
  });
};

export const useCreateEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createEvent(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useUpdateEvent = (eventId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => updateEvent(eventId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useDeleteEvent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof updateProfile>[0]) => updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};

export const useUploadAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (img: Parameters<typeof uploadAvatar>[0]) => uploadAvatar(img),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
};
