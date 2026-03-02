# Specification

## Summary
**Goal:** Add a search and filter bar to the public Dashboard page so users can quickly find incidents by keyword, severity, and status.

**Planned changes:**
- Add a text input to the Dashboard for keyword search, filtering incidents by title, description, or affected service (case-insensitive)
- Add a severity filter control (critical, major, minor, informational)
- Add a status filter control (investigating, identified, monitoring, resolved)
- Apply all active filters simultaneously in real time, client-side, with no page reload
- Filter both the active incidents section and the resolved incidents section independently
- Clearing all filters restores the full incident list
- Style filter controls consistently with the existing Dashboard design and theme

**User-visible outcome:** Users on the public Dashboard can type a keyword and select severity/status filters to instantly narrow down the displayed incidents without reloading the page.
