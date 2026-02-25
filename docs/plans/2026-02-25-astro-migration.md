# Astro Migration + Warm/Organic Redesign

## Overview
- Migrate Lena Schneider Fusspflege website from Next.js 15 to Astro 5 with complete visual redesign
- Replace generic blue/tech aesthetic with warm, organic, boutique-spa identity (cream, sage, terracotta, olive, gold)
- Reduce JS bundle from ~134 KB to ~15 KB using Astro islands architecture
- Streamline page structure from 7 sections to 4 (Hero > Services > About > Contact+Booking)

## Context (from discovery)
- Files/components involved: 20+ files across app/, components/, lib/ directories
- Related patterns found: Next.js App Router, React client components, Tailwind CSS 3, Vercel Postgres
- Dependencies identified: react-hook-form (keep), lucide-react (keep for React islands only), telegraf (keep), resend (keep), @vercel/postgres (keep)
- Design doc: `docs/plans/2026-02-25-astro-migration-redesign-design.md`
- Detailed reference plan: `docs/plans/2026-02-25-astro-migration-redesign.md`

## Development Approach
- **Testing approach**: Build verification (successful `npm run build` + dev server checks)
- Complete each task fully before moving to the next
- Make small, focused changes
- **CRITICAL: every task MUST include `npm run build` verification** for code changes
- **CRITICAL: all builds must pass before starting next task** - no exceptions
- **CRITICAL: update this plan file when scope changes during implementation**
- Run build after each change
- All existing functionality must be preserved (booking, Telegram, email, security, GDPR, SEO)

## Testing Strategy
- **Build verification**: `npm run build` must succeed after every task
- **Dev server check**: `npm run dev` and visual inspection for UI tasks
- **API verification**: curl commands to test endpoints after Task 7
- **No unit tests for static Astro components** (no testable logic)

## Progress Tracking
- Mark completed items with `[x]` immediately when done
- Add newly discovered tasks with + prefix
- Document issues/blockers with ! prefix
- Update plan if implementation deviates from original scope
- Keep plan in sync with actual work done

## Implementation Steps

### Task 1: Initialize Astro project and design system
- [ ] uninstall Next.js dependencies: `npm uninstall next @vercel/speed-insights eslint-config-next`
- [ ] install Astro + integrations: `npm install astro @astrojs/react @astrojs/tailwind @astrojs/vercel @astrojs/sitemap`
- [ ] create `astro.config.mjs` with React, Tailwind, Vercel adapter, sitemap integrations
- [ ] create `tsconfig.json` for Astro (extends `astro/tsconfigs/strict`, paths alias `@/*` -> `src/*`)
- [ ] create `tailwind.config.mjs` with warm/organic design tokens (cream, sage, terracotta, olive, gold, font families DM Serif Display + Outfit)
- [ ] create `src/styles/global.css` with Tailwind directives, Google Fonts imports, base typography, focus styles, grain texture utility
- [ ] create directory structure: `mkdir -p src/components/react src/layouts src/pages/api/telegram src/styles src/lib/db`
- [ ] update `package.json` scripts to `astro dev/build/preview`
- [ ] run `npm run build` - must succeed (empty project)
- [ ] commit: "feat: initialize Astro 5 with React + Tailwind + warm design tokens"

### Task 2: Migrate lib files and create base layout
- [ ] copy all lib files: `cp -r lib/* src/lib/`
- [ ] verify no Next.js-specific imports in lib files (should be none)
- [ ] update any `process.env.*` references to `import.meta.env.*` in lib files
- [ ] create `src/layouts/Layout.astro` with: HTML boilerplate (`lang="de"`), Google Fonts links, all SEO meta tags from `app/layout.tsx`, geo meta tags, Open Graph/Twitter cards, favicon links, DNS prefetch, structured data (inline JSON-LD from StructuredData component), skip navigation links, theme-color `#8B9E7E`, `<slot />` for page content
- [ ] create `src/middleware.ts` with security headers (CSP, XSS protection, HSTS, frame options) - same rules as existing `middleware.ts`
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: add base layout with SEO metadata and security middleware"

### Task 3: Create Header and Hero components
- [ ] create `src/components/Header.astro`: sticky header with transparent-to-cream transition (inline script), logo "Lena Schneider" in DM Serif Display with botanical leaf SVG, desktop nav links in Outfit (sage color, active underline), desktop CTA "Termin buchen" (terracotta), phone link, mobile hamburger button
- [ ] create `src/components/react/MobileMenu.tsx`: slide-down menu panel, menu items with active state, close on navigation, terracotta booking CTA button. Remove `'use client'` directive. Used with `client:load`
- [ ] create `src/components/Hero.astro`: two-column layout, cream background with grain texture, DM Serif Display headline with sage accent span, Outfit subtitle, highlights list with sage SVG checkmarks, terracotta CTA + outline phone button, trust badges (sage pills), hero image with organic border-radius and gold border, decorative botanical SVG accents, floating card (desktop only)
- [ ] scroll-to-section uses vanilla JS (inline `<script>` in Header, `onclick` in Hero buttons)
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: create Header and Hero with warm organic design"

### Task 4: Create Services component
- [ ] create `src/components/Services.astro`: import SERVICES from constants in frontmatter, cream background, section header with sage pill label and DM Serif headline
- [ ] implement service cards grid (3 cols desktop, 2 tablet, 1 mobile): warm-white bg, gold border on hover, organic-sm radius, inline SVG icons in sage circles, title in font-display, description + features in font-body, price in terracotta, duration in muted text, note in italic, special layout for Paraffinbehandlung price options
- [ ] implement new customer discount banner: warm gradient, gold border, "10% Rabatt" in terracotta font-display
- [ ] add bottom CTA button (terracotta) with scroll-to-booking
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: create Services section with warm card design"

### Task 5: Create About and Contact components
- [ ] create `src/components/About.astro`: merged About + Benefits, two-column layout (photo left with organic blob shape, text right), DM Serif heading, personal text, credentials grid 2x2 (Zertifiziert, Professionell, Mit Leidenschaft, Höchste Hygiene + Gemütliches Ambiente, Flexible Termine from Benefits), sage icon backgrounds, image with Astro `<Image>` optimization
- [ ] create `src/components/Contact.astro`: merged Contact + ServiceArea + BookingForm wrapper, gradient background, contact info cards row (phone/email/address/hours) with sage icons, Google Maps iframe embed, important notes cards (appointment required in sage, cancellation in amber), booking form slot for React island `<BookingForm client:visible />`
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: create About and Contact sections with merged design"

### Task 6: Port React islands (BookingForm, CookieConsent) and create Footer
- [ ] create `src/components/react/BookingForm.tsx`: port from existing with visual restyle - cream inputs, sage focus rings, terracotta submit button, olive section headers, warm-white form container, amber cancellation notice. Remove `'use client'`. Update `@/lib/` imports to work with Astro resolution. Keep all validation, API calls, slot loading logic identical
- [ ] create `src/components/react/CookieConsent.tsx`: port with warm restyle - warm-white banner, gold border, sage settings button, terracotta accept button, olive headings in modal. Remove `'use client'`
- [ ] create `src/components/Footer.astro`: olive (#4A5540) background, gold gradient top border, 4-column grid (company/links/services/contact) in cream text, cancellation note in gold, bottom bar with legal links, back-to-top button (terracotta, vanilla JS show/hide on scroll), cookie reset via inline script
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: port React islands and create Footer with olive design"

### Task 7: Create pages and migrate API endpoints
- [ ] create `src/pages/index.astro`: Layout + Header + Hero + Services + About + Contact + Footer + CookieConsent (client:load)
- [ ] create `src/pages/impressum.astro`: port all legal text with warm styling (olive headings, sage links)
- [ ] create `src/pages/datenschutz.astro`: port all privacy policy text with warm styling
- [ ] create `src/pages/barrierefreiheit.astro`: port accessibility statement with warm styling
- [ ] create `src/pages/404.astro`: redesigned 404 with terracotta "404" heading, warm links
- [ ] create `src/pages/api/booking.ts`: convert from Next.js (APIRoute type, Request/Response instead of NextRequest/NextResponse, `import.meta.env` for env vars)
- [ ] create `src/pages/api/available-slots.ts`: convert GET handler with url.searchParams
- [ ] create `src/pages/api/contact.ts`: convert POST + OPTIONS handlers
- [ ] create `src/pages/api/telegram/index.ts`: convert Telegram bot handler
- [ ] create `src/pages/api/telegram/webhook.ts`: convert webhook callback handler
- [ ] update `public/robots.txt` to reference `sitemap-index.xml`
- [ ] update `public/manifest.json` theme_color to `#8B9E7E`
- [ ] run `npm run build` - must succeed
- [ ] commit: "feat: create all pages and migrate API endpoints"

### Task 8: Clean up and build verification
- [ ] delete old Next.js files: `rm -rf app/ components/ lib/ next.config.mjs postcss.config.mjs middleware.ts tailwind.config.ts`
- [ ] delete old migration plan: `rm ASTRO_MIGRATION_PLAN.md`
- [ ] run `npm run build` - must succeed with zero errors
- [ ] run `npm run dev` and verify: homepage renders all 4 sections, nav scrolling works, mobile menu opens/closes, service cards show all 7 services, booking form loads and validates, legal pages render, 404 page works, cookie consent appears, back-to-top button works
- [ ] verify SEO: check page source for meta tags, structured data JSON-LD, sitemap at /sitemap-index.xml
- [ ] commit: "chore: remove old Next.js files, migration complete"

### Task 9: Visual polish and responsive testing
- [ ] test at mobile 375px: all sections readable, touch targets 44px+, no overflow
- [ ] test at tablet 768px: grids collapse correctly, cards readable
- [ ] test at desktop 1280px: full layout, floating cards visible
- [ ] verify color contrast meets WCAG AA (sage on cream, olive on white, cream on olive)
- [ ] verify organic shapes look intentional across breakpoints
- [ ] verify animations are smooth (hover states, scroll transitions)
- [ ] fix any visual issues found
- [ ] run `npm run build` - final clean build
- [ ] commit: "style: visual polish and responsive refinements"

### Task 10: Final acceptance verification
- [ ] verify all requirements from Overview are implemented
- [ ] verify booking form submits correctly (test with curl if DB available)
- [ ] verify all 7 services display with correct prices and durations
- [ ] verify all legal pages (Impressum, Datenschutz, Barrierefreiheit) have complete content
- [ ] verify sitemap generation works
- [ ] verify security headers present (check response headers)
- [ ] run `npm run build` - final production build succeeds
- [ ] verify JS bundle size is significantly reduced vs Next.js (~15 KB target)

## Technical Details

### Color tokens
| Token | Hex | Usage |
|-------|-----|-------|
| cream | #FDF6EC | Page background |
| warm-white | #FFFCF7 | Card backgrounds |
| sage | #8B9E7E | Primary, nav accents |
| terracotta | #C67D5B | CTAs, prices |
| olive | #4A5540 | Headings, footer bg |
| gold | #D4A574 | Borders, accents |

### Typography
- Display: DM Serif Display (headings, logo)
- Body: Outfit (text, UI)

### Key Astro differences from Next.js
- `NextRequest` -> `Request`, `NextResponse.json()` -> `new Response(JSON.stringify(...))`
- `process.env.*` -> `import.meta.env.*`
- `NEXT_PUBLIC_*` -> `PUBLIC_*` prefix for client-side env vars
- No `'use client'` directive needed
- Static components use `.astro` files, interactive use React with `client:load` or `client:visible`

### Page structure change
- Old: Hero > About > Services > Benefits > ServiceArea > Contact > BookingForm (7 sections)
- New: Hero > Services > About > Contact+Booking (4 sections)

## Post-Completion

**Manual verification:**
- Test booking form submission end-to-end with real Telegram notifications
- Verify email confirmations via Resend
- Check Google PageSpeed Insights score (target: 95+)
- Verify Google Search Console indexing after deployment

**Deployment:**
- Configure Vercel project for Astro (build command: `astro build`)
- Verify all environment variables are set in Vercel dashboard
- Deploy to preview URL and test before production
- Update DNS if needed
