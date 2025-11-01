<!--
Sync Impact Report

Version change: 0.0.0 → 1.0.0
Modified principles: [replaced template placeholders with concrete principles]
Added sections: None (filled existing Section 2 and Section 3)
Removed sections: None
Templates requiring updates:
 - .specify/templates/plan-template.md reference line to constitution path/version ✅ updated
 - .specify/templates/spec-template.md ⚠ none required
 - .specify/templates/tasks-template.md ⚠ none required
Follow-up TODOs: None
-->

# Kids Worksheets Generator Constitution

## Core Principles

### I. Static-Only Delivery (No Server Runtime)
All pages are delivered as prebuilt HTML/CSS/JS assets via static hosting. No
server-side execution, databases, or long-lived processes are allowed in the
production path. Any dynamic behavior must be implemented client-side or via
third-party APIs that are called directly from the browser with public data only.
Sensitive operations are out of scope.

### II. Simple, Reproducible Builds
The site must build deterministically from a single command (e.g., `npm run
build`). Pin dependencies with a lockfile. Generated assets are committed only in
release artifacts, not in source control. Prefer plain HTML/CSS/JS or an SSG
(Astro/Eleventy/Next.js SSG) with minimal plugins.

### III. Fast and Accessible by Default
Meet baseline performance and accessibility:
- Core Web Vitals: LCP ≤ 2.5s (simulated slow 4G), CLS ≤ 0.1
- Accessibility: WCAG 2.1 AA for text contrast and keyboard navigation
- Assets: optimized images (responsive sizes, modern formats), no unused
  JavaScript over 100KB gzipped per page without explicit justification.

### IV. No Secrets, Privacy-Respecting
No API keys, tokens, or secrets in the repository or client bundle. Do not
collect personal data. Avoid third-party trackers by default; if analytics are
required, use privacy-friendly, cookie-less options with opt-in.

### V. Portable Hosting and Offline-Friendly
The site must deploy to common static hosts (GitHub Pages, Netlify, Vercel) with
relative paths and a working 404. A service worker is optional; if used, it must
be safe (no stale forever) and easy to disable.

## Additional Constraints

- Tech stack: Prefer vanilla HTML/CSS/JS. Acceptable SSGs: Astro, Eleventy,
  Next.js (static export only). Avoid client-side frameworks unless necessary.
- SEO: Set title/description, canonical URLs, sitemap, robots.txt.
- Internationalization: Optional; if used, fall back gracefully.
- Assets: Use hashed filenames, set long cache headers via host defaults.
- Security: Enforce HTTPS, set basic security headers via host defaults.

## Development Workflow

- Branching: feature branches with PRs.
- Checks before merge: HTML validation, link checker, Lighthouse budget, basic
  a11y scan. Block merge on hard failures.
- Deployment: Preview on PR, main branch auto-deploys to static host.
- Rollback: Revert commit to restore previous version.

## Governance

- This constitution supersedes other practices for this repository.
- Amendments require a PR with rationale, version bump, and migration notes if
  applicable.
- Versioning of this document follows semver:
  - MAJOR: remove/alter principles incompatibly
  - MINOR: add/expand principles or sections
  - PATCH: clarifications and non-semantic edits
- Compliance: Reviewers must confirm adherence to Core Principles and
  Development Workflow gates.

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22