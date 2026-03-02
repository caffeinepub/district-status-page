# Specification

## Summary
**Goal:** Fix the frontend-to-backend connection so that incidents load successfully on the Dashboard and Admin Panel without errors.

**Planned changes:**
- Audit and fix the canister ID environment variable so it is correctly referenced and available at runtime
- Ensure the `useActor` hook produces a valid actor instance with anonymous identity for public queries
- Fix the `useQueries` hooks (especially `getAllIncidents`) to receive a non-null actor and invoke backend calls correctly
- Resolve any provider wrapping or module initialization order issues in `App.tsx` (e.g., `ThemeProvider`, `QueryClientProvider`, `InternetIdentityProvider` ordering) that may silently prevent actor creation

**User-visible outcome:** Incidents load and display correctly on both the Dashboard and Admin Panel on page load, with no "Failed to load incidents / Unable to connect to the backend" error appearing.
