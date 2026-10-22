## 2026-10-21 - Deferring Below-The-Fold Layout and Rendering via content-visibility
**Learning:** Applying CSS `content-visibility: auto` with `contain-intrinsic-size` to static below-the-fold sections (`.features-section`, `.trust-section`, `.how-it-works-section`, `.faq-section`) enables browser rendering engines to bypass initial layout and paint operations for off-screen DOM subtrees, improving initial page load time and responsiveness without JavaScript runtime overhead.
**Action:** Use CSS `content-visibility: auto` on non-critical below-the-fold content sections to boost page load performance.

## 2026-10-20 - Caching Intl.NumberFormat and Math-Based UTC Day Calculations
**Learning:** Calling `Number.prototype.toLocaleString()` in high-frequency UI updates repeatedly instantiates `Intl.NumberFormat` instances under the hood (~7x slower than calling `.format()` on a top-level cached `Intl.NumberFormat` instance). In addition, calculating day-of-week names from UTC timestamps using modulo arithmetic (`((Math.floor(utcMs / 86400000) + 4) % 7 + 7) % 7`) avoids creating `new Date()` heap allocations.
**Action:** Always pre-allocate top-level `Intl.NumberFormat` instances for UI number formatting and compute UTC day-of-week indices directly via modulo arithmetic instead of instantiating `new Date()` objects.

## 2026-09-12 - Pre-allocating Lookup Arrays and Fast String Parsing in Vanilla JS Date Calculators
**Learning:** In client-side vanilla JavaScript date calculators where calculations trigger on form inputs or date pickers, avoiding string splitting/regex matching in ISO date parsing and pre-allocating static array lookups (e.g., month names, day names, milestone definitions) prevents avoidable heap allocations and garbage collection pauses during user interaction.
**Action:** Always extract static lookup arrays and numeric conversion constants to top-level closure scopes and parse known ISO formatted strings with direct string slicing (`slice`) instead of regex or array `split`.
