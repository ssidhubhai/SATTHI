# AGENTS.md

## Overview
This file serves as the definitive onboarding and operating manual for AI agents and human developers continuing development on **SATTHI (साथी)**. It outlines architectural boundaries, directory conventions, simulation layers, state lifecycles, and rules of engagement for future turns.

---

## CURRENT PROJECT STATUS

### 1. What is Implemented
* **Dual-Persona Marketplace (Customer & Provider)**: Seamless role switching via a persistent floating toggle (`RoleSwitcher.tsx`) backed by `localStorage` persistence.
* **Multi-City Configuration Engine**: Multi-city support for **Bengaluru**, **Mumbai**, and **Delhi NCR** (`cityConfig.ts`). Switching cities dynamically updates pricing tiers, currency, helpline numbers, local utility companies (BESCOM, Adani Electricity, BSES), state trade regulators, and hyper-local clusters.
* **Hyperlocal Clustering & Distance Engine**: Each city contains real neighborhood clusters (e.g., Indiranagar, Koramangala, HSR Layout, Bandra, Powai, Connaught Place) with dynamic provider proximity calculations, traffic corridor indicators, and ETA estimation (`dataLayer.ts`).
* **Customer Journey**:
  * **Home (`CustomerHome.tsx`)**: Search bar with real-time filtering, emergency quick callout banner, category grid with live active technician counters, nearby technician cards, and SATTHI trust guarantees.
  * **Category Details (`CategoryDetails.tsx`)**: Dual view (List view & Full interactive Map preview), quick filter chips ("Available Right Now", "Top Rated 4.8+"), and itemized labor rate cards.
  * **Provider Profile (`ProviderProfile.tsx`)**: Experience metrics, verified review lists, transparent tariff breakdown, and direct booking actions.
  * **Request Form (`RequestForm.tsx`)**: Category-specific fault chips, issue description textarea, sample inspection photo attachment toggle, immediate vs. scheduled slot selection, and transparent upfront visit fee lock.
  * **Matching Radar (`MatchingRadar.tsx`)**: Animated radar sweep visualizing local technician polling, fastest responder preview, and auto-dispatch progression.
  * **Live Tracking (`LiveTracking.tsx`)**: Simulated route visualization, live driver marker, arrival handshake PIN display, 5-stage milestone tracker, simulated traffic/recenter buttons, and milestone alert toggles.
  * **Service Receipt & Checkout (`ServiceInvoice.tsx`)**: Visual inspection proof (before/after photos), itemized labor and parts breakdown, interactive 5-star rating, tag feedback, direct pro tip selector, UPI/Cash/Card simulated payment, and printable PDF receipt modal.
  * **Activity History (`ActivityHistory.tsx`)**: Completed dispatch archive, active in-progress order tracking card, repeat provider re-booking trigger, and operations help desk card.
  * **Help & Support (`HelpSupportModal.tsx`)**: Dynamic FAQ accordion tailored to active city pricing, simulated 24/7 hotline dialer, simulated WhatsApp priority channel, and 30-day warranty rework claim submission.
* **Provider Journey**:
  * **Provider Dashboard (`ProviderDashboard.tsx`)**: Duty status toggle (Active/On Job/Resting), active job alert banner, today's gross/net earnings summary, quick action tiles (Van Spares, Emergency Grid SOS), and today's completed dispatch log.
  * **Jobs Broadcast Radar (`ProviderJobsBroadcast.tsx`)**: Urgent dispatch ticker with a 24-second digital countdown gauge, route preview thumbnail, guaranteed payout breakdown, simulated audio quote player, and Accept/Decline actions.
  * **Active Job Navigation (`ProviderActiveJob.tsx`)**: Route HUD with turn-by-turn instruction, GPS HUD simulation modal, doorstep landmark notes, customer 4-digit PIN verification with auto-fill demo helper, van stock spare parts adder, and job completion trigger.
  * **Earnings & Settlements (`ProviderEarningsView.tsx`)**: Weekly earnings bar metric, today's net bank settlement summary, HDFC settlement sandbox card, instant withdrawal simulator, and recent settled jobs list.
  * **Provider Credentials & Screening (`ProviderProfileView.tsx`)**: Master technician profile card, verified badges checklist, demo screening notice, customer role switcher, and demo state reset button.

### 2. What is Simulated / Demo-Only
All external integrations are strictly abstracted inside `/src/services/simulationService.ts` to provide an honest, decoupled boundary:
* **Payment Processing**: Simulated customer payment authorization (UPI, Card, Cash). No actual bank or payment gateway API (Razorpay/Stripe) is invoked; zero funds are debited.
* **Bank Cashouts / IMPS**: Simulated technician balance withdrawal to masked bank accounts (e.g., `HDFC Bank ****4091`). No real interbank wire or IMPS transfer occurs.
* **Telephony / Voice Relays**: Tapping phone buttons triggers masked relay simulation toasts (`simulationService.simulateVoiceCall`). No live cellular or VOIP connections are placed.
* **Messaging / Chat**: Direct chat triggers preview toasts (`simulationService.simulateChat`). No WebSockets or live messaging backend is connected.
* **WhatsApp Milestone Webhooks**: Toggling WhatsApp updates fires simulated notification events (`simulationService.simulateNotification`).
* **GPS & Navigation Telemetry**: Driver coordinates, speeds (28 km/h), and route lines are simulated vector paths. No hardware GPS or Google Maps Directions API is connected.
* **Emergency SOS**: Grid emergency buttons simulate dialing local utility hotlines (BESCOM/Adani/BSES). They explicitly instruct users to call 112 in real emergencies.
* **Identity & Background Verification**: Badges (e.g., "ITI Diploma", "Demo Screening Passed") are prototype sandbox records. No government (UIDAI/Aadhaar) or police database checks have been run.
* **Invoicing**: Documents are titled "Service Estimate & Receipt (Demo Simulation)" and carry an explicit GST disclaimer confirming they do not constitute legal tax invoices.

### 3. What is Intentionally NOT Implemented
* Real payment gateways (Razorpay, Paytm, Stripe).
* Real telephony/SMS providers (Twilio, Exotel, Gupshup).
* Real backend databases (PostgreSQL, MongoDB, Cloud SQL, Firebase) — currently running in-memory via React Context with `localStorage` persistence.
* Live geolocation APIs (HTML5 Geolocation watchPosition or Google Maps Platform live device sensors).
* Native authentication/authorization flows (login, SMS OTP, password reset) — the application uses seamless demo switching between predefined personas (`Priya M.` for resident, `Rahul Kumar` for technician).

### 4. Current Known Limitations
1. **Vertical Data Bias**: Faults and spare parts primarily reflect the Electrical vertical (MCB switches, rewiring labor) even when plumbing or carpentry is requested.
2. **Customer Home Active Dispatch Indicator**: When navigating back to Home during an active order, there is no persistent floating card on Home (the user must check Activity History to return to tracking).
3. **Provider Broadcast Synchronization**: The broadcast screen displays a static simulated dispatch rather than dynamically reflecting the customer's exact customized request form inputs.
4. **Static Map Canvas**: Live tracking and active job views use satellite background imagery with animated SVG overlays rather than a pan/zoom vector map canvas (e.g., Leaflet or Google Maps).
5. **Invoice Total Arithmetic Discrepancy**: The itemized line items in `ServiceInvoice.tsx` sum to ₹433 while the header and CTA show ₹448 due to hardcoded defaults in `AppContext.tsx`.
6. **Photo Attachment**: The photo upload in `RequestForm.tsx` toggles a pre-rendered static image rather than accepting device camera input.

### 5. Current Build & Test Status
* **TypeScript Compilation (`npm run lint` / `tsc --noEmit`)**: Passing with **0 errors**.
* **Production Build (`npm run build` / `vite build`)**: Passing with **0 errors**.
* **Bundle Output**: Successfully generates clean bundles in `/dist`.

### 6. Rules for Future AI Agents
* **Do NOT Break the Simulation Service**: All mocked external actions must route through `simulationService.ts`. Never write inline `alert()` or fake real-world confirmation messages that imply money was transferred or legal tax invoices were generated.
* **Do NOT Add Chatbots / LLM Panels**: Do NOT add "Ask AI", conversational assistants, or unnecessary Gemini panels unless explicitly instructed by the user brief.
* **Preserve Dual Role Switching**: Any state changes to `activeRequest`, `providers`, or `pastRequests` in `AppContext.tsx` must remain accessible and functional in both Customer and Provider views.
* **Strict Styling Discipline**: All styling must use Tailwind CSS v4 design tokens (`--color-primary`, `--color-surface-container`, etc.) defined in `/src/index.css`. Never write inline style overrides for colors or import separate `.css` modules.
* **Port & Environment**: Dev server must run on port 3000. Avoid `window.open` or `window.alert` (which fail in sandbox iframes).

### 7. Files / Systems That Should NOT Be Casually Modified
* `src/config/cityConfig.ts`: Central truth for multi-city definitions, pricing rules, tax parameters, and locality coordinates.
* `src/services/simulationService.ts`: Architectural boundary for mock vs. real external integrations.
* `src/context/AppContext.tsx`: Core state store coordinating the entire lifecycle of dispatches, active jobs, and role switching.
* `src/index.css`: Tailwind v4 theme definitions and typography utilities matching Stitch design tokens.

---

## Directory Layout
```
├── AGENTS.md                  # Developer manual & operating guidelines (this file)
├── PRODUCT.md                 # Product vision, persona models, business logic
├── ARCHITECTURE.md            # Technical architecture, component graph, state flows
├── DESIGN_SYSTEM.md           # Tokens, typography, color semantics, visual patterns
├── DATA_MODEL.md              # TypeScript interfaces, entity schemas, lifecycles
├── UX_FLOWS.md                # End-to-end user journeys & step-by-step state charts
├── QA_CHECKLIST.md            # Test scenarios, edge cases, regression checklists
├── CHANGELOG.md               # Version history and milestone documentation
├── index.html                 # App entry point with meta tags & Google Fonts
├── metadata.json              # Studio project metadata and capabilities
├── package.json               # NPM packages & build scripts
├── vite.config.ts             # Vite build configuration
└── src/
    ├── main.tsx               # React root mount
    ├── App.tsx                # Screen routing & header/bottom-nav wrapper
    ├── index.css              # Tailwind v4 theme tokens & typography classes
    ├── types/
    │   └── index.ts           # Central TypeScript types & interfaces
    ├── config/
    │   └── cityConfig.ts      # Multi-city pricing, clusters, utility configurations
    ├── data/
    │   ├── dataLayer.ts       # Proximity, ETA, filter, and pricing calculations
    │   └── mockData.ts        # Seed data (providers, dispatches, spare parts)
    ├── services/
    │   └── simulationService.ts # Decoupled abstraction for mocked integrations
    ├── context/
    │   └── AppContext.tsx     # Global React Context provider and state actions
    └── components/
        ├── Header.tsx         # Context-aware app bar with SOS & back actions
        ├── BottomNav.tsx      # Customer navigation dock (Home, Activity, Help)
        ├── RoleSwitcher.tsx   # Persistent Customer ⇄ Provider floating toggle
        ├── LocationDrawer.tsx # Multi-city & cluster selection drawer
        ├── ToastContainer.tsx # Global floating toast notification stack
        ├── CustomerHome.tsx   # Customer landing screen & service catalog
        ├── CategoryDetails.tsx# Vertical drill-down (list & tactical map views)
        ├── ProviderProfile.tsx# Technician bio, pricing menu, review cards
        ├── RequestForm.tsx    # Multi-step diagnostics & booking form
        ├── MatchingRadar.tsx  # Animated broadcast radar & technician matching
        ├── LiveTracking.tsx   # Dispatch map, arrival PIN, milestone tracker
        ├── ServiceInvoice.tsx # Itemized bill, PDF receipt preview, simulated pay
        ├── ActivityHistory.tsx# Past dispatches, active order card, re-booking
        ├── HelpSupportModal.tsx # Operations desk FAQs, warranty claims, hotlines
        ├── ProviderDashboard.tsx# Technician home, duty toggle, earnings snapshot
        ├── ProviderJobsBroadcast.tsx # Incoming emergency dispatch radar
        ├── ProviderActiveJob.tsx # Navigation HUD, PIN entry, van parts manager
        ├── ProviderEarningsView.tsx # Weekly performance chart & IMPS cashout
        └── ProviderProfileView.tsx # Technician credentials & demo controls
```

---

## Build, Test & Lint Commands
```bash
# Start development server on port 3000
npm run dev

# Run TypeScript type check
npm run lint

# Compile production bundle
npm run build

# Preview production build
npm run preview
```
