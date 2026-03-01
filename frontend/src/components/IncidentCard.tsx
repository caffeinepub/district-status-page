import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Server } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import { type IncidentDTO, Status } from '../backend';

interface IncidentCardProps {
  incident: IncidentDTO;
}

function formatTimestamp(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function timeAgo(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const [isOpen, setIsOpen] = useState(incident.status !== Status.resolved);
  const isResolved = incident.status === Status.resolved;
  const hasUpdates = incident.updates.length > 0;

  const sortedUpdates = [...incident.updates].sort(
    (a, b) => Number(b.timestamp - a.timestamp)
  );

  return (
    <Card
      className={`shadow-card transition-all duration-200 ${
        isResolved
          ? 'opacity-75 border-border'
          : 'border-border hover:shadow-card-hover'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
            <h3 className={`font-semibold text-base leading-snug ${isResolved ? 'text-muted-foreground' : 'text-foreground'}`}>
              {incident.title}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-xs text-muted-foreground">
              {timeAgo(incident.updatedAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Server className="w-3 h-3" />
            <span className="font-mono">{incident.affectedService}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{formatTimestamp(incident.createdAt)}</span>
          </span>
        </div>

        {incident.description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {incident.description}
          </p>
        )}
      </CardHeader>

      {hasUpdates && (
        <CardContent className="pt-0">
          <Separator className="mb-3" />
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground w-full justify-between"
              >
                <span className="font-mono">
                  {incident.updates.length} update{incident.updates.length !== 1 ? 's' : ''}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-0">
                {sortedUpdates.map((update, index) => (
                  <div key={index} className="relative pl-4">
                    {/* Timeline line */}
                    {index < sortedUpdates.length - 1 && (
                      <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-muted border border-border" />
                    <div className="pb-3">
                      <div className="font-mono text-xs text-muted-foreground mb-1">
                        {formatTimestamp(update.timestamp)}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {update.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      )}
    </Card>
  );
}
