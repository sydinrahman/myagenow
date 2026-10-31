## 2026-09-18 - Skip to Content Link Accessibility Pattern
**Learning:** In static HTML single-page apps, adding a visually hidden `.skip-link` positioned off-screen until `:focus-visible` focused targeted to `<main id="main-content" tabindex="-1">` allows keyboard and screen reader users to skip repeated header navigation links efficiently (WCAG 2.4.1).
**Action:** Always include a skip to content link targeted to `<main id="main-content" tabindex="-1">` as the first element in `<body>`.

## 2026-09-18 - Action Button Focus Visible and Hover Tooltip Polish
**Learning:** In vanilla HTML/CSS age calculator layouts with icon-and-text action buttons, providing explicit `:focus-visible` offset outlines (`outline-offset: 2px`) and descriptive `title` attributes improves keyboard navigation accessibility and tooltip context without requiring external UI libraries.
**Action:** Ensure all interactive card action buttons have explicit focus-visible ring styles and descriptive title attributes.

## 2026-10-21 - Mobile Navigation Keyboard Dismissal & Focus Visible
**Learning:** When building responsive mobile navigation drawers in vanilla JS, handling the `Escape` key to close the menu and returning focus to the toggle button (`menuButton.focus()`) ensures WCAG 2.1 compliance for keyboard navigation, while outside-click and link-click event listeners provide intuitive UI dismissal behavior.
**Action:** Always bind `Escape` key press listeners and focus return logic on expandable mobile navigation menus alongside explicit `:focus-visible` outline styles for the hamburger toggle.

## 2026-10-27 - Action Button Success State CSS Specificity & Cascade
**Learning:** When applying temporary success feedback classes (e.g. `.is-success`) to UI buttons that feature variant styles (such as `.action-btn.primary-action`), ensure the success state selector has sufficient CSS specificity or appears after variant selectors in `styles.css` so green success background/border tints properly override default primary action colors.
**Action:** Always place `.is-success` state rules after primary/secondary variant button rules or target `.primary-action.is-success` explicitly in CSS.

## 2026-11-04 - Search & Filter Accessible Empty State Recovery
**Learning:** In client-side filtered grids, providing a dedicated empty state container (`role="status"`, `aria-live="polite"`) that dynamically quotes the active query and includes a focused "Reset Filters" action button prevents disorientation for keyboard and screen reader users when zero matches are returned.
**Action:** Always include live-region empty states with an inline filter reset action button for client-side search and category filtering views.

## 2026-11-12 - Form Validation Accessible Linking & Inline Error Recovery
**Learning:** Setting aria-invalid on input fields without matching CSS selectors leaves visual users without field-level error feedback; conversely, wiping aria-describedby on error dismissals breaks screen reader association with persistent helper notes. In addition, clearing error states on the 'input' event rather than waiting for 'change' provides immediate recovery feedback while users type or select dates.
**Action:** Always style input[aria-invalid="true"] with clear border and icon tints, preserve helper note IDs in aria-describedby across error states, and listen to 'input' to dismiss error alerts immediately upon user correction.

## 2026-11-15 - High-Resolution HTML5 Canvas 2D Export with CSS Aspect Ratio Synchronization
**Learning:** When building printable or shareable greeting cards with instant live previews, maintaining a synchronized 4:5 aspect ratio between CSS (`aspect-ratio: 4 / 5`) and the off-screen HTML5 Canvas (1200×1500px) ensures that line wraps, typography proportions, and border ornaments look identical in both the on-screen preview and the exported high-resolution PNG download without external dependencies.
**Action:** Design preview cards using fixed aspect ratio containers and implement high-resolution canvas text-wrapping with matching proportional line-heights and font hierarchies.
