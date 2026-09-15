---
name: book-ai-project
status: final
created: 2026-09-15
updated: 2026-09-15
sources:
  - ../../prds/prd-book-ai-project-2026-09-15/prd.md
colors:
  canvas: '#F7F5EF'
  surface: '#FFFFFF'
  ink: '#18212B'
  muted-ink: '#5B6673'
  action-blue: '#155EEF'
  success: '#067647'
  warning: '#B54708'
  danger: '#B42318'
  hairline: '#D8DEE6'
typography:
  heading:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 'clamp(1.75rem, 4vw, 3.5rem)'
    fontWeight: '700'
    lineHeight: '1.15'
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: '400'
    lineHeight: '1.6'
rounded:
  button: '6px'
  card: '8px'
  badge: '9999px'
spacing:
  unit: '8px'
  gutter-mobile: '20px'
  gutter-desktop: '32px'
---

# Design system

The first release uses a restrained editorial style for a personal knowledge brand. This is a reversible visual direction proposed because no visual references or palette were supplied. Content and books remain the focus; color and decoration never compete with the purchase action.

## Brand & Style

Quiet editorial minimalism: warm reading surfaces, dark ink, one trustworthy blue action color, and generous spacing. Public pages should feel like a considered personal journal with a clear store section. Admin pages use the same tokens with denser layout and stronger table hierarchy.

## Colors

- **Warm canvas** (`#F7F5EF`) is the public reading background.
- **White surface** (`#FFFFFF`) is used for cards, forms, and admin panels.
- **Ink** (`#18212B`) is primary text and headings.
- **Muted ink** (`#5B6673`) is metadata and supporting text.
- **Action blue** (`#155EEF`) is reserved for primary actions, links, focus, and PayPal checkout affordances.
- **Success** (`#067647`), **warning** (`#B54708`), and **danger** (`#B42318`) are used only for state communication.
- **Hairline** (`#D8DEE6`) separates content without heavy borders.

## Typography

Use a readable sans-serif stack: `Inter, ui-sans-serif, system-ui, sans-serif`. Headings use 700 weight and compact line height; body text uses 400 weight and 1.6 line height. Prices and order states use the same family so international currencies and numbers remain legible. Do not rely on all caps for meaning.

## Layout & Spacing

Use an 8px spacing unit, 20px mobile page margins, 32px desktop gutters, and a maximum public reading width of 1120px. Book cards form a responsive grid; blog and personal-information reading columns stay narrower. Admin pages may use full width for order tables. Breakpoints are behavioral choices in `EXPERIENCE.md`, not visual-only breakpoints.

## Elevation & Depth

Prefer surface contrast and spacing over shadows. Cards use a subtle `0 4px 16px rgba(24,33,43,.06)` shadow only when they need separation from the canvas. Dialogs and the admin navigation may use a stronger shadow. Avoid gradients and decorative glass effects.

## Shapes

Use 8px radius for cards and dialogs, 6px for inputs and buttons, and 9999px only for compact status badges. Keep primary purchase buttons rectangular with a clear hit area rather than pill-shaped marketing controls.

## Components

- **Site header:** logo/name at left; links to Info, Blog, Books, and TikTok; one primary Books action. Mobile navigation opens from a labeled menu button.
- **Book card:** title, short description, USD price, and one primary purchase action. The external Download link is never shown before payment.
- **Checkout form:** visible labels, email, international phone, order summary, and PayPal action. Validation sits beside the affected field.
- **Status banner:** uses semantic color and text; never communicates state by color alone.
- **Admin sidebar:** grouped links for Dashboard, Books, Orders, Email history, Personal info, Blog, and Affiliate links. On small screens it becomes a labeled drawer.
- **Data table:** predictable columns, responsive stacked details on small screens, keyboard-accessible row actions.
- **Primary button:** `{colors.action-blue}` background, white text, `{rounded.button}` radius, visible focus ring.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep purchase actions obvious and quiet | Use countdowns, fake scarcity, or aggressive motion |
| Show state in text plus semantic color | Use color alone for payment or email state |
| Preserve readable line lengths and whitespace | Turn personal pages into dense dashboards |
| Keep admin controls close to the object they edit | Hide resend or failure details behind unlabeled icons |
| Use real owner content when supplied | Invent biography, testimonials, reviews, or customer counts |
