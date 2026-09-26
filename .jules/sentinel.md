# Sentinel Journal - Security Learnings

## 2026-03-29 - [HTML Meta Tag Framing Constraints]
**Vulnerability:** Attempted clickjacking prevention using `<meta http-equiv="X-Frame-Options">` and CSP `frame-ancestors` directive in HTML `<meta>` tags.
**Learning:** Modern browsers ignore `X-Frame-Options` and CSP `frame-ancestors` directives when declared inside HTML `<meta http-equiv="...">` tags per standard browser security specifications. Framing controls must be sent via HTTP response headers.
**Prevention:** For static client-side sites, rely on server-level HTTP header configuration for framing restrictions and use `<meta>` CSP directives that are supported in HTML (e.g., `object-src 'none'`, `base-uri 'self'`).
