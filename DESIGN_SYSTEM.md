# DESIGN_SYSTEM.md

## 1. Visual Philosophy & Core Aesthetics
* **Theme**: Modern Editorial Blue-Collar Marketplace.
* **Mood**: Warm, human, utilitarian, high-contrast, trustworthy.
* **Palette Principle**: Grounded in natural terra-cotta/burnt orange (`#ac2d00`) representing manual craftsmanship and energy, balanced by crisp slate neutrals and deep emergency utility blues.
* **Anti-AI-Slop Discipline**: Zero generic rounded-pill clutter, no decorative purple gradients, no floating drop-shadow fluff. Information hierarchy is enforced through bold typography weights, structured card containers, and clear status badges.

---

## 2. Color Palette & Semantic Tokens (Tailwind CSS v4 `@theme`)

Defined in `/src/index.css`:

```css
@theme {
  /* Primary Tones (Terracotta / Burnt Orange) */
  --color-primary: #ac2d00;
  --color-primary-container: #d04317;
  --color-primary-fixed: #ffdbd1;
  --color-primary-fixed-dim: #ffb5a0;
  --color-on-primary: #ffffff;
  --color-on-primary-fixed: #3b0900;
  --color-on-primary-fixed-variant: #872100;
  --color-inverse-primary: #ffb5a0;

  /* Surfaces & Containers (Neutral Slate) */
  --color-surface: #f9f9ff;
  --color-surface-dim: #d9d9df;
  --color-surface-bright: #f9f9ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f3f9;
  --color-surface-container: #ededf3;
  --color-surface-container-high: #e8e8ed;
  --color-surface-container-highest: #e2e2e8;
  --color-surface-variant: #e2e2e8;
  --color-on-surface: #1a1c20;
  --color-on-surface-variant: #5a413a;
  --color-inverse-surface: #2f3035;
  --color-inverse-on-surface: #f0f0f6;

  /* Secondary Tones (Subtle Warm Charcoal) */
  --color-secondary: #625e58;
  --color-secondary-container: #e5dfd7;
  --color-on-secondary: #ffffff;
  --color-secondary-fixed: #e8e1da;

  /* Tertiary Tones (Utility Blue / Electrical Cyan) */
  --color-tertiary: #006194;
  --color-tertiary-container: #007bb9;
  --color-on-tertiary-container: #fdfcff;
  --color-tertiary-fixed: #cce5ff;
  --color-on-tertiary: #ffffff;

  /* Functional Status Colors */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;
  --color-on-error: #ffffff;
}
```

---

## 3. Typography Scale (`Plus Jakarta Sans`)

Utility classes pre-configured in `/src/index.css`:

| Utility Class | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- |
| `.font-headline-xl` | `40px / 48px` | 800 (Extra Bold) | Desktop hero headings |
| `.font-headline-xl-mobile` | `30px / 38px` | 800 (Extra Bold) | Mobile hero headings, earnings gross |
| `.font-headline-lg` | `32px / 40px` | 700 (Bold) | Major section titles |
| `.font-headline-lg-mobile` | `24px / 32px` | 700 (Bold) | Modal titles, job titles |
| `.font-headline-md` | `22px / 28px` | 700 (Bold) | Card headers, invoice service title |
| `.font-headline-sm` | `18px / 24px` | 600 (Semi Bold)| Card subsection labels |
| `.font-body-lg` | `16px / 24px` | 400 (Regular) | Long-form descriptions |
| `.font-body-md` | `14px / 20px` | 400 (Regular) | Default interface text |
| `.font-body-sm` | `12px / 16px` | 400 (Regular) | Captions, secondary metadata |
| `.font-label-lg` | `14px / 20px` | 700 (Bold) | Action buttons, form inputs |
| `.font-label-md` | `12px / 16px` | 600 (Semi Bold)| Status pills, table column headers |
| `.font-label-sm` | `11px / 14px` | 600 (Semi Bold)| Micro-tags, timestamps |
| `.font-data-metric` | Monospace digits | 700 / 800 | Currency figures, OTP codes, timer gauges |

---

## 4. Spacing, Borders & Radius Scale

```css
--spacing-space-xs: 0.25rem;  /* 4px */
--spacing-space-sm: 0.5rem;   /* 8px */
--spacing-space-md: 1.0rem;   /* 16px */
--spacing-space-lg: 1.5rem;   /* 24px */
--spacing-space-xl: 2.5rem;   /* 40px */
--spacing-margin: 1.0rem;     /* 16px mobile gutters */
```

* **Border Radius**:
  * `rounded-md`: Small chip buttons and badges.
  * `rounded-xl`: Default content cards and action panels.
  * `rounded-2xl`: High-elevation modals, hero cards, and drawers.
  * `rounded-full`: Floating action buttons, avatar masks, and ping dots.

---

## 5. Iconography Guidelines
* **Library**: Google `Material Symbols Outlined`.
* **Classes**:
  * Default outline: `<span className="material-symbols-outlined text-[20px]">icon_name</span>`
  * Solid fill: `<span className="material-symbols-outlined text-[20px] fill-1">icon_name</span>`
* **Standard Key Icons**:
  * `electric_bolt`: Electrical service
  * `plumbing`: Plumbing service
  * `carpenter`: Carpentry service
  * `mode_fan`: AC & appliance service
  * `verified_user` / `shield`: Security & insurance badges
  * `near_me` / `two_wheeler`: Transit & GPS telemetry
  * `handshake`: Doorstep PIN handshake & zero-commission guarantee
  * `receipt_long`: Service invoice & itemized breakdown
  * `support_agent`: Operations desk helpline

---

## 6. Common UI Patterns

### 1. Status Indicator Badge
```tsx
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-label-md text-label-md font-bold">
  <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_0_2px_#DCFCE7]"></span>
  Job Verified &amp; Completed
</span>
```

### 2. Itemized Tariff Row
```tsx
<div className="p-3 bg-surface-container-lowest flex items-center justify-between text-xs">
  <div>
    <span className="font-bold text-on-surface block">MCB Rewiring Labor</span>
    <span className="text-secondary text-[11px]">Fixed tariff standard rate</span>
  </div>
  <span className="font-bold text-on-surface font-mono">₹220.00</span>
</div>
```

### 3. Floating Bottom Action Dock
```tsx
<div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-md px-margin py-3 pb-safe border-t border-surface-container/60">
  <div className="max-w-2xl mx-auto flex items-center justify-between">
    {/* Left Price / Summary */}
    {/* Right Action CTA */}
  </div>
</div>
```
