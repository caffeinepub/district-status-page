# District Status Page

## Current State
- React + Motoko full-stack status dashboard
- Dashboard page (`/`) shows active and resolved incidents fetched from the backend
- Filter/search panel with keyword input and ToggleGroup-based severity and status filters
- Admin panel (`/admin`) protected by Internet Identity login
- Light/dark mode toggle via next-themes
- No access control on the public dashboard — anyone with the URL can view it

## Requested Changes (Diff)

### Add
- **Splash page / password gate**: A full-screen splash page shown before the main dashboard. Displays the app name ("District Status Page") and a password input field. The correct password is `Escambia` (case-sensitive). On correct entry, the gate is unlocked and the user sees the normal dashboard. The unlock state should persist for the browser session (sessionStorage) so refreshing does not force re-entry. The splash page should be visually clean and on-brand.
- **SplashPage component**: New `src/frontend/src/pages/SplashPage.tsx` component.
- **Password gate hook**: Simple `usePasswordGate` hook or inline state in App.tsx to track unlock state via sessionStorage.

### Modify
- **App.tsx**: Wrap the router output so that if the user has not entered the correct password, the SplashPage is rendered instead of the normal app (including layout and routes). The admin route should also be behind the gate.
- **Dashboard.tsx filter fix**: The `ToggleGroup` `value` and `onValueChange` arrays hold plain strings, but they're typed and compared as `Severity` / `Status` enum values. The filter comparison logic uses `Object.keys(incident.severity)[0]` and `Object.keys(incident.status)[0]` which returns raw strings. The fix: ensure the comparison between filter arrays and the extracted key string is reliable. The `severityFilters` and `statusFilters` state should use `string[]` instead of `Severity[]` / `Status[]` to match what `ToggleGroup` actually provides, and the filter predicate should compare plain strings directly without relying on enum type casting.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/pages/SplashPage.tsx` — full-screen password gate UI with app name, password input, submit button, and error message on wrong password.
2. Create `src/frontend/src/hooks/usePasswordGate.ts` — manages unlock state in sessionStorage; exports `{ isUnlocked, unlock, check }` where `check(password)` returns true/false and calls `unlock()` on success.
3. Modify `src/frontend/src/App.tsx` — import `usePasswordGate` and conditionally render `<SplashPage>` vs the normal `<RouterProvider>` wrap depending on unlock state. The `ThemeProvider` and `QueryClientProvider` should still wrap everything.
4. Fix `src/frontend/src/pages/Dashboard.tsx` — change `severityFilters` state type to `string[]`, `statusFilters` state type to `string[]`, remove `as Severity[]` / `as Status[]` casts in handlers, and verify the filter predicate compares strings directly.
5. Add `data-ocid` deterministic markers to the new splash page (password input, submit button, error state).
