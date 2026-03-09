import { AddUpdateForm } from "@/components/AddUpdateForm";
import { ChangeStatusForm } from "@/components/ChangeStatusForm";
import { CreateIncidentForm } from "@/components/CreateIncidentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useDeleteIncident, useGetAllIncidents } from "@/hooks/useQueries";
import { LogIn, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteIncidentResult, Status } from "../backend";

export function AdminPanel() {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: incidents, isLoading } = useGetAllIncidents();
  const deleteIncident = useDeleteIncident();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const allIncidents = incidents ?? [];
  const resolvedIncidents = allIncidents.filter(
    (inc) => Object.keys(inc.status)[0] === Status.resolved,
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteIncident.mutateAsync(id);
      if (result === DeleteIncidentResult.success) {
        toast.success("Incident deleted successfully.");
      } else if (result === DeleteIncidentResult.notResolved) {
        toast.error("Only resolved incidents can be deleted.");
      } else {
        toast.error("Incident not found.");
      }
    } catch {
      toast.error("Failed to delete incident.");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading while auth is initializing
  if (isInitializing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
        <RefreshCw className="h-5 w-5 animate-spin" />
        <span className="text-sm">Initializing…</span>
      </div>
    );
  }

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-6 text-center">
        <ShieldAlert className="h-12 w-12 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Admin Access Required
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please log in with your identity to manage incidents.
          </p>
        </div>
        <Button onClick={login} disabled={isLoggingIn} size="lg">
          {isLoggingIn ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage incidents and service status updates.
        </p>
      </div>

      <Tabs defaultValue="create">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="update">Add Update</TabsTrigger>
          <TabsTrigger value="status">Change Status</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <CreateIncidentForm />
        </TabsContent>

        <TabsContent value="update" className="mt-6">
          <AddUpdateForm incidents={allIncidents} />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <ChangeStatusForm incidents={allIncidents} />
        </TabsContent>

        <TabsContent value="delete" className="mt-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Only resolved incidents can be deleted.
            </p>

            {(isLoading || actorFetching) && (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading incidents…</span>
              </div>
            )}

            {!isLoading && resolvedIncidents.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">
                No resolved incidents to delete.
              </p>
            )}

            <div className="space-y-2">
              {resolvedIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {inc.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {inc.affectedService}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deletingId === inc.id}
                      >
                        {deletingId === inc.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Incident</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &ldquo;{inc.title}
                          &rdquo;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(inc.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
