# Specification

## Summary
**Goal:** Remove the search/filter feature from the public-facing Dashboard page.

**Planned changes:**
- Remove the search input UI element and any filter controls from the Dashboard page
- Delete all search/filter state variables and filter handler functions from the Dashboard component
- Remove keyword-matching logic that filters incidents by title, affected system/service, or description
- Remove the "no results" message tied to the search feature
- Ensure both active and resolved incident lists render their full contents unconditionally

**User-visible outcome:** The Dashboard displays all active and resolved incidents directly, with no search bar or filter controls present.
