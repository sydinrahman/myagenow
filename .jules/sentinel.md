# Sentinel Journal - Security Learnings

## 2026-03-29 - CSP frame-ancestors Ignored in HTML Meta Tags
**Vulnerability:** Frame embedding/clickjacking risks cannot be mitigated using `<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'none';">`.
**Learning:** Per W3C CSP Level 2 & 3 specifications, browsers explicitly ignore the `frame-ancestors` directive when specified via HTML meta tags. Framing controls must be sent via HTTP headers (`X-Frame-Options` or HTTP CSP response headers).
**Prevention:** Avoid attempting to enforce `frame-ancestors` in `<meta>` tags; rely on web server HTTP header configurations instead.
