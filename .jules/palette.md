## 2026-09-18 - Action Button Focus Visible and Hover Tooltip Polish
**Learning:** In vanilla HTML/CSS age calculator layouts with icon-and-text action buttons, providing explicit `:focus-visible` offset outlines (`outline-offset: 2px`) and descriptive `title` attributes improves keyboard navigation accessibility and tooltip context without requiring external UI libraries.
**Action:** Ensure all interactive card action buttons have explicit focus-visible ring styles and descriptive title attributes.

## 2026-10-01 - Conditional Input Focus and ARIA State Synchronization
**Learning:** For conditional form toggle controls (`checkbox` or `button` controls controlling collapsible sections via `aria-controls`), syncing `aria-expanded` dynamically across toggle events, URL state restoration, and form resets ensures assistive technologies accurately announce visibility states, while transferring focus to the newly revealed input streamlines keyboard UX.
**Action:** Always maintain `aria-expanded` state on disclosure toggles across all state lifecycle paths (click/change, URL restoration, and form resets) and auto-focus newly revealed form controls.
