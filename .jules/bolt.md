## 2026-10-27 - Guarding CSS Entrance Transition Classes on Repeated UI Calculations
**Learning:** Forcibly toggling entrance animation classes (`classList.remove('is-visible')` followed by `requestAnimationFrame`) on every calculation trigger causes unnecessary CSS transition restarts and style recalculation thrashing when the results panel is already visible. Guarding the animation trigger with a visibility check (`resultsSection.hidden`) ensures smooth UI updates without transition re-triggering.
**Action:** Only trigger entrance animation classes when transitioning an element from hidden to visible.

## 2026-10-22 - Pre-indexing Card Metadata for In-Memory Search & Filtering
**Learning:** Performing `querySelector` DOM lookups and text extractions inside high-frequency event handlers (like search input keypresses) creates redundant DOM reads and string garbage collection churn. Pre-indexing static DOM card metadata once during `DOMContentLoaded` into an array of plain JavaScript objects enables instant, zero-DOM-query in-memory search operations on every keypress.
**Action:** Always pre-index static UI element metadata on page load when building client-side search or filtering features, and delegate event handlers to parent container elements.

## 2026-10-21 - Deferring Below-The-Fold Layout and Rendering via content-visibility
**Learning:** Applying CSS `content-visibility: auto` with `contain-intrinsic-size` to static below-the-fold sections (`.features-section`, `.trust-section`, `.how-it-works-section`, `.faq-section`) enables browser rendering engines to bypass initial layout and paint operations for off-screen DOM subtrees, improving initial page load time and responsiveness without JavaScript runtime overhead.
**Action:** Use CSS `content-visibility: auto` on non-critical below-the-fold content sections to boost page load performance.

## 2026-10-20 - Caching Intl.NumberFormat and Math-Based UTC Day Calculations
**Learning:** Calling `Number.prototype.toLocaleString()` in high-frequency UI updates repeatedly instantiates `Intl.NumberFormat` instances under the hood (~7x slower than calling `.format()` on a top-level cached `Intl.NumberFormat` instance). In addition, calculating day-of-week names from UTC timestamps using modulo arithmetic (`((Math.floor(utcMs / 86400000) + 4) % 7 + 7) % 7`) avoids creating `new Date()` heap allocations.
**Action:** Always pre-allocate top-level `Intl.NumberFormat` instances for UI number formatting and compute UTC day-of-week indices directly via modulo arithmetic instead of instantiating `new Date()` objects.

## 2026-09-12 - Pre-allocating Lookup Arrays and Fast String Parsing in Vanilla JS Date Calculators
**Learning:** In client-side vanilla JavaScript date calculators where calculations trigger on form inputs or date pickers, avoiding string splitting/regex matching in ISO date parsing and pre-allocating static array lookups (e.g., month names, day names, milestone definitions) prevents avoidable heap allocations and garbage collection pauses during user interaction.
**Action:** Always extract static lookup arrays and numeric conversion constants to top-level closure scopes and parse known ISO formatted strings with direct string slicing (`slice`) instead of regex or array `split`.
