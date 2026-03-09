import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IncidentDTO, Severity } from "../backend";
import { useActor } from "./useActor";

export function useGetAllIncidents() {
  const { actor, isFetching } = useActor();

  return useQuery<IncidentDTO[]>({
    queryKey: ["incidents"],
    queryFn: async () => {
      if (!actor) {
        throw new Error("Actor not initialized yet");
      }
      const result = await actor.getAllIncidents();
      return result;
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
    retry: 2,
  });
}

export function useGetIncident(incidentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<IncidentDTO | null>({
    queryKey: ["incident", incidentId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized yet");
      return actor.getIncident(incidentId);
    },
    enabled: !!actor && !isFetching && !!incidentId,
    staleTime: 10_000,
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
      return actor.createIncident(
        id,
        title,
        description,
        affectedService,
        severity,
      );
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
      return actor.addUpdate(
        incidentId,
        title,
        description,
        affectedService,
        severity,
        message,
      );
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
      return actor.changeStatus(
        incidentId,
        title,
        description,
        affectedService,
        severity,
        newStatus,
      );
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

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.isIdAlreadyUsed(id);
    },
  });
}
