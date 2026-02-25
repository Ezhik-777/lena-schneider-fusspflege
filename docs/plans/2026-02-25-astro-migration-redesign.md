# Astro Migration + Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the Lena Schneider Fusspflege website from Next.js 15 to Astro 5 with a complete visual redesign using a warm/organic spa aesthetic.

**Architecture:** Astro 5 with React islands for interactive components (BookingForm, MobileMenu, CookieConsent). All static sections become `.astro` components with zero JS. API routes convert to Astro endpoints. Vercel adapter for SSR. Design system uses warm earth tones (cream, sage, terracotta, olive) with DM Serif Display + Outfit typography.

**Tech Stack:** Astro 5, Tailwind CSS 4, React 18, TypeScript, Vercel Postgres, Resend, Telegraf, react-hook-form

**Design doc:** `docs/plans/2026-02-25-astro-migration-redesign-design.md`

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `astro.config.mjs`
- Create: `tsconfig.json` (Astro version)
- Create: `src/styles/global.css`
- Modify: `package.json`
- Delete (later): `next.config.mjs`, `postcss.config.mjs`, `middleware.ts`, `app/` directory

**Step 1: Initialize new Astro project in-place**

Since we're migrating in the same repo, we need to:
1. Remove Next.js dependencies
2. Add Astro + integrations
3. Create Astro config

Run:
```bash
npm uninstall next react-dom @vercel/speed-insights eslint-config-next
npm install astro @astrojs/react @astrojs/tailwind @astrojs/vercel @astrojs/sitemap
npm install -D @types/react @types/react-dom
```

**Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fusspflege-lena-schneider.de',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  vite: {
    ssr: {
      noExternal: ['telegraf'],
    },
  },
});
```

**Step 3: Create `tsconfig.json` for Astro**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "jsx": "react-jsx"
  }
}
```

**Step 4: Create `src/styles/global.css` with new design system**

This file defines the warm/organic design system with CSS variables, Tailwind directives, typography setup (DM Serif Display + Outfit from Google Fonts), and base styles. The color palette uses cream (#FDF6EC), sage (#8B9E7E), terracotta (#C67D5B), olive (#4A5540), and gold (#D4A574).

Key elements:
- `@import` Google Fonts (DM Serif Display, Outfit)
- Tailwind `@tailwind base/components/utilities`
- CSS custom properties for all design tokens
- Base typography rules with `font-family: 'Outfit', sans-serif` for body
- Focus-visible styles using sage color
- Smooth scroll, section padding, container max-width
- Subtle grain/noise texture as a reusable CSS class
- Organic border-radius utilities

**Step 5: Update `package.json` scripts**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

**Step 6: Create directory structure**

```bash
mkdir -p src/components/react src/layouts src/pages/api/telegram src/styles src/lib/db
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro 5 project with React + Tailwind integrations"
```

---

## Task 2: Create Tailwind Config + Design Tokens

**Files:**
- Create: `tailwind.config.mjs`

**Step 1: Create Tailwind config with warm/organic design system**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6EC',
        'warm-white': '#FFFCF7',
        sage: {
          DEFAULT: '#8B9E7E',
          light: '#A8B89E',
          dark: '#6B7E60',
          50: '#F2F5EF',
          100: '#E1E8DB',
          200: '#C5D4BA',
        },
        terracotta: {
          DEFAULT: '#C67D5B',
          dark: '#A8674A',
          light: '#D4967A',
          50: '#FDF3EE',
        },
        olive: {
          DEFAULT: '#4A5540',
          light: '#5C6B50',
          dark: '#3A4332',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A0',
          dark: '#B88A5C',
        },
        'text-dark': '#2D2A26',
        'text-muted': '#6B6560',
        'amber-bg': '#FEF3E2',
        'amber-border': '#F0D4A8',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        'organic': '2rem',
        'organic-sm': '1.25rem',
        'organic-lg': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
```

**Step 2: Commit**

```bash
git add tailwind.config.mjs
git commit -m "feat: add Tailwind config with warm/organic design tokens"
```

---

## Task 3: Migrate Lib Files (No Changes Needed)

**Files:**
- Copy: `lib/constants.ts` -> `src/lib/constants.ts`
- Copy: `lib/db/index.ts` -> `src/lib/db/index.ts`
- Copy: `lib/security.ts` -> `src/lib/security.ts`
- Copy: `lib/env.ts` -> `src/lib/env.ts`
- Copy: `lib/german-holidays.ts` -> `src/lib/german-holidays.ts`
- Copy: `lib/email-templates.ts` -> `src/lib/email-templates.ts`
- Copy: `lib/service-config.ts` -> `src/lib/service-config.ts`

**Step 1: Copy all lib files to src/lib**

These files are pure TypeScript with no Next.js-specific imports. They work as-is in Astro.

```bash
cp -r lib/* src/lib/
```

**Step 2: Update import paths**

The only change needed: replace any `@/lib/` imports with `@/lib/` (same path, but now resolved from `src/`). Since we set up `baseUrl: "."` and `paths: { "@/*": ["src/*"] }` in tsconfig, all `@/lib/...` imports will resolve correctly.

Check for any `next/server` or `next/...` imports in lib files - there should be none (confirmed: lib files are framework-agnostic).

**Step 3: Commit**

```bash
git add src/lib/
git commit -m "chore: copy lib files to src/lib (no changes needed)"
```

---

## Task 4: Create Base Layout

**Files:**
- Create: `src/layouts/Layout.astro`

**Step 1: Create the main layout**

This replaces `app/layout.tsx`. It includes:
- HTML boilerplate with `lang="de"`
- Google Fonts preconnect + stylesheet links (DM Serif Display, Outfit)
- All meta tags from the existing layout (SEO, geo, Open Graph, Twitter)
- Google Analytics script (conditional on env var)
- PWA manifest link
- Structured data (moved inline from StructuredData component)
- Skip navigation links for accessibility
- Cookie consent slot
- Global CSS import
- Security headers will be handled by Vercel config or Astro middleware

Key metadata to preserve from `app/layout.tsx`:
- `metadataBase`, `title`, `description`, `keywords` (all 50+ keywords)
- `openGraph`, `twitter`, `robots`, `alternates`
- Geo meta tags (`geo.region`, `geo.position`, `ICBM`)
- Business meta tags (`contact`, `telephone`, `address`)
- `theme-color` (change from `#0284c7` to `#8B9E7E` sage)
- Favicon links
- DNS prefetch links

The layout wraps page content with `<slot />`.

**Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: create Astro base layout with SEO metadata and design system fonts"
```

---

## Task 5: Create Astro Middleware for Security Headers

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create Astro middleware**

Replaces `middleware.ts` (Next.js). Astro middleware uses `defineMiddleware` from `astro:middleware`.

```ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Same CSP and security headers as the Next.js middleware
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  // CSP - same allowlist as before (Google Maps, Telegram, fonts)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://maps.googleapis.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "frame-src 'self' https://www.google.com",
    "connect-src 'self' https://api.telegram.org https://www.google.com https://maps.googleapis.com https://www.google-analytics.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  if (import.meta.env.PROD) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  return response;
});
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add Astro middleware with security headers"
```

---

## Task 6: Create Header Component

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/react/MobileMenu.tsx`

**Step 1: Create Header.astro (static part)**

The header contains:
- Sticky positioning with transparent-to-cream background transition on scroll (handled by vanilla JS `<script>` in Astro)
- Logo: "Lena Schneider" in `font-display` (DM Serif Display) with a decorative leaf SVG icon
- Desktop nav: links in `font-body` (Outfit), sage text color, underline on active
- Desktop CTA: phone link + "Termin buchen" button (terracotta background)
- Mobile: phone icon + hamburger button that triggers the MobileMenu React island
- All scroll-to-section links use vanilla JS (no React needed for static nav)

The scroll-on-scroll effect (transparent -> solid background) is implemented with a small inline `<script>` tag in the Astro component - no React needed.

Active section tracking: Use IntersectionObserver in a `<script>` tag to highlight the active nav item.

**Step 2: Create MobileMenu.tsx (React island)**

Interactive mobile menu with:
- Slide-down animation
- Menu items list with active highlighting
- Close on navigation
- Close on outside click
- Props: `isOpen`, `onClose`, `menuItems`

Used as: `<MobileMenu client:load isOpen={...} />`

Note: Since the menu toggle state needs to be shared between the Astro header and the React island, use a shared `nanostores` atom or pass control via custom events.

Simpler approach: Make the entire mobile menu toggle logic a React island. The header shell (logo, desktop nav) stays Astro. Only the mobile hamburger button + dropdown panel is React.

**Step 3: Commit**

```bash
git add src/components/Header.astro src/components/react/MobileMenu.tsx
git commit -m "feat: create Header component with warm/organic design"
```

---

## Task 7: Create Hero Section

**Files:**
- Create: `src/components/Hero.astro`

**Step 1: Create Hero.astro**

Design elements:
- Full-width section with `bg-cream` and subtle CSS grain/noise texture overlay
- Two-column layout (text left, image right) on desktop, stacked on mobile
- Headline: `font-display text-olive` with "in Erligheim" span in `text-sage`
- Subtitle: `font-body text-text-muted`
- Highlights list with sage checkmark icons (inline SVG, no lucide dependency)
- CTA buttons: primary terracotta with rounded-organic, secondary outline for phone
- Trust badges: small pills with `bg-sage-50` background
- Hero image: organic border-radius (e.g., `border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%`) with gold border
- Decorative botanical SVG leaves positioned absolutely behind/around the image
- Floating card hidden on mobile (like current), redesigned with warm colors

Scroll-to-booking uses vanilla JS via onclick handler in the Astro template.

No React needed - this is a purely static component.

**Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: create Hero section with organic shapes and warm design"
```

---

## Task 8: Create Services Section

**Files:**
- Create: `src/components/Services.astro`

**Step 1: Create Services.astro**

Import services data from `@/lib/constants.ts` in the frontmatter.

Design elements:
- Section background: `bg-cream`
- Section header with decorative thin line and "Unsere Leistungen" label in sage pill
- Headline in `font-display text-olive`
- 3-column grid (2 on tablet, 1 on mobile) of service cards
- Each card:
  - `bg-warm-white` background
  - `rounded-organic-sm` (1.25rem) border radius
  - Subtle `border border-gold-light/30` default, `border-gold` on hover
  - Icon in sage circle at top (use simple SVG icons inline, not lucide)
  - Service title in `font-display text-olive`
  - Description in `font-body text-text-muted`
  - Features list with sage checkmarks
  - Price in `text-terracotta font-bold`
  - Duration in `text-text-muted`
  - Note text in italic if present
  - Paraffinbehandlung card: special price options layout
  - Hover: slight translateY(-2px) + soft shadow
- New customer discount banner:
  - `bg-gradient-to-br from-terracotta-50 to-cream`
  - Gold border
  - "10% Rabatt" in `text-terracotta font-display`
  - Organic rounded corners
- Bottom CTA: "Jetzt Termin vereinbaren" button in terracotta

All icons are inline SVGs matching each service (sparkles, foot, wave, scissors, droplet, wand, flame). No external icon library needed for static components.

**Step 2: Commit**

```bash
git add src/components/Services.astro
git commit -m "feat: create Services section with warm card design"
```

---

## Task 9: Create About Section (with Benefits merged)

**Files:**
- Create: `src/components/About.astro`

**Step 1: Create About.astro**

Merges the old About + Benefits sections.

Design elements:
- Two-column layout: photo left, text right (reversed on mobile)
- Photo with organic blob shape (CSS border-radius or clip-path)
- Decorative sage/gold blur circles behind photo
- Section label pill: "Über uns" in sage
- Headline: `font-display text-olive`
- Body text: `font-body text-text-muted`, warm personal tone
- Credentials grid (2x2 on desktop, 1 col on mobile):
  - Each card: `bg-sage-50` background, `rounded-organic-sm`
  - Sage icon circle, title + description
  - Items: Zertifiziert, Professionell, Mit Leidenschaft, Höchste Hygiene
- Benefits from old section folded in as additional credentials:
  - Gemütliches Ambiente, Flexible Termine
  - These replace the old standalone Benefits section
- CTA banner at bottom (optional): gradient from sage to olive with white text
  - "Besuchen Sie uns in Erligheim!" + booking button

Image uses Astro's `<Image>` component for optimization (avif/webp).

**Step 2: Commit**

```bash
git add src/components/About.astro
git commit -m "feat: create About section with merged benefits and warm design"
```

---

## Task 10: Create Contact Section (with Booking + ServiceArea merged)

**Files:**
- Create: `src/components/Contact.astro`

**Step 1: Create Contact.astro**

Merges Contact + ServiceArea + BookingForm wrapper.

Design elements:
- Section background: subtle gradient `from-cream via-terracotta-50/20 to-cream`
- Section header: "Kontakt & Terminbuchung" with sage pill
- Contact info cards row (4 cards on desktop, 2x2 on tablet, stacked on mobile):
  - Phone: sage icon, phone number as link, hours text
  - Email: sage icon, email as link
  - Address: sage icon, full address, "Route anzeigen" link to Google Maps
  - Hours: sage icon, Mo-Fr/Sa/So hours
  - Card style: `bg-warm-white border border-gold-light/30 rounded-organic-sm`
  - Hover: slight lift + gold border
- Google Maps embed (from ServiceArea): rounded corners, below contact cards or beside
- Important notes:
  - "Terminvereinbarung erforderlich" in `bg-sage-50` card with sage border
  - "Stornierungsbedingungen" in `bg-amber-bg` card with `border-amber-border`
- BookingForm React island: `<BookingForm client:visible />`
  - Uses `client:visible` to only load JS when the booking section scrolls into view
- Alternative contact links below the form

**Step 2: Commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: create Contact section with merged booking and service area"
```

---

## Task 11: Restyle BookingForm React Component

**Files:**
- Create: `src/components/react/BookingForm.tsx`

**Step 1: Port and restyle the booking form**

Copy the existing `components/BookingForm.tsx` and update:

1. **Import changes**: Remove `@/lib/` aliases (use relative paths or ensure Astro resolves them). Keep react-hook-form, lucide-react imports.

2. **Visual restyling** (all Tailwind classes):
   - Form container: `bg-warm-white rounded-organic shadow-lg`
   - Section headers: `font-display text-olive border-b border-gold-light/30`
   - Input fields: `bg-cream border-gold-light/50 rounded-xl focus:ring-sage focus:border-sage`
   - Labels: `font-body text-olive font-semibold`
   - Select dropdowns: same warm styling as inputs
   - Error messages: keep red but softer (`text-red-700` not `text-red-600`)
   - Submit button: `bg-terracotta hover:bg-terracotta-dark text-white rounded-organic-sm font-body font-bold`
   - Loading spinner: terracotta border
   - Success message: sage-toned (`bg-sage-50 border-sage`)
   - Error message: warm red (`bg-red-50 border-red-400`)
   - Privacy checkbox: sage accent color
   - Cancellation notice: `bg-amber-bg border-l-4 border-amber-border`

3. **Functional behavior**: Identical to current - same validation, same API calls, same slot loading.

4. **Remove `'use client'` directive** (not needed in Astro).

5. **Path resolution**: API calls stay as `/api/booking` and `/api/available-slots` (same URLs).

**Step 2: Commit**

```bash
git add src/components/react/BookingForm.tsx
git commit -m "feat: port and restyle BookingForm with warm/organic design"
```

---

## Task 12: Create CookieConsent Component

**Files:**
- Create: `src/components/react/CookieConsent.tsx`

**Step 1: Port and restyle CookieConsent**

Copy existing `components/CookieConsent.tsx` and update:

1. Remove `'use client'` directive
2. Restyle with warm design:
   - Banner: `bg-warm-white border-t-2 border-gold-light shadow-2xl`
   - Settings button: `bg-sage-50 text-olive`
   - "Nur notwendige" button: `border-sage text-olive`
   - "Alle akzeptieren" button: `bg-terracotta text-white`
   - Modal: warm-white background, olive headings
   - Toggle switches: sage color when enabled
   - Info note: sage-toned card
3. Keep all functionality identical (localStorage, analytics loading)

Used as `<CookieConsent client:load />` in the layout.

**Step 2: Commit**

```bash
git add src/components/react/CookieConsent.tsx
git commit -m "feat: port CookieConsent with warm design"
```

---

## Task 13: Create Footer Component

**Files:**
- Create: `src/components/Footer.astro`

**Step 1: Create Footer.astro**

Design elements:
- Background: `bg-olive` (#4A5540)
- Top border: thin gradient line from gold to gold-light
- 4-column grid:
  - Column 1: "Fusspflege Lena Schneider" in `font-display text-cream`, description in cream/70
  - Column 2: Quick links (scroll-to-section via vanilla JS), cream text with gold hover
  - Column 3: Services list, cream text
  - Column 4: Contact info (phone, email, address) with cream icons
  - Cancellation policy note in `text-gold`
- Bottom bar: `border-t border-olive-light`
  - Copyright in cream/60
  - Legal links: Impressum, Datenschutz, Barrierefreiheit, Cookie-Einstellungen
  - Cookie-Einstellungen triggers localStorage removal + reload (inline script)
- Back-to-top button: fixed position, terracotta bg, appears on scroll (vanilla JS)

No React needed. Scroll-to-section uses inline `<script>` with `document.getElementById().scrollIntoView()`.

**Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: create Footer with olive background and warm accents"
```

---

## Task 14: Create StructuredData Component

**Files:**
- Create: `src/components/StructuredData.astro`

**Step 1: Port StructuredData as Astro component**

Convert the React component to Astro. The structured data is pure JSON-LD - no interactivity needed.

In Astro, JSON-LD scripts are rendered directly:
```astro
<script type="application/ld+json" set:html={JSON.stringify(localBusinessData)} />
```

Keep all schema data identical:
- LocalBusiness (BeautySalon)
- Organization
- Person
- WebSite
- FAQPage
- BreadcrumbList

**Step 2: Commit**

```bash
git add src/components/StructuredData.astro
git commit -m "feat: port StructuredData to Astro component"
```

---

## Task 15: Create Homepage

**Files:**
- Create: `src/pages/index.astro`

**Step 1: Create the homepage**

```astro
---
import Layout from '@/layouts/Layout.astro';
import Header from '@/components/Header.astro';
import Hero from '@/components/Hero.astro';
import Services from '@/components/Services.astro';
import About from '@/components/About.astro';
import Contact from '@/components/Contact.astro';
import Footer from '@/components/Footer.astro';
import CookieConsent from '@/components/react/CookieConsent';
---

<Layout>
  <Header />
  <main id="main-content">
    <Hero />
    <Services />
    <About />
    <Contact />
  </main>
  <Footer />
  <CookieConsent client:load />
</Layout>
```

New section order: Hero > Services > About > Contact+Booking (streamlined from 7 sections to 4).

**Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: create homepage with streamlined section order"
```

---

## Task 16: Create Legal Pages

**Files:**
- Create: `src/pages/impressum.astro`
- Create: `src/pages/datenschutz.astro`
- Create: `src/pages/barrierefreiheit.astro`
- Create: `src/pages/404.astro`

**Step 1: Create Impressum page**

Convert `app/impressum/page.tsx` to Astro. The content is static HTML - strip the React wrapper, keep all legal text. Use `Layout.astro` with custom title/description. Apply warm design:
- Page container with cream background
- Headings in `font-display text-olive`
- Body text in `font-body text-text-dark`
- Links in `text-sage hover:text-sage-dark`
- Back link to homepage

**Step 2: Create Datenschutz page**

Same approach as Impressum. All 518 lines of privacy policy content converted to static Astro with warm styling.

**Step 3: Create Barrierefreiheit page**

Same approach. 606 lines of accessibility statement. Apply warm design tokens.

**Step 4: Create 404 page**

Redesign the 404 page with warm aesthetic:
- Large "404" in `font-display text-terracotta`
- Message in `text-olive`
- Links to home + sections
- Cream background with subtle botanical decoration

**Step 5: Commit**

```bash
git add src/pages/impressum.astro src/pages/datenschutz.astro src/pages/barrierefreiheit.astro src/pages/404.astro
git commit -m "feat: create legal pages and 404 with warm design"
```

---

## Task 17: Migrate API Endpoints

**Files:**
- Create: `src/pages/api/booking.ts`
- Create: `src/pages/api/available-slots.ts`
- Create: `src/pages/api/contact.ts`
- Create: `src/pages/api/telegram/index.ts`
- Create: `src/pages/api/telegram/webhook.ts`

**Step 1: Convert booking endpoint**

Astro API routes use `APIRoute` type with `APIContext`:

```ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  // Same logic as app/api/booking/route.ts
  // Replace NextResponse.json() with new Response(JSON.stringify(...))
  // Replace NextRequest with standard Request
  // Everything else stays the same
};

export const OPTIONS: APIRoute = async () => {
  // CORS preflight handler
  return new Response(null, {
    status: 204,
    headers: { /* same CORS headers */ },
  });
};
```

Key changes from Next.js to Astro:
- `NextRequest` -> `Request` (standard Web API)
- `NextResponse.json()` -> `new Response(JSON.stringify(...), { headers: { 'Content-Type': 'application/json' } })`
- `request.ip` -> `request.headers.get('x-forwarded-for')` (Vercel provides this)
- Imports stay the same for lib files

**Step 2: Convert available-slots endpoint**

Same pattern. GET handler with query params from URL:

```ts
export const GET: APIRoute = async ({ url }) => {
  const date = url.searchParams.get('date');
  const service = url.searchParams.get('service');
  // ... same logic
};
```

**Step 3: Convert contact endpoint**

Same pattern as booking. POST + OPTIONS handlers.

**Step 4: Convert telegram endpoints**

Two files:
- `telegram/index.ts`: Main Telegram bot handler with Telegraf
- `telegram/webhook.ts`: Callback query handler for booking confirmation

Both convert the same way (NextRequest -> Request, NextResponse -> Response).

**Step 5: Commit**

```bash
git add src/pages/api/
git commit -m "feat: migrate all API endpoints to Astro format"
```

---

## Task 18: Create Sitemap + Robots.txt

**Files:**
- Modify: `astro.config.mjs` (sitemap already added)
- Create/update: `public/robots.txt`

**Step 1: Verify sitemap integration**

The `@astrojs/sitemap` integration auto-generates `sitemap-index.xml` at build time. It discovers all pages in `src/pages/`. No custom sitemap.ts needed (unlike Next.js).

Verify that the `site` property is set in `astro.config.mjs` (already done in Task 1).

**Step 2: Update robots.txt**

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://fusspflege-lena-schneider.de/sitemap-index.xml
```

**Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat: configure sitemap and update robots.txt"
```

---

## Task 19: Copy Public Assets

**Files:**
- Keep: `public/hero-gemini.jpeg`
- Keep: `public/nails-work.jpg`
- Keep: `public/manifest.json`
- Keep: `public/favicon.ico` (if exists)
- Update: `public/manifest.json` (update theme_color to sage)

**Step 1: Update manifest.json**

Change `theme_color` from blue to sage (`#8B9E7E`) and update any color references.

**Step 2: Verify all assets are in public/**

Astro serves `public/` directly, same as Next.js. No changes needed for image paths.

**Step 3: Commit**

```bash
git add public/
git commit -m "chore: update manifest theme color and verify public assets"
```

---

## Task 20: Clean Up Old Next.js Files

**Files:**
- Delete: `app/` directory (all files)
- Delete: `components/` directory (all files)
- Delete: `lib/` directory (moved to src/lib)
- Delete: `next.config.mjs`
- Delete: `postcss.config.mjs`
- Delete: `middleware.ts` (replaced by src/middleware.ts)
- Delete: old `tailwind.config.ts` (replaced by tailwind.config.mjs)
- Delete: `ASTRO_MIGRATION_PLAN.md` (completed)
- Keep: `markdown/` directory (content reference)
- Keep: `scripts/` directory (setup scripts)

**Step 1: Remove old files**

```bash
rm -rf app/ components/ lib/
rm -f next.config.mjs postcss.config.mjs middleware.ts tailwind.config.ts
rm -f ASTRO_MIGRATION_PLAN.md
```

**Step 2: Commit**

```bash
git add -A
git commit -m "chore: remove old Next.js files after Astro migration"
```

---

## Task 21: Build Test + Fix Issues

**Step 1: Run Astro build**

```bash
npm run build
```

**Step 2: Fix any build errors**

Common issues to expect:
- Import path resolution (`@/` alias)
- Missing type declarations
- Astro component syntax issues
- React island hydration directives
- Environment variable access (`import.meta.env` vs `process.env` - Astro uses `import.meta.env`)

**Important Astro env var note:**
- Server-side: `import.meta.env.TELEGRAM_BOT_TOKEN` (no prefix needed)
- Client-side: `import.meta.env.PUBLIC_GA_ID` (must be prefixed with `PUBLIC_`)
- Update all `process.env.NEXT_PUBLIC_*` to `import.meta.env.PUBLIC_*`
- Update all `process.env.*` in API routes to `import.meta.env.*`

**Step 3: Run dev server and test**

```bash
npm run dev
```

Verify:
- Homepage renders with all sections
- Navigation scrolling works
- Mobile menu opens/closes
- Booking form loads and validates
- Legal pages render
- 404 page works

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues after migration"
```

---

## Task 22: Test API Endpoints

**Step 1: Test booking endpoint**

```bash
curl -X POST http://localhost:4321/api/booking \
  -H "Content-Type: application/json" \
  -d '{"vorname":"Test","nachname":"User","telefon":"+491234567890","email":"test@test.de","leistung":"Smart Pediküre","wunschtermin":"2026-03-15","wunschuhrzeit":"09:00 - 10:00","nachricht":"Test","datenschutz":true}'
```

Expected: 200 OK with success message (or appropriate error if DB not configured locally).

**Step 2: Test available-slots endpoint**

```bash
curl "http://localhost:4321/api/available-slots?date=2026-03-15&service=Smart%20Pedik%C3%BCre"
```

Expected: JSON array of available time slots.

**Step 3: Fix any endpoint issues**

**Step 4: Commit fixes if any**

```bash
git add -A
git commit -m "fix: resolve API endpoint issues"
```

---

## Task 23: Visual Polish + Responsive Testing

**Step 1: Test responsive breakpoints**

Open dev server and test at:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px
- Large: 1440px+

**Step 2: Polish visual details**

Check and refine:
- Typography hierarchy looks balanced
- Color contrast meets WCAG AA (sage on cream, olive on white, cream on olive)
- Organic shapes look intentional, not broken
- Hover/focus states work consistently
- Animations are smooth and not excessive
- Grain texture is subtle, not distracting
- Service cards align properly in grid
- Booking form is comfortable to use on mobile
- Footer columns collapse gracefully

**Step 3: Commit polish changes**

```bash
git add -A
git commit -m "style: visual polish and responsive refinements"
```

---

## Task 24: Final Verification + Performance Check

**Step 1: Production build**

```bash
npm run build && npm run preview
```

**Step 2: Check bundle size**

Astro should produce significantly smaller output:
- Target: < 25 KB total JS (only booking form + cookie consent + mobile menu)
- All other pages should be 0 KB JS

**Step 3: Verify all functionality**

Checklist:
- [ ] Homepage renders all 4 sections correctly
- [ ] Header navigation scrolls to correct sections
- [ ] Mobile menu opens, navigates, closes
- [ ] Service cards display all 7 services with correct prices
- [ ] About section shows photo + credentials
- [ ] Contact info cards show correct phone/email/address/hours
- [ ] Google Maps embed loads
- [ ] Booking form validates and submits
- [ ] Available slots load dynamically
- [ ] Cookie consent appears and saves preferences
- [ ] Impressum page renders with all legal content
- [ ] Datenschutz page renders with full privacy policy
- [ ] Barrierefreiheit page renders
- [ ] 404 page works for unknown routes
- [ ] Skip navigation links work (accessibility)
- [ ] Back-to-top button appears on scroll
- [ ] All meta tags present (check view-source)
- [ ] Structured data present (check view-source for JSON-LD)
- [ ] Robots.txt accessible at /robots.txt
- [ ] Sitemap generated at /sitemap-index.xml

**Step 4: Commit final state**

```bash
git add -A
git commit -m "feat: complete Astro migration with warm/organic redesign"
```

---

## Summary

| Task | Description | Estimated Complexity |
|------|-------------|---------------------|
| 1 | Initialize Astro project | Medium |
| 2 | Tailwind config + design tokens | Small |
| 3 | Copy lib files | Small |
| 4 | Base layout | Medium |
| 5 | Security middleware | Small |
| 6 | Header + MobileMenu | Large |
| 7 | Hero section | Large |
| 8 | Services section | Large |
| 9 | About section (+ benefits) | Medium |
| 10 | Contact section (+ booking + map) | Large |
| 11 | Restyle BookingForm | Medium |
| 12 | CookieConsent | Small |
| 13 | Footer | Medium |
| 14 | StructuredData | Small |
| 15 | Homepage assembly | Small |
| 16 | Legal pages + 404 | Medium |
| 17 | API endpoints | Medium |
| 18 | Sitemap + robots | Small |
| 19 | Public assets | Small |
| 20 | Clean up old files | Small |
| 21 | Build test + fixes | Medium |
| 22 | API testing | Small |
| 23 | Visual polish | Medium |
| 24 | Final verification | Small |
