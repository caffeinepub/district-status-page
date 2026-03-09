import { Badge } from "@/components/ui/badge";
import { Severity } from "../backend";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { label: string; className: string; dotClass: string }
> = {
  [Severity.critical]: {
    label: "Critical",
    className:
      "bg-[oklch(0.62_0.22_25/0.2)] text-[oklch(0.85_0.18_25)] border-[oklch(0.62_0.22_25/0.5)]",
    dotClass: "bg-[oklch(0.62_0.22_25)] animate-pulse",
  },
  [Severity.major]: {
    label: "Major",
    className:
      "bg-[oklch(0.68_0.18_55/0.2)] text-[oklch(0.88_0.14_55)] border-[oklch(0.68_0.18_55/0.5)]",
    dotClass: "bg-[oklch(0.68_0.18_55)]",
  },
  [Severity.minor]: {
    label: "Minor",
    className:
      "bg-[oklch(0.78_0.16_85/0.15)] text-[oklch(0.88_0.12_85)] border-[oklch(0.78_0.16_85/0.4)]",
    dotClass: "bg-[oklch(0.78_0.16_85)]",
  },
  [Severity.informational]: {
    label: "Info",
    className:
      "bg-[oklch(0.62_0.16_220/0.15)] text-[oklch(0.78_0.14_220)] border-[oklch(0.62_0.16_220/0.4)]",
    dotClass: "bg-[oklch(0.62_0.16_220)]",
  },
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config =
    severityConfig[severity] ?? severityConfig[Severity.informational];
  return (
    <Badge
      variant="outline"
      className={`font-mono text-xs font-medium tracking-wide uppercase flex items-center gap-1.5 ${config.className} ${className ?? ""}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotClass}`}
      />
      {config.label}
    </Badge>
  );
}
