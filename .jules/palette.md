## 2026-09-24 - Skip-to-Content Link for Multi-Page Accessibility
**Learning:** Adding `<a href="#main-content" class="skip-link">` paired with `<main id="main-content" tabindex="-1">` ensures smooth keyboard navigation across static pages, allowing keyboard users to bypass repeated header navigation cleanly.
**Action:** Always include skip links and `tabindex="-1"` on `<main>` when building static multi-page sites.

## 2026-09-18 - Action Button Focus Visible and Hover Tooltip Polish
**Learning:** In vanilla HTML/CSS age calculator layouts with icon-and-text action buttons, providing explicit `:focus-visible` offset outlines (`outline-offset: 2px`) and descriptive `title` attributes improves keyboard navigation accessibility and tooltip context without requiring external UI libraries.
**Action:** Ensure all interactive card action buttons have explicit focus-visible ring styles and descriptive title attributes.
