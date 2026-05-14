---
name: Logistics Integrity System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5e3f3b'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#926e6a'
  outline-variant: '#e8bdb7'
  surface-tint: '#c0000d'
  primary: '#a70009'
  on-primary: '#ffffff'
  primary-container: '#d40511'
  on-primary-container: '#ffe4e0'
  inverse-primary: '#ffb4aa'
  secondary: '#745b00'
  on-secondary: '#ffffff'
  secondary-container: '#fecb00'
  on-secondary-container: '#6e5700'
  tertiary: '#504f66'
  on-tertiary: '#ffffff'
  tertiary-container: '#68677f'
  on-tertiary-container: '#eae7ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#ffe08b'
  secondary-fixed-dim: '#f1c100'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#584400'
  tertiary-fixed: '#e2e0fc'
  tertiary-fixed-dim: '#c6c4df'
  on-tertiary-fixed: '#1a1a2e'
  on-tertiary-fixed-variant: '#45455b'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  text-primary: '#333333'
  text-secondary: '#666666'
  border-subtle: '#DDDDDD'
  status-open: '#E74C3C'
  status-progress: '#F39C12'
  status-resolved: '#27AE60'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for the DHL Incident Reporting System, prioritizing rapid information processing, reliability, and corporate authority. The brand personality is efficient, professional, and uncompromisingly clear, reflecting the critical nature of logistics incident management.

The design style follows a **Corporate / Modern** aesthetic with high-contrast functional elements. It leverages a card-based architecture to organize complex data into digestible modules. By utilizing heavy whitespace and a strictly governed color application, the UI minimizes cognitive load for operators handling high-priority reports. The visual language is grounded in the "Delivery" heritage—utilizing bold brand colors against a neutral, expansive canvas to create a sense of systematic order.

## Colors

The palette is anchored by the iconic DHL Red and Yellow, used strategically to drive action and brand recognition. 

- **Primary Red (#D40511):** Reserved for primary actions, critical alerts, and brand headers. It must be used sparingly to maintain its urgency.
- **Secondary Yellow (#FFCC00):** Used for highlighting, progress indicators, and decorative accents that require high visibility without the "danger" connotation of red.
- **Neutral Stack:** The background employs a very light gray (#F5F5F5) to reduce eye strain during long shifts, while white (#FFFFFF) is used exclusively for card surfaces to create distinct "islands" of information.
- **Semantic Statuses:** A dedicated functional palette handles incident states (Open, In Progress, Resolved) to ensure status clarity is never confused with brand identity.

## Typography

This design system utilizes **Inter** (as the closest high-quality equivalent to the "Delivery" system font) to ensure maximum legibility across digital displays. 

The type hierarchy is highly structured:
- **Headlines:** Use Bold weights to establish a clear information hierarchy. The `-0.02em` letter spacing on larger sizes ensures a compact, "engineered" look.
- **Body:** Standardized at 14px for data density, scaling to 16px for long-form report descriptions.
- **Labels:** Uppercase bold labels are used for metadata headers (e.g., "INCIDENT ID", "TIMESTAMP") to differentiate field titles from user-generated content.

## Layout & Spacing

The system employs a **Fixed Grid** model for the main dashboard content to maintain control over data density, while the navigation sidebar remains fluid.

- **Grid:** A 12-column grid system with 24px gutters.
- **Rhythm:** A 4px baseline grid governs all internal component spacing (padding, gaps).
- **Structure:** Content is housed within a central container (max 1440px). On mobile, margins shrink to 16px, and the 12-column grid collapses into a single-column stack.
- **Dashboard Layout:** A persistent left-hand navigation (Dark Navy) provides global context, while the main stage uses the Light Gray background to host White content cards.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** combined with **Ambient Shadows**.

- **Surface 0 (Background):** #F5F5F5 - The foundation of the application.
- **Surface 1 (Cards):** #FFFFFF - Primary content containers. These use a subtle shadow (`0 2px 12px rgba(0,0,0,0.08)`) to lift them slightly from the background without creating heavy visual noise.
- **Surface 2 (Floating/Modals):** #FFFFFF - Used for dropdowns and dialogs. These feature a more pronounced shadow (`0 8px 24px rgba(0,0,0,0.12)`) to indicate higher z-index priority.
- **Interactive States:** Buttons and interactive cards do not use elevation changes on hover; instead, they use subtle background color shifts to maintain a flat, professional profile.

## Shapes

The design system uses a mixed-radius approach to balance approachability with professional structure.

- **Cards:** 12px (rounded-lg) - Larger radius to create a soft, modern container feel.
- **Components:** 8px (default) - Buttons, input fields, and chips use a tighter radius to maintain a precise, technical appearance.
- **Icons:** Should be encased in square or slightly rounded (4px) containers to align with the geometric nature of the DHL logo.

## Components

### Buttons
- **Primary:** Solid #D40511 background, White text, Bold weight. High-contrast.
- **Secondary:** White background, 1px #DDDDDD border, #333333 text.
- **Tertiary:** No border, #D40511 text, ghost background on hover.

### Input Fields
- White background, 1px #DDDDDD border, 8px corner radius.
- Labels are positioned above the field in `label-bold` style.
- Focus state: 2px solid #FFCC00 border.

### Chips (Status Indicators)
- Small, 8px rounded badges with background colors corresponding to the Status Palette.
- Text is always high-contrast (e.g., White text on Red/Green, Dark Text on Yellow).

### Cards
- White background, 12px radius, subtle ambient shadow.
- Header area inside the card uses a subtle bottom border if data density is high.

### Lists & Data Tables
- Clean, no-border rows separated by a 1px #DDDDDD horizontal rule.
- Hover states on rows use a #F9F9F9 background shift.
- Column headers use `label-bold` styling.

### Navigation Sidebar
- Background: #1A1A2E.
- Active item: Left-hand #FFCC00 accent border with a subtle white opacity background shift.
- Icons: Linear, 24px size, consistent stroke weight.
