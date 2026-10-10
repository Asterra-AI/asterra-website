# Asterra website · build plan

Source of truth for copy: `Asterra Website Final Copy.md`. This file is the build order and the
decisions that aren't in the copy doc.

## Stack

- Next.js 16.4 (App Router, Cache Components on, Turbopack), React 19, TypeScript strict.
- Tailwind CSS v4 via `@tailwindcss/turbopack`. Design tokens live in `app/globals.css` (`@theme`).
- Plus Jakarta Sans (variable, 400–800) self-hosted through `next/font/google`.
- `motion` for the few animations that need JS (rotating word, menus, accordions). Everything else is CSS.
- `lucide-react` icons. `clsx` + `tailwind-merge` for class composition (`cn()`).

## Design system

| Token | Value | Use |
| --- | --- | --- |
| `brand` | `#FF5A2E` | Logo orange. Only for the live dot and small accents. Never for big surfaces. |
| `ink` | `#0B0B0C` | Headlines and body on light sections. Dark section backgrounds. |
| `ink-2` | `#5C5A55` | Secondary text. |
| `ink-3` | `#8A8780` | Muted text, menu descriptions, group labels. |
| `paper` | `#F7F6F3` | Off-white surfaces (mobile sheet, soft cards). |
| `hairline` | `rgba(11,11,12,0.08)` | 1px dividers. |

Type: headlines bold (700), tracking `-0.03em`, leading `1.05`. Body 400/500, 15–17px. One H1 per page.
Motion: 150–300ms, ease-out. Hover states are subtle (background tint, icon colour, 2px lift at most).
Reduced motion is respected everywhere (rotation stops, transitions shorten).

## Folder layout

```
app/                  routes only (+ metadata files: robots, sitemap, opengraph-image)
components/ui/        primitives: Container, Button, …
components/site/      Header (desktop nav, mega menus, mobile sheet), Footer
components/home/      home-page sections, one file per section
lib/                  site constants, nav data, utils, structured-data helpers
public/brand/         logos · public/ images per section as they arrive
```

## Build order

**Phase 0 · Foundation** ✅
- Template cleanup, fonts, tokens, metadata base, robots, sitemap, Organization JSON-LD.
- Header: transparent → glass on scroll, Product mega menu, Company/Resources panels, mobile sheet.
- Hero: painted sky, rotating phrase, glass search bar, submit scrolls to `#toy`.

**Phase 1 · Home page, section by section**
1. Hero ✅ · 2. Blind spot ✅ · 3. Hear it for yourself (the toy, mocked call) ✅ · 4. One system for every call (bento)
5. Made for the way you run (tabs) · 6. Dashboard (dark) · 7. Proof · 8. Accuracy (dark)
9. Getting started · 10. Pricing · 11. FAQ · 12. Final call to action (dark) · Footer

**Phase 2 · Pages**
- `/product`, `/how-it-works`, `/pricing`, `/demo` (+ thank-you), `/about`, `/contact`, `/faq`
- `/for/[concept]` × 6 (one template)

**Phase 3 · Legal & trust** (plain layout)
- `/privacy`, `/terms`, `/cookies` (+ consent banner), `/subprocessors`, `/security`, `/accessibility`

**Phase 4 · SEO & launch**
- Per-page titles/descriptions from the copy doc, OG images, FAQPage + Product JSON-LD,
  sitemap finalised, Lighthouse pass, a11y pass (WCAG 2.1 AA), 404 page.

## Open decisions (from the copy doc) that block specific sections
See "Open questions" at the end of `Asterra Website Final Copy.md`. The ones that touch Phase 0/1 first:
pricing publish, Soul 5 permission, business phone number, Groups tab.
