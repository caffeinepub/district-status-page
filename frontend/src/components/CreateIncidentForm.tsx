import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateIncident, useIsIdAlreadyUsed } from '../hooks/useQueries';
import { Severity } from '../backend';

interface FormValues {
  id: string;
  title: string;
  description: string;
  affectedService: string;
  severity: Severity;
}

interface CreateIncidentFormProps {
  onSuccess?: () => void;
}

export function CreateIncidentForm({ onSuccess }: CreateIncidentFormProps) {
  const [idError, setIdError] = useState<string | null>(null);
  const createIncident = useCreateIncident();
  const checkIdUsed = useIsIdAlreadyUsed();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      severity: Severity.major,
    },
  });

  const severityValue = watch('severity');

  const onSubmit = async (data: FormValues) => {
    setIdError(null);
    try {
      const isUsed = await checkIdUsed.mutateAsync(data.id);
      if (isUsed) {
        setIdError('This ID is already in use. Please choose a different one.');
        return;
      }
      await createIncident.mutateAsync(data);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create incident:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="inc-id" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Incident ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inc-id"
            placeholder="e.g. INC-2024-001"
            className="font-mono text-sm h-9"
            {...register('id', {
              required: 'ID is required',
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message: 'Only letters, numbers, hyphens, and underscores',
              },
            })}
          />
          {errors.id && (
            <p className="text-xs text-destructive">{errors.id.message}</p>
          )}
          {idError && (
            <p className="text-xs text-destructive">{idError}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inc-service" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Affected Service <span className="text-destructive">*</span>
          </Label>
          <Input
            id="inc-service"
            placeholder="e.g. Email, Network, VPN"
            className="font-mono text-sm h-9"
            {...register('affectedService', { required: 'Affected service is required' })}
          />
          {errors.affectedService && (
            <p className="text-xs text-destructive">{errors.affectedService.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inc-title" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="inc-title"
          placeholder="Brief description of the incident"
          className="text-sm h-9"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="inc-desc" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Description
        </Label>
        <Textarea
          id="inc-desc"
          placeholder="Detailed description of the incident, impact, and scope..."
          className="text-sm resize-none min-h-[80px]"
          {...register('description')}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Severity <span className="text-destructive">*</span>
        </Label>
        <Select
          value={severityValue}
          onValueChange={(val) => setValue('severity', val as Severity)}
        >
          <SelectTrigger className="h-9 text-sm font-mono">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Severity.critical} className="font-mono text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.22_25)] inline-block" />
                Critical
              </span>
            </SelectItem>
            <SelectItem value={Severity.major} className="font-mono text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.68_0.18_55)] inline-block" />
                Major
              </span>
            </SelectItem>
            <SelectItem value={Severity.minor} className="font-mono text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.78_0.16_85)] inline-block" />
                Minor
              </span>
            </SelectItem>
            <SelectItem value={Severity.informational} className="font-mono text-sm">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[oklch(0.62_0.16_220)] inline-block" />
                Informational
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={createIncident.isPending || checkIdUsed.isPending}
        className="w-full h-9 text-sm gap-2"
      >
        {(createIncident.isPending || checkIdUsed.isPending) ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Plus className="w-3.5 h-3.5" />
        )}
        {(createIncident.isPending || checkIdUsed.isPending) ? 'Creating...' : 'Create Incident'}
      </Button>

      {createIncident.isError && (
        <p className="text-xs text-destructive text-center">
          Failed to create incident. Please try again.
        </p>
      )}
      {createIncident.isSuccess && (
        <p className="text-xs text-[oklch(0.72_0.14_145)] text-center">
          Incident created successfully.
        </p>
      )}
    </form>
  );
}
