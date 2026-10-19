## 2026-09-18 - Skip to Content Link Accessibility Pattern
**Learning:** In static HTML single-page apps, adding a visually hidden `.skip-link` positioned off-screen until `:focus-visible` focused targeted to `<main id="main-content" tabindex="-1">` allows keyboard and screen reader users to skip repeated header navigation links efficiently (WCAG 2.4.1).
**Action:** Always include a skip to content link targeted to `<main id="main-content" tabindex="-1">` as the first element in `<body>`.

## 2026-09-18 - Action Button Focus Visible and Hover Tooltip Polish
**Learning:** In vanilla HTML/CSS age calculator layouts with icon-and-text action buttons, providing explicit `:focus-visible` offset outlines (`outline-offset: 2px`) and descriptive `title` attributes improves keyboard navigation accessibility and tooltip context without requiring external UI libraries.
**Action:** Ensure all interactive card action buttons have explicit focus-visible ring styles and descriptive title attributes.
