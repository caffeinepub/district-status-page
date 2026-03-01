import { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  MessageSquarePlus,
  RefreshCw,
  AlertCircle,
  LogIn,
  LogOut,
  Lock,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CreateIncidentForm } from '../components/CreateIncidentForm';
import { AddUpdateForm } from '../components/AddUpdateForm';
import { ChangeStatusForm } from '../components/ChangeStatusForm';
import { useGetAllIncidents } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

function LoginGate() {
  const { login, isLoggingIn, isLoginError, loginError, isInitializing } = useInternetIdentity();

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 flex flex-col items-center text-center">
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-6">
        <Lock className="w-7 h-7 text-muted-foreground" />
      </div>

      <h1 className="text-xl font-semibold text-foreground mb-2">Admin Access Required</h1>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
        This area is restricted to authorized administrators. Please log in to manage incidents and
        post updates to the status page.
      </p>

      {isLoginError && loginError && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 mb-6 w-full text-left">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{loginError.message}</p>
        </div>
      )}

      <Button
        onClick={login}
        disabled={isLoggingIn || isInitializing}
        size="lg"
        className="gap-2 w-full sm:w-auto min-w-[200px]"
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting…
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Log In
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground mt-4">
        Secure authentication via Internet Identity
      </p>
    </div>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState('create');
  const { data: incidents, isLoading, isError } = useGetAllIncidents();
  const { clear, isLoggingIn, identity } = useInternetIdentity();

  const allIncidents = incidents ?? [];
  const principalShort = identity
    ? identity.getPrincipal().toString().slice(0, 10) + '…'
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4.5 h-4.5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage incidents and post updates for the district status page.
            </p>
          </div>
        </div>

        {/* Logout area */}
        <div className="flex items-center gap-2">
          {principalShort && (
            <span className="hidden sm:inline text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
              {principalShort}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            disabled={isLoggingIn}
            className="gap-1.5 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: 'Total',
              value: allIncidents.length,
              color: 'text-foreground',
            },
            {
              label: 'Active',
              value: allIncidents.filter((i) => i.status !== 'resolved').length,
              color: 'text-[oklch(0.82_0.18_25)]',
            },
            {
              label: 'Resolved',
              value: allIncidents.filter((i) => i.status === 'resolved').length,
              color: 'text-[oklch(0.72_0.14_145)]',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card px-4 py-3 text-center"
            >
              <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-6">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-xs text-destructive">
            Failed to load incidents. Forms may not work correctly.
          </p>
        </div>
      )}

      {/* Action tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full h-10 mb-6 bg-muted/50">
          <TabsTrigger value="create" className="flex-1 text-xs gap-1.5 font-medium">
            <Plus className="w-3.5 h-3.5" />
            New Incident
          </TabsTrigger>
          <TabsTrigger value="update" className="flex-1 text-xs gap-1.5 font-medium">
            <MessageSquarePlus className="w-3.5 h-3.5" />
            Add Update
          </TabsTrigger>
          <TabsTrigger value="status" className="flex-1 text-xs gap-1.5 font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            Change Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-muted-foreground" />
                Create New Incident
              </CardTitle>
              <CardDescription className="text-xs">
                Report a new incident affecting district systems. It will immediately appear on the
                public status page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateIncidentForm onSuccess={() => setActiveTab('update')} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="update">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-muted-foreground" />
                Post an Update
              </CardTitle>
              <CardDescription className="text-xs">
                Add a timestamped update to an existing incident to keep users informed of progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : (
                <AddUpdateForm incidents={allIncidents} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                Change Incident Status
              </CardTitle>
              <CardDescription className="text-xs">
                Update the current status of an incident as your team progresses toward resolution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : (
                <ChangeStatusForm incidents={allIncidents} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AdminPanel() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-10 w-48 mt-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginGate />;
  }

  return <AdminContent />;
}
