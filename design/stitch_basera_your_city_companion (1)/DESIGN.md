---
name: CityWise Bengaluru
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#47464f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#070235'
  on-primary: '#ffffff'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#c4c1fb'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#000f07'
  on-tertiary: '#ffffff'
  tertiary-container: '#002819'
  on-tertiary-container: '#009d6c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  housing-indigo: '#4f46e5'
  food-orange: '#f97316'
  grocery-emerald: '#10b981'
  services-red: '#ef4444'
  gym-purple: '#a855f7'
  transport-slate: '#64748b'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin-mobile: 16px
  max-width-desktop: 1200px
---

## Brand & Style

CityWise Bengaluru embodies the "Helpful Neighbor" philosophy—sophisticated yet approachable, premium yet communal. The brand personality is optimistic, organized, and deeply rooted in the local context.

The visual style is **Corporate / Modern** with a touch of **Glassmorphism**. It utilizes a clean, systematic layout, high-quality cinematic imagery, and soft, tactile surfaces. The interface prioritizes clarity and ease of navigation for newcomers, using a "concierge" aesthetic that feels both high-end and welcoming. It balances the energy of a vibrant city with the calm of a well-organized home.

## Colors

The palette is anchored by **Deep Indigo (#1e1b4b)** as the primary brand color, conveying trust and stability. **Amber (#fbbf24)** serves as a warm secondary accent for "Best Rated" highlights and progress indicators, reflecting the city's golden dusk light.

The system uses a rich set of categorical colors for navigation tiles (Housing, Food, Grocery, etc.), utilizing 50-shade backgrounds with 900-shade text to ensure high legibility and a playful, organized feel. Backgrounds use a "Surface" system of off-whites and cool grays to maintain a crisp, airy environment.

## Typography

The typography system uses a dual-font approach to balance personality with utility. 

**Quicksand** is reserved for headings and display text. Its rounded, geometric forms provide a friendly and modern local character. **Plus Jakarta Sans** is used for all functional text, including body copy and labels. Its slightly wider apertures and clean lines ensure high readability at small sizes on mobile devices. 

Hierarchy is established through clear weight shifts—labels use SemiBold (600) or Bold (700) to distinguish themselves from regular body text.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop (centered at 1200px) and a **Safe Margin** fluid model for mobile. 

A strict 8px base unit (linear scale) governs all spacing. 
- **Mobile Margins:** A consistent 16px (`md`) horizontal margin is applied to all main content blocks.
- **Section Spacing:** Major vertical sections are separated by 24px (`lg`) or 32px (`xl`) to allow the design to "breathe."
- **Horizontal Scroll:** Lists of recommendations or checklist items use horizontal overflow with 16px spacing between items to maximize screen real estate on narrow devices.

## Elevation & Depth

Depth is achieved through a combination of **Tonal Layering** and **Ambient Shadows**:

1.  **Surfaces:** The base background is `surface` (#f7f9fb). Content containers sit on `surface-container-lowest` (#ffffff).
2.  **Shadows:** Shadows are extremely subtle and diffused (`shadow-sm`), often utilizing a slight indigo tint to match the primary brand color (e.g., `rgba(30, 27, 75, 0.04)`).
3.  **Backdrop Blurs:** Navigation bars and sticky headers use a 90% opacity white with a 10px-16px backdrop blur to maintain context while ensuring legibility over scrolled content.
4.  **Borders:** Most containers feature a 1px solid border in `outline-variant/30` to define boundaries without adding visual weight.

## Shapes

The design uses a generous and varied rounding system to reinforce the "soft and welcoming" brand voice:

-   **Standard Elements:** Buttons and input fields use a **full-pill** (9999px) radius.
-   **Content Cards:** Standard cards (Recommendations) use **18px** (`rounded-card`).
-   **Featured Sections:** Large banners and the "New in City" checklist use a more aggressive **24px** radius to emphasize their importance.
-   **Functional Chips:** Small status tags and category items use **12px** or **full-pill** depending on their size.

## Components

### Buttons & Inputs
-   **Primary FAB:** A 56x56px circular button in Primary Indigo with a white icon.
-   **Search Bar:** A full-width, pill-shaped input with a `surface-container-lowest` background, subtle shadow, and a 12px left-padded icon.
-   **Category Tiles:** 1:1 or slightly vertical tiles with a 48px circular icon container centered above a `label-md` text element.

### Cards
-   **Hero Banner:** Aspect ratio of 16:9 (mobile) or 21:9 (desktop), featuring high-quality photography with a bottom-aligned text overlay and dark gradient scrim.
-   **Product Cards:** Vertical stack with a fixed-height image (top), `label-md` title, and `body-md` metadata.

### Feedback & Status
-   **Progress Bars:** 8px height, utilizing a `surface-container` track and a `primary` or `secondary` fill.
-   **Chips:** Tiny tags (`label-sm`) with 4px/12px padding, used for "Verified" or "Community Choice" badges.

### Navigation
-   **Bottom Bar:** 64px-72px height, using 24px icons and `label-sm` labels. Active states are indicated by the Primary color and a subtle "•" indicator.