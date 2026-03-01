import { Badge } from '@/components/ui/badge';
import { Status } from '../backend';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  [Status.investigating]: {
    label: 'Investigating',
    className: 'bg-[oklch(0.62_0.22_25/0.15)] text-[oklch(0.82_0.18_25)] border-[oklch(0.62_0.22_25/0.4)] hover:bg-[oklch(0.62_0.22_25/0.2)]',
  },
  [Status.identified]: {
    label: 'Identified',
    className: 'bg-[oklch(0.68_0.18_55/0.15)] text-[oklch(0.85_0.14_55)] border-[oklch(0.68_0.18_55/0.4)] hover:bg-[oklch(0.68_0.18_55/0.2)]',
  },
  [Status.monitoring]: {
    label: 'Monitoring',
    className: 'bg-[oklch(0.62_0.16_220/0.15)] text-[oklch(0.78_0.14_220)] border-[oklch(0.62_0.16_220/0.4)] hover:bg-[oklch(0.62_0.16_220/0.2)]',
  },
  [Status.resolved]: {
    label: 'Resolved',
    className: 'bg-[oklch(0.65_0.16_145/0.15)] text-[oklch(0.78_0.14_145)] border-[oklch(0.65_0.16_145/0.4)] hover:bg-[oklch(0.65_0.16_145/0.2)]',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig[Status.investigating];
  return (
    <Badge
      variant="outline"
      className={`font-mono text-xs font-medium tracking-wide uppercase ${config.className} ${className ?? ''}`}
    >
      {config.label}
    </Badge>
  );
}
