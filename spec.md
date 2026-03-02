# Specification

## Summary
**Goal:** Fix the completely broken frontend-to-backend connection so that incidents load correctly on every page load without requiring authentication.

**Planned changes:**
- Rewrite `useActor.ts` to create the actor synchronously using `HttpAgent` with anonymous identity, never returning null/undefined, and logging the resolved canister ID to the browser console at initialization time.
- Rewrite `useQueries.ts` so every hook calls `useActor()` at the top, asserts the actor is non-null before passing it to React Query's `queryFn`, and surfaces raw error messages in the query error state.
- Fix provider order in `App.tsx` to be exactly: `ThemeProvider` → `QueryClientProvider` → `InternetIdentityProvider` → `RouterProvider`, with no hooks called outside a valid provider context.
- Remove all `enabled: !!actor` guards or similar conditions that prevent `getAllIncidents` from running for unauthenticated users — the query must fire on every page load.
- Ensure the Vite environment variable for the canister ID (`VITE_CANISTER_ID_BACKEND` or equivalent) is referenced consistently in one place and exposed correctly in the build config.

**User-visible outcome:** The Dashboard loads incidents immediately on a fresh page load without errors or manual refresh, for both authenticated and anonymous users, while all existing features (admin panel, search/filter, delete, light/dark toggle, Internet Identity login) continue to work correctly.
