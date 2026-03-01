import { useForm } from 'react-hook-form';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddUpdate } from '../hooks/useQueries';
import { type IncidentDTO, Status } from '../backend';

interface FormValues {
  incidentId: string;
  message: string;
}

interface AddUpdateFormProps {
  incidents: IncidentDTO[];
  onSuccess?: () => void;
}

const statusLabels: Record<Status, string> = {
  [Status.investigating]: 'Investigating',
  [Status.identified]: 'Identified',
  [Status.monitoring]: 'Monitoring',
  [Status.resolved]: 'Resolved',
};

export function AddUpdateForm({ incidents, onSuccess }: AddUpdateFormProps) {
  const addUpdate = useAddUpdate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const selectedId = watch('incidentId');
  const selectedIncident = incidents.find((i) => i.id === selectedId);

  const onSubmit = async (data: FormValues) => {
    if (!selectedIncident) return;
    try {
      await addUpdate.mutateAsync({
        incidentId: selectedIncident.id,
        title: selectedIncident.title,
        description: selectedIncident.description,
        affectedService: selectedIncident.affectedService,
        severity: selectedIncident.severity,
        message: data.message,
      });
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to add update:', err);
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
                    <span className="text-xs text-muted-foreground">
                      — {statusLabels[incident.status]}
                    </span>
                  </span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {!selectedId && errors.incidentId && (
          <p className="text-xs text-destructive">Please select an incident</p>
        )}
      </div>

      {selectedIncident && (
        <div className="rounded-md bg-muted/50 border border-border px-3 py-2 text-xs text-muted-foreground font-mono">
          <span className="text-foreground font-medium">{selectedIncident.affectedService}</span>
          {' · '}
          {selectedIncident.severity}
          {' · '}
          {statusLabels[selectedIncident.status]}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="update-msg" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Update Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="update-msg"
          placeholder="Describe the latest status, actions taken, or next steps..."
          className="text-sm resize-none min-h-[100px]"
          {...register('message', { required: 'Message is required' })}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={addUpdate.isPending || !selectedId}
        className="w-full h-9 text-sm gap-2"
      >
        {addUpdate.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <MessageSquarePlus className="w-3.5 h-3.5" />
        )}
        {addUpdate.isPending ? 'Posting...' : 'Post Update'}
      </Button>

      {addUpdate.isError && (
        <p className="text-xs text-destructive text-center">
          Failed to post update. Please try again.
        </p>
      )}
      {addUpdate.isSuccess && (
        <p className="text-xs text-[oklch(0.72_0.14_145)] text-center">
          Update posted successfully.
        </p>
      )}
    </form>
  );
}
