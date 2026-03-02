import { AlertCircle, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IncidentCard } from "@/components/IncidentCard";
import { useGetAllIncidents } from "@/hooks/useQueries";
import { Status } from "../backend";

export default function Dashboard() {
  const { data: incidents, isLoading, isError, error, refetch, isFetching } = useGetAllIncidents();

  const allIncidents = incidents ?? [];

  const activeIncidents = allIncidents.filter((i) => i.status !== Status.resolved);
  const resolvedIncidents = allIncidents.filter((i) => i.status === Status.resolved);

  const isLoadingState = isLoading || isFetching;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
          System Status
        </h1>
        <p className="text-muted-foreground text-sm">
          Real-time status of all services and ongoing incidents.
        </p>
      </div>

      {/* Loading State */}
      {isLoadingState && !isError && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-mono">Loading incidents...</p>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoadingState && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center max-w-md space-y-3">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h3 className="font-semibold text-foreground">Failed to load incidents</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Unable to connect to the backend. Please try refreshing."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoadingState && !isError && (
        <>
          {/* Active Incidents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-severity-critical" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                Active Incidents
              </h2>
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                {activeIncidents.length} incident{activeIncidents.length !== 1 ? "s" : ""}
              </span>
            </div>

            {activeIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2 rounded-lg border border-dashed border-border">
                <CheckCircle2 className="h-8 w-8 text-status-resolved" />
                <p className="text-sm text-muted-foreground font-mono">All systems operational</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            )}
          </section>

          {/* Resolved Incidents */}
          {resolvedIncidents.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-resolved" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                  Resolved Incidents
                </h2>
                <span className="ml-auto text-xs font-mono text-muted-foreground">
                  {resolvedIncidents.length} incident{resolvedIncidents.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3">
                {resolvedIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
