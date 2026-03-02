import { useState } from "react";
import { Search, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IncidentCard } from "@/components/IncidentCard";
import { useGetAllIncidents } from "@/hooks/useQueries";
import { useActor } from "@/hooks/useActor";
import { Status } from "../backend";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all");

  const { isFetching: actorFetching } = useActor();
  const { data: incidents, isLoading, isError, refetch, isFetching } = useGetAllIncidents();

  const isInitializing = actorFetching && !incidents;

  const filtered = (incidents ?? []).filter((inc) => {
    const matchesSearch =
      search === "" ||
      inc.title.toLowerCase().includes(search.toLowerCase()) ||
      inc.affectedService.toLowerCase().includes(search.toLowerCase()) ||
      inc.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && inc.status !== Status.resolved) ||
      (statusFilter === "resolved" && inc.status === Status.resolved);

    return matchesSearch && matchesStatus;
  });

  const activeIncidents = filtered.filter((inc) => inc.status !== Status.resolved);
  const resolvedIncidents = filtered.filter((inc) => inc.status === Status.resolved);

  const showLoading = isInitializing || isLoading;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">System Status</h1>
        <p className="text-sm text-muted-foreground">
          Real-time status of all services and ongoing incidents.
        </p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search incidents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "resolved"] as const).map((f) => (
            <Button
              key={f}
              variant={statusFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {showLoading && (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading incidents…</span>
        </div>
      )}

      {/* Error state */}
      {isError && !showLoading && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold text-foreground">Failed to load incidents</p>
            <p className="text-sm text-muted-foreground mt-1">
              Unable to connect to the backend. Please try refreshing.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Content */}
      {!showLoading && !isError && (
        <>
          {/* Active incidents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Active Incidents</h2>
              {isFetching && (
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              )}
            </div>
            {activeIncidents.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-8 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 className="h-8 w-8 text-status-operational" />
                <div>
                  <p className="font-medium text-foreground">All systems operational</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No active incidents at this time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeIncidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} />
                ))}
              </div>
            )}
          </section>

          {/* Resolved incidents */}
          {resolvedIncidents.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Resolved Incidents</h2>
              <div className="space-y-3">
                {resolvedIncidents.map((inc) => (
                  <IncidentCard key={inc.id} incident={inc} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
