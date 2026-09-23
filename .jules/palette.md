## 2026-09-18 - Action Button Focus Visible and Hover Tooltip Polish
**Learning:** In vanilla HTML/CSS age calculator layouts with icon-and-text action buttons, providing explicit `:focus-visible` offset outlines (`outline-offset: 2px`) and descriptive `title` attributes improves keyboard navigation accessibility and tooltip context without requiring external UI libraries.
**Action:** Ensure all interactive card action buttons have explicit focus-visible ring styles and descriptive title attributes.

## 2026-09-23 - Dynamic ARIA Expansion Sync on Form Controls
**Learning:** In vanilla JS forms with toggleable disclosure controls (e.g. checkboxes or buttons controlling hidden form groups), static `aria-expanded` attributes in HTML easily fall out of sync unless explicitly updated in both change listeners and reset event handlers.
**Action:** Always sync `aria-expanded` in event listeners when toggling container visibility and reset handlers.
