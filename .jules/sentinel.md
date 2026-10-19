# Sentinel Journal - Security Learnings

## 2026-10-19 - Malformed Inline Script CSP Directive
**Vulnerability:** A <meta> tag for Content Security Policy was accidentally embedded inside a <script> tag in index.html, causing JS SyntaxErrors and broken inline CSP rules.
**Learning:** CSP meta tags must be placed directly inside <head> as HTML elements, never inside inline JavaScript <script> blocks.
**Prevention:** Always validate HTML structure and ensure inline script blocks contain only valid JS.
