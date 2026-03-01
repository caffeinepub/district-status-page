import { RefreshCw, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { IncidentCard } from '../components/IncidentCard';
import { useGetAllIncidents } from '../hooks/useQueries';
import { Status, Severity, type IncidentDTO } from '../backend';

function isActiveIncident(incident: IncidentDTO): boolean {
  return incident.status !== Status.resolved;
}

function OverallStatusBanner({ activeCount }: { activeCount: number }) {
  if (activeCount === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.65_0.16_145/0.1)] border border-[oklch(0.65_0.16_145/0.3)]">
        <CheckCircle2 className="w-5 h-5 text-[oklch(0.72_0.14_145)] flex-shrink-0" />
        <div>
          <p className="font-semibold text-sm text-[oklch(0.82_0.12_145)]">All Systems Operational</p>
          <p className="text-xs text-muted-foreground mt-0.5">No active incidents at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-[oklch(0.62_0.22_25/0.1)] border border-[oklch(0.62_0.22_25/0.3)]">
      <AlertCircle className="w-5 h-5 text-[oklch(0.75_0.18_25)] flex-shrink-0 animate-pulse" />
      <div>
        <p className="font-semibold text-sm text-[oklch(0.85_0.15_25)]">
          {activeCount} Active Incident{activeCount !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Our team is actively working to resolve these issues.
        </p>
      </div>
    </div>
  );
}

function SeverityIcon({ severity }: { severity: Severity }) {
  switch (severity) {
    case Severity.critical:
      return <AlertCircle className="w-4 h-4 text-[oklch(0.75_0.18_25)]" />;
    case Severity.major:
      return <AlertTriangle className="w-4 h-4 text-[oklch(0.82_0.14_55)]" />;
    case Severity.minor:
      return <AlertTriangle className="w-4 h-4 text-[oklch(0.85_0.12_85)]" />;
    case Severity.informational:
      return <Info className="w-4 h-4 text-[oklch(0.72_0.12_220)]" />;
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const { data: incidents, isLoading, isError, refetch, isFetching } = useGetAllIncidents();

  // Only treat as loaded when we have a successful response (not undefined)
  const hasData = incidents !== undefined;
  const activeIncidents = incidents?.filter(isActiveIncident) ?? [];
  const resolvedIncidents = incidents?.filter((i) => !isActiveIncident(i)) ?? [];

  // Sort active: critical first, then by updatedAt
  const severityOrder: Record<Severity, number> = {
    [Severity.critical]: 0,
    [Severity.major]: 1,
    [Severity.minor]: 2,
    [Severity.informational]: 3,
  };

  const sortedActive = [...activeIncidents].sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return Number(b.updatedAt - a.updatedAt);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">System Status</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall status banner — only show after data is confirmed loaded */}
      {hasData && !isError && (
        <div className="mb-6">
          <OverallStatusBanner activeCount={activeIncidents.length} />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-destructive">Failed to load incidents</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unable to connect to the backend. Please try refreshing.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <LoadingSkeleton />}

      {/* Active incidents */}
      {hasData && sortedActive.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono">
              Active Incidents
            </h2>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[oklch(0.62_0.22_25/0.2)] text-[oklch(0.82_0.18_25)] text-xs font-mono font-bold">
              {sortedActive.length}
            </span>
          </div>
          <div className="space-y-3">
            {sortedActive.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </section>
      )}

      {/* No incidents at all — only show after confirmed successful fetch with empty result */}
      {hasData && !isError && incidents.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-[oklch(0.65_0.16_145/0.5)]" />
          <p className="text-sm font-medium">No incidents recorded</p>
          <p className="text-xs mt-1">All systems are running normally.</p>
        </div>
      )}

      {/* Resolved incidents */}
      {hasData && resolvedIncidents.length > 0 && (
        <section>
          {sortedActive.length > 0 && <Separator className="mb-6" />}
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-mono">
              Resolved Incidents
            </h2>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold">
              {resolvedIncidents.length}
            </span>
          </div>
          <div className="space-y-3">
            {resolvedIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
