# TODO

- [x] Align the Google Analytics initialization script with the configurable `GA_ID` so deployments using a custom `NEXT_PUBLIC_GA_ID` load the correct tracking script and config instead of the hard-coded `G-PQ0PJ2D7EN`. Relevant files: `app/layout.tsx` (gtag script includes).
- [x] Ensure generated heading IDs remain unique when duplicate headings appear so table-of-contents navigation targets the correct section. Investigate `lib/slugify.ts` and heading renderers in `components/MarkdownPreview.tsx`.
- [x] Improve `QuickActionsMenu` accessibility by exposing `aria-haspopup`/`aria-expanded` state and handling keyboard dismissal (e.g., Escape key) for the floating menu trigger. See `components/QuickActionsMenu.tsx`.
