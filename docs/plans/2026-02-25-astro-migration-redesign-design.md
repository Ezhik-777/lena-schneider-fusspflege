# Astro Migration + Redesign Design

## Overview

Migrate the Lena Schneider Fusspflege website from Next.js 15 to Astro 5 with a complete visual redesign. The current site is functional but has a generic "AI-generated" blue tech aesthetic. The new design adopts a warm, organic, boutique-spa identity that matches the business.

## Tech Stack

- **Framework**: Astro 5 with React integration (islands)
- **Styling**: Tailwind CSS 4
- **Interactive components**: React 18 (BookingForm, MobileMenu only)
- **Deployment**: Vercel with Astro adapter
- **Database**: Vercel Postgres (unchanged)
- **Email**: Resend (unchanged)
- **Notifications**: Telegram bot via Telegraf (unchanged)

### Architecture Decision: Astro Islands

All static content (Hero, Services, About, Contact, Footer) becomes `.astro` components with zero client-side JavaScript. Only the BookingForm and MobileMenu remain as React islands (`client:load` / `client:visible`). This reduces the JavaScript bundle from ~134 KB to ~15 KB.

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| cream | #FDF6EC | Page background |
| warm-white | #FFFCF7 | Card backgrounds |
| sage | #8B9E7E | Primary actions, navigation accents |
| sage-light | #A8B89E | Hover states, borders |
| sage-dark | #6B7E60 | Active states |
| terracotta | #C67D5B | CTAs, highlights, prices |
| terracotta-dark | #A8674A | CTA hover |
| olive | #4A5540 | Headings, dark backgrounds (footer) |
| olive-light | #5C6B50 | Secondary text |
| gold | #D4A574 | Subtle accents, decorative borders |
| gold-light | #E8C9A0 | Badges, light accents |
| text-dark | #2D2A26 | Body text |
| text-muted | #6B6560 | Secondary text |
| amber-bg | #FEF3E2 | Warning/note backgrounds |
| amber-border | #F0D4A8 | Warning/note borders |

### Typography

- **Display**: DM Serif Display (Google Fonts) - headings, logo
- **Body**: Outfit (Google Fonts) - body text, UI elements
- **Scale**: Responsive fluid sizing using clamp()

### Design Principles

1. Warm, natural, spa-like atmosphere
2. Organic shapes (rounded corners 16px+, blob image masks)
3. Subtle textures (linen/grain overlays on backgrounds)
4. Generous whitespace
5. Botanical SVG accents (decorative leaves/branches)
6. No harsh shadows - soft, diffused elevation

## Page Structure

Streamlined single-page scroll:

```
Header (sticky)
  |
Hero
  |
Services (moved up - what you offer first)
  |
About (credentials + benefits merged)
  |
Contact + Booking (merged into one section)
  |
Footer
```

### Removed/Merged Sections
- **Benefits** -> folded into About section as credential cards
- **ServiceArea** -> folded into Contact section
- **Separate BookingForm** -> embedded in Contact section

## Section Designs

### Header
- Transparent background at top of page, cream with backdrop-blur on scroll
- Logo: "Lena Schneider" in DM Serif Display with a small botanical icon
- Navigation: Outfit font, sage color, subtle underline on active
- CTA: "Termin buchen" button in terracotta with rounded corners
- Mobile: hamburger menu, slide-down panel with organic rounded corners

### Hero
- Full-width cream background with subtle linen/grain texture overlay (CSS noise)
- Large DM Serif Display headline: "Professionelle Fusspflege in Erligheim"
- Subtitle in Outfit, muted text color
- Hero image in organic rounded shape (border-radius with asymmetry)
- Terracotta CTA button + secondary outline button for phone
- Trust badges as small inline pills (sage background)
- Decorative botanical SVG elements as background accents

### Services
- Cream section background
- Section title with decorative line/botanical accent
- Cards: warm-white background, gold border on hover, 16px+ border-radius
- Icon circle at top in sage/olive
- Price in terracotta, bold
- Duration in muted text with clock icon
- Hover: subtle lift + gold border glow
- New customer discount banner: warm gradient, organic border, celebratory but tasteful

### About
- White/cream split section
- Left: owner photo in organic rounded shape (matching hero style)
- Right: personal text, credentials grid (2x2)
- Credential cards: sage icon background, compact, warm hover state
- Benefits from the old section integrated as credential items

### Contact + Booking (merged)
- Soft gradient background (cream to slightly warmer)
- Contact info cards in a row: phone, email, address, hours
- Each card: warm-white bg, subtle border, sage icon
- Below cards: booking form (React island)
- Booking form restyled: cream input backgrounds, sage focus rings, terracotta submit
- Cancellation policy: amber-toned card with warm border
- Google Maps link integrated with address card

### Footer
- Deep olive (#4A5540) background
- Cream/gold text
- 4-column layout: company info, quick links, services, contact
- Top border: subtle gold gradient line
- Bottom bar: copyright + legal links
- Back-to-top button: terracotta, organic rounded shape

## Preserved Functionality

All existing functionality stays intact:
- Online booking with date/time slot selection
- Telegram bot notifications with inline confirm/reject
- Email confirmations via Resend
- Rate limiting and security (CSRF, SQL injection prevention, honeypot)
- Cookie consent (GDPR)
- Legal pages (Impressum, Datenschutz, Barrierefreiheit)
- SEO (structured data, sitemap, meta tags)
- Accessibility (WCAG 2.1 AA)

## File Structure

```
src/
  components/
    Header.astro
    Hero.astro
    Services.astro
    About.astro
    Contact.astro
    Footer.astro
    CookieConsent.astro
    StructuredData.astro
    react/
      BookingForm.tsx
      MobileMenu.tsx
  layouts/
    Layout.astro
  pages/
    index.astro
    impressum.astro
    datenschutz.astro
    barrierefreiheit.astro
    404.astro
    api/
      booking.ts
      available-slots.ts
      contact.ts
      telegram/
        index.ts
        webhook.ts
  lib/
    constants.ts
    db/index.ts
    security.ts
    env.ts
    german-holidays.ts
    email-templates.ts
    service-config.ts
  styles/
    global.css
public/
  images/
  fonts/
  robots.txt
  manifest.json
```
