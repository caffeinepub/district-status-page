import { useState, useMemo } from "react";
import { AlertCircle, CheckCircle2, RefreshCw, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { IncidentCard } from "@/components/IncidentCard";
import { useGetAllIncidents } from "@/hooks/useQueries";
import { Status, Severity } from "../backend";

const SEVERITY_OPTIONS: { value: Severity; label: string }[] = [
  { value: Severity.critical, label: "Critical" },
  { value: Severity.major, label: "Major" },
  { value: Severity.minor, label: "Minor" },
  { value: Severity.informational, label: "Info" },
];

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: Status.investigating, label: "Investigating" },
  { value: Status.identified, label: "Identified" },
  { value: Status.monitoring, label: "Monitoring" },
  { value: Status.resolved, label: "Resolved" },
];

export default function Dashboard() {
  const { data: incidents, isLoading, isError, error, refetch, isFetching } = useGetAllIncidents();

  const [keyword, setKeyword] = useState("");
  const [severityFilters, setSeverityFilters] = useState<Severity[]>([]);
  const [statusFilters, setStatusFilters] = useState<Status[]>([]);

  const allIncidents = incidents ?? [];
  const isLoadingState = isLoading || isFetching;

  const hasActiveFilters = keyword.trim() !== "" || severityFilters.length > 0 || statusFilters.length > 0;

  const filteredIncidents = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return allIncidents.filter((incident) => {
      // Keyword filter
      if (kw) {
        const matchesKeyword =
          incident.title.toLowerCase().includes(kw) ||
          incident.description.toLowerCase().includes(kw) ||
          incident.affectedService.toLowerCase().includes(kw);
        if (!matchesKeyword) return false;
      }
      // Severity filter
      if (severityFilters.length > 0) {
        const severityKey = Object.keys(incident.severity)[0] as Severity;
        if (!severityFilters.includes(severityKey)) return false;
      }
      // Status filter
      if (statusFilters.length > 0) {
        const statusKey = Object.keys(incident.status)[0] as Status;
        if (!statusFilters.includes(statusKey)) return false;
      }
      return true;
    });
  }, [allIncidents, keyword, severityFilters, statusFilters]);

  const activeIncidents = filteredIncidents.filter((i) => {
    const statusKey = Object.keys(i.status)[0];
    return statusKey !== Status.resolved;
  });
  const resolvedIncidents = filteredIncidents.filter((i) => {
    const statusKey = Object.keys(i.status)[0];
    return statusKey === Status.resolved;
  });

  const clearFilters = () => {
    setKeyword("");
    setSeverityFilters([]);
    setStatusFilters([]);
  };

  const handleSeverityChange = (values: string[]) => {
    setSeverityFilters(values as Severity[]);
  };

  const handleStatusChange = (values: string[]) => {
    setStatusFilters(values as Status[]);
  };

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

      {/* Filter / Search Controls */}
      {!isLoadingState && !isError && (
        <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-card-sm">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by title, description, or service…"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 pr-9 font-mono text-sm h-9"
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Severity Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground w-16 shrink-0">
              Severity
            </span>
            <ToggleGroup
              type="multiple"
              value={severityFilters}
              onValueChange={handleSeverityChange}
              className="flex flex-wrap gap-1"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs h-7 px-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground w-16 shrink-0">
              Status
            </span>
            <ToggleGroup
              type="multiple"
              value={statusFilters}
              onValueChange={handleStatusChange}
              className="flex flex-wrap gap-1"
            >
              {STATUS_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs h-7 px-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 text-xs font-mono gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

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
                {hasActiveFilters && allIncidents.filter(i => Object.keys(i.status)[0] !== Status.resolved).length !== activeIncidents.length && (
                  <span className="text-muted-foreground/60"> (filtered)</span>
                )}
              </span>
            </div>

            {activeIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-2 rounded-lg border border-dashed border-border">
                <CheckCircle2 className="h-8 w-8 text-status-resolved" />
                <p className="text-sm text-muted-foreground font-mono">
                  {hasActiveFilters ? "No active incidents match your filters" : "All systems operational"}
                </p>
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
          {(resolvedIncidents.length > 0 || (hasActiveFilters && allIncidents.some(i => Object.keys(i.status)[0] === Status.resolved))) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-resolved" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                  Resolved Incidents
                </h2>
                <span className="ml-auto text-xs font-mono text-muted-foreground">
                  {resolvedIncidents.length} incident{resolvedIncidents.length !== 1 ? "s" : ""}
                  {hasActiveFilters && allIncidents.filter(i => Object.keys(i.status)[0] === Status.resolved).length !== resolvedIncidents.length && (
                    <span className="text-muted-foreground/60"> (filtered)</span>
                  )}
                </span>
              </div>
              {resolvedIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground font-mono">No resolved incidents match your filters</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resolvedIncidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
