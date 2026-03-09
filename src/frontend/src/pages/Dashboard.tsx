import { IncidentCard } from "@/components/IncidentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetAllIncidents } from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Status } from "../backend";

const SEVERITY_OPTIONS = [
  { value: "critical", label: "Critical" },
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "informational", label: "Info" },
];

const STATUS_OPTIONS = [
  { value: "investigating", label: "Investigating" },
  { value: "identified", label: "Identified" },
  { value: "monitoring", label: "Monitoring" },
  { value: "resolved", label: "Resolved" },
];

export default function Dashboard() {
  const {
    data: incidents,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllIncidents();

  const [keyword, setKeyword] = useState("");
  const [severityFilters, setSeverityFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const allIncidents = incidents ?? [];
  const isLoadingState = isLoading || isFetching;

  const hasActiveFilters =
    keyword.trim() !== "" ||
    severityFilters.length > 0 ||
    statusFilters.length > 0;

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
      // Severity filter — incident.severity is already a plain string enum value (e.g. "critical")
      if (severityFilters.length > 0) {
        if (!severityFilters.includes(incident.severity as string))
          return false;
      }
      // Status filter — incident.status is already a plain string enum value (e.g. "resolved")
      if (statusFilters.length > 0) {
        if (!statusFilters.includes(incident.status as string)) return false;
      }
      return true;
    });
  }, [allIncidents, keyword, severityFilters, statusFilters]);

  const activeIncidents = filteredIncidents.filter((i) => {
    return (i.status as string) !== Status.resolved;
  });
  const resolvedIncidents = filteredIncidents.filter((i) => {
    return (i.status as string) === Status.resolved;
  });

  const clearFilters = () => {
    setKeyword("");
    setSeverityFilters([]);
    setStatusFilters([]);
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
              data-ocid="dashboard.search_input"
            />
            {keyword && (
              <button
                type="button"
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
              onValueChange={setSeverityFilters}
              className="flex flex-wrap gap-1"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs h-7 px-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                  data-ocid="dashboard.filter.toggle"
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
              onValueChange={setStatusFilters}
              className="flex flex-wrap gap-1"
            >
              {STATUS_OPTIONS.map((opt) => (
                <ToggleGroupItem
                  key={opt.value}
                  value={opt.value}
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs h-7 px-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                  data-ocid="dashboard.filter.toggle"
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
                data-ocid="dashboard.filter.button"
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
        <div
          className="flex flex-col items-center justify-center py-16 space-y-4"
          data-ocid="dashboard.loading_state"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm font-mono">
            Loading incidents...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && !isLoadingState && (
        <div
          className="flex flex-col items-center justify-center py-16 space-y-4"
          data-ocid="dashboard.error_state"
        >
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center max-w-md space-y-3">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <h3 className="font-semibold text-foreground">
              Failed to load incidents
            </h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Unable to connect to the backend. Please try refreshing."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="gap-2"
              data-ocid="dashboard.secondary_button"
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
                {activeIncidents.length} incident
                {activeIncidents.length !== 1 ? "s" : ""}
                {hasActiveFilters &&
                  allIncidents.filter(
                    (i) => (i.status as string) !== Status.resolved,
                  ).length !== activeIncidents.length && (
                    <span className="text-muted-foreground/60">
                      {" "}
                      (filtered)
                    </span>
                  )}
              </span>
            </div>

            {activeIncidents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 space-y-2 rounded-lg border border-dashed border-border"
                data-ocid="dashboard.empty_state"
              >
                <CheckCircle2 className="h-8 w-8 text-status-resolved" />
                <p className="text-sm text-muted-foreground font-mono">
                  {hasActiveFilters
                    ? "No active incidents match your filters"
                    : "All systems operational"}
                </p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="dashboard.list">
                {activeIncidents.map((incident, idx) => (
                  <div
                    key={incident.id}
                    data-ocid={`dashboard.item.${idx + 1}`}
                  >
                    <IncidentCard incident={incident} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Resolved Incidents */}
          {(resolvedIncidents.length > 0 ||
            (hasActiveFilters &&
              allIncidents.some(
                (i) => (i.status as string) === Status.resolved,
              ))) && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-status-resolved" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                  Resolved Incidents
                </h2>
                <span className="ml-auto text-xs font-mono text-muted-foreground">
                  {resolvedIncidents.length} incident
                  {resolvedIncidents.length !== 1 ? "s" : ""}
                  {hasActiveFilters &&
                    allIncidents.filter(
                      (i) => (i.status as string) === Status.resolved,
                    ).length !== resolvedIncidents.length && (
                      <span className="text-muted-foreground/60">
                        {" "}
                        (filtered)
                      </span>
                    )}
                </span>
              </div>
              {resolvedIncidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2 rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground font-mono">
                    No resolved incidents match your filters
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resolvedIncidents.map((incident, idx) => (
                    <div
                      key={incident.id}
                      data-ocid={`dashboard.item.${idx + 1}`}
                    >
                      <IncidentCard incident={incident} />
                    </div>
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
