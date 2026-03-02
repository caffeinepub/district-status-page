# Specification

## Summary
**Goal:** Add a keyword search filter to the public Dashboard and enable deletion of resolved incidents in the Admin Panel.

**Planned changes:**
- Add a search/filter input above the incident list on the Dashboard that filters both active and resolved incidents in real time by title, affected service, and description
- Show a "no results" message when no incidents match the search term
- Add a `deleteIncident(id: Text)` function to the Motoko backend actor that only allows deletion of resolved incidents, returning errors for non-existent or non-resolved incident IDs
- Add a delete button to resolved incidents in the Admin Panel with a confirmation dialog before proceeding
- Add a `useDeleteIncident` mutation hook that calls the backend and invalidates the `getAllIncidents` cache on success

**User-visible outcome:** Public users can search and filter incidents on the Dashboard in real time. Admins can delete resolved incidents from the Admin Panel after confirming, and the incident list updates immediately across both the dashboard and admin panel.
