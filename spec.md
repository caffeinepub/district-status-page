# Specification

## Summary
**Goal:** Fix the public-facing dashboard so it correctly displays the current state of incidents after they are created or updated via the admin panel.

**Planned changes:**
- Ensure the `getAllIncidents` React Query hook fetches fresh data on component mount.
- Invalidate or refetch the `getAllIncidents` query cache after any create, update, or status-change mutation in the admin panel.
- Fix the dashboard so it does not display a "no incidents" or empty state when incidents exist in the backend.
- Ensure active incidents appear in the active section and resolved incidents appear in the resolved section with correct grouping.

**User-visible outcome:** After adding or updating an incident in the admin panel, the public dashboard automatically reflects the latest incident data without requiring a manual page reload.
