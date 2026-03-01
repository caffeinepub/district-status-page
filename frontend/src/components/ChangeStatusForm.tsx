import { useForm } from 'react-hook-form';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChangeStatus } from '../hooks/useQueries';
import { type IncidentDTO, Status } from '../backend';

interface FormValues {
  incidentId: string;
  newStatus: Status;
}

interface ChangeStatusFormProps {
  incidents: IncidentDTO[];
  onSuccess?: () => void;
}

const statusConfig: Record<Status, { label: string; dotClass: string }> = {
  [Status.investigating]: {
    label: 'Investigating',
    dotClass: 'bg-[oklch(0.62_0.22_25)]',
  },
  [Status.identified]: {
    label: 'Identified',
    dotClass: 'bg-[oklch(0.68_0.18_55)]',
  },
  [Status.monitoring]: {
    label: 'Monitoring',
    dotClass: 'bg-[oklch(0.62_0.16_220)]',
  },
  [Status.resolved]: {
    label: 'Resolved',
    dotClass: 'bg-[oklch(0.65_0.16_145)]',
  },
};

export function ChangeStatusForm({ incidents, onSuccess }: ChangeStatusFormProps) {
  const changeStatus = useChangeStatus();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<FormValues>();

  const selectedId = watch('incidentId');
  const selectedStatus = watch('newStatus');
  const selectedIncident = incidents.find((i) => i.id === selectedId);

  const onSubmit = async (data: FormValues) => {
    if (!selectedIncident || !data.newStatus) return;
    try {
      await changeStatus.mutateAsync({
        incidentId: selectedIncident.id,
        title: selectedIncident.title,
        description: selectedIncident.description,
        affectedService: selectedIncident.affectedService,
        severity: selectedIncident.severity,
        newStatus: data.newStatus,
      });
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Incident <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedId}
          onValueChange={(val) => setValue('incidentId', val)}
        >
          <SelectTrigger className="h-9 text-sm font-mono">
            <SelectValue placeholder="Select an incident..." />
          </SelectTrigger>
          <SelectContent>
            {incidents.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No incidents found</div>
            ) : (
              incidents.map((incident) => (
                <SelectItem key={incident.id} value={incident.id} className="font-mono text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground">[{incident.id}]</span>
                    <span className="truncate max-w-[200px]">{incident.title}</span>
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedIncident && (
        <div className="rounded-md bg-muted/50 border border-border px-3 py-2 text-xs text-muted-foreground font-mono">
          Current status:{' '}
          <span className="text-foreground font-medium">
            {statusConfig[selectedIncident.status]?.label ?? selectedIncident.status}
          </span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          New Status <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedStatus}
          onValueChange={(val) => setValue('newStatus', val as Status)}
        >
          <SelectTrigger className="h-9 text-sm font-mono">
            <SelectValue placeholder="Select new status..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([value, config]) => (
              <SelectItem key={value} value={value} className="font-mono text-sm">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full inline-block ${config.dotClass}`} />
                  {config.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={changeStatus.isPending || !selectedId || !selectedStatus}
        className="w-full h-9 text-sm gap-2"
      >
        {changeStatus.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5" />
        )}
        {changeStatus.isPending ? 'Updating...' : 'Update Status'}
      </Button>

      {changeStatus.isError && (
        <p className="text-xs text-destructive text-center">
          Failed to update status. Please try again.
        </p>
      )}
      {changeStatus.isSuccess && (
        <p className="text-xs text-[oklch(0.72_0.14_145)] text-center">
          Status updated successfully.
        </p>
      )}
    </form>
  );
}
