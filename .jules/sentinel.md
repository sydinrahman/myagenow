# Sentinel Journal - Security Learnings

## 2026-10-28 - Reverse Tabnabbing Protection on Window Open Share Handlers
**Vulnerability:** External social share buttons calling `window.open` without explicit `noopener,noreferrer` options allow newly opened third-party tabs to access `window.opener.location` and manipulate or redirect the parent tab.
**Learning:** When adding event handlers for social share buttons in static blog templates, always pass `noopener,noreferrer` as feature flags to `window.open` to isolate the target window context.
**Prevention:** Enforce `noopener,noreferrer` in all `window.open` feature parameters across client-side scripts.
