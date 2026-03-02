import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { Severity, Status } from "../backend";

export function useGetAllIncidents() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllIncidents();
        return result ?? [];
      } catch (err) {
        console.error("getAllIncidents error:", err);
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
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
      if (!actor) throw new Error("Actor not initialized");
      return actor.createIncident(id, title, description, affectedService, severity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
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
      if (!actor) throw new Error("Actor not initialized");
      return actor.addUpdate(incidentId, title, description, affectedService, severity, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
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
      if (!actor) throw new Error("Actor not initialized");
      return actor.changeStatus(incidentId, title, description, affectedService, severity, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useDeleteIncident() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteIncident(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });
}

export function useIsIdAlreadyUsed() {
  const { actor } = useActor();

  return async (id: string): Promise<boolean> => {
    if (!actor) return false;
    return actor.isIdAlreadyUsed(id);
  };
}
