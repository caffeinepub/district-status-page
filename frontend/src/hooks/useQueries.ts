import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type IncidentDTO, type Severity } from '../backend';

export const INCIDENTS_QUERY_KEY = ['incidents'];

export function useGetAllIncidents() {
  const { actor, isFetching } = useActor();

  return useQuery<IncidentDTO[]>({
    queryKey: INCIDENTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      const result = await actor.getAllIncidents();
      // Sort by updatedAt descending
      return [...result].sort((a, b) => Number(b.updatedAt - a.updatedAt));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useGetIncident(incidentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<IncidentDTO | null>({
    queryKey: ['incident', incidentId],
    queryFn: async () => {
      if (!actor || !incidentId) return null;
      return actor.getIncident(incidentId);
    },
    enabled: !!actor && !isFetching && !!incidentId,
  });
}

export function useIsIdAlreadyUsed() {
  const { actor } = useActor();

  return async (id: string): Promise<boolean> => {
    if (!actor) return false;
    return actor.isIdAlreadyUsed(id);
  };
}

export function useCreateIncident() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      affectedService,
      severity,
    }: {
      id: string;
      title: string;
      description: string;
      affectedService: string;
      severity: Severity;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createIncident(id, title, description, affectedService, severity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY, refetchType: 'all' });
    },
  });
}

export function useAddUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      incidentId,
      title,
      description,
      affectedService,
      severity,
      message,
    }: {
      incidentId: string;
      title: string;
      description: string;
      affectedService: string;
      severity: Severity;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addUpdate(incidentId, title, description, affectedService, severity, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY, refetchType: 'all' });
    },
  });
}

export function useChangeStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      incidentId,
      title,
      description,
      affectedService,
      severity,
      newStatus,
    }: {
      incidentId: string;
      title: string;
      description: string;
      affectedService: string;
      severity: Severity;
      newStatus: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.changeStatus(incidentId, title, description, affectedService, severity, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INCIDENTS_QUERY_KEY, refetchType: 'all' });
    },
  });
}
