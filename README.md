# SATTHI (साथी) — On-Demand Hyperlocal Blue-Collar Services

> **साथी — "Your Trusted Neighbourhood Craftsman"**  
> *Fair, transparent, under-15-minute emergency home repairs powered by a ₹0-commission marketplace and zero-trust doorstep handshakes.*

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore_Realtime-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary_Startup_Sandbox-orange)](#license)

---

## 📑 Table of Contents
1. [Executive Summary & Startup Pitch](#-executive-summary--startup-pitch)
2. [The Problem: Why Urban Home Services Are Broken](#-the-problem-why-urban-home-services-are-broken)
3. [The SATTHI Solution: How We Solve It](#-the-satthi-solution-how-we-solve-it)
4. [Market Opportunity & Unit Economics](#-market-opportunity--unit-economics)
5. [Visual UI Walkthrough & Screens](#-visual-ui-walkthrough--screens)
6. [Core Feature Breakdown](#-core-feature-breakdown)
7. [The Zero-Trust Doorstep Handshake Protocol](#-the-zero-trust-doorstep-handshake-protocol)
8. [Dual Persona Architecture (Customer ⇄ Provider)](#-dual-persona-architecture-customer--provider)
9. [Multi-City & Hyperlocal Clustering Engine](#-multi-city--hyperlocal-clustering-engine)
10. [Technical Architecture & State Management](#-technical-architecture--state-management)
11. [Development Journey: What Was Built vs. What's Next](#-development-journey-what-was-built-vs-whats-next)
12. [Future Production Roadmap](#-future-production-roadmap)
13. [Getting Started & Local Execution Guide](#-getting-started--local-execution-guide)
14. [Testing Live Real-Time Multi-Device Sync](#-testing-live-real-time-multi-device-sync)
15. [Simulation Boundary & Honest Disclaimers](#-simulation-boundary--honest-disclaimers)

---

## 🚀 Executive Summary & Startup Pitch

### Elevator Pitch
In fast-paced urban India, when an MCB switch trips at 10 PM, a bathroom pipe bursts during morning office prep, or a main door deadbolt jams, residents are stranded between two terrible choices: **unreliable local handymen** with unpredictable pricing and zero accountability, or **legacy gig-economy mega-aggregators** who charge exorbitant markups, impose 3-hour booking windows, and siphon 25%–35% of the technician's hard-earned labor into corporate commissions.

**SATTHI (साथी)** is a next-generation hyperlocal on-demand dispatch network that unites urban residents with verified independent electricians, plumbers, carpenters, and appliance mechanics within **under 15 minutes**. Operating on an ethical **₹0-Commission Model**, SATTHI allows independent trade craftsmen to take home 100% of their diagnostic and repair labor, while customers enjoy guaranteed upfront pricing, genuine distributor-rate spare parts, and military-grade safety via our **Dual-PIN Handshake Protocol**.

```
   ┌─────────────────────────────────────────────────────────────┐
   │                       SATTHI (साथी)                         │
   │           "Fair To The Resident. Dignified To The Pro."      │
   ├──────────────────────────────┬──────────────────────────────┤
   │        FOR RESIDENTS         │        FOR TECHNICIANS       │
   ├──────────────────────────────┼──────────────────────────────┤
   │ ⚡ <15-Min Emergency SLA     │ 💰 ₹0 Aggregator Commission  │
   │ 🔒 Upfront Locked Tariff     │ ⚡ Instant IMPS Bank Cashout │
   │ 🏷️ Direct Distributor Spares │ 📍 2.5 km Localized Density  │
   │ 🛡️ 30-Day Free Rework Policy │ 📜 Verified Digital Trades   │
   │ 🤝 4-Digit Doorstep Handshake│ 🤝 Guaranteed Cash Handshake │
   └──────────────────────────────┴──────────────────────────────┘
```

---

## ⚡ The Problem: Why Urban Home Services Are Broken

India's urban blue-collar services market is a **$20+ Billion unorganized sector** undergoing violent digital disruption. However, existing first-generation platforms have prioritized shareholder extractivism over customer trust and technician welfare:

### 1. Consumer Pain Points (The Resident's Ordeal)
* **The Emergency Blindspot**: When a critical electrical fault or water leakage occurs, standard aggregators offer appointments "Tomorrow between 2:00 PM – 6:00 PM". Emergency repairs cannot wait 18 hours.
* **Middleman Markup & Opaque Tariffs**: Residents frequently experience bait-and-switch pricing: a ₹99 booking fee turns into a ₹1,200 bill without itemized labor or material cost justification.
* **Parts Price Gouging**: Rogue contractors charge ₹650 for an electrical socket that retails at the local electrical shop for ₹140.
* **Stranger Danger & Safety Anxiety**: Residents (particularly elderly citizens and women living alone) worry about unverified workers entering private residences without cryptographic arrival verification.
* **Vanishing Accountability**: Once the handyman leaves, if the fix trips or leaks 3 days later, the aggregator disclaims responsibility or demands another fresh service charge.

### 2. Technician Pain Points (The Artisan's Crisis)
* **Predatory Commission Siphoning (25%–35%)**: On an ₹800 repair job, aggregators deduct up to ₹280 for "lead generation and marketing fees", leaving the skilled professional with below-subsistence earnings after deducting petrol costs.
* **Weekly Payout Delays & Penalty Deductions**: Independent technicians live day-to-day on working capital; corporate aggregators hold their funds for 7 to 14 days and levy arbitrary penalties for declined jobs.
* **Cross-City Commuting Exhaustion**: Technicians are dispatched 15 to 25 km across sprawling traffic bottlenecks (e.g., from Whitefield to Indiranagar in Bengaluru), wasting 3+ hours daily on unbillable transit.
* **Zero Ownership & Rating Tyranny**: Technicians are treated as fungible cogs; their personal reputation and client relationships remain locked inside the corporate database.

---

## 💡 The SATTHI Solution: How We Solve It

SATTHI fundamentally redesigns the economic and operational incentive structure of urban blue-collar services:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            THE SATTHI ENGINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Resident Booking] ──► [Hyperlocal Broadcast] ──► [Instant Pro Accept]     │
│   • Locked Base Fee      • 2.5 km Radius Polygon    • 24-sec Countdown      │
│   • Photo Diagnosis      • Real-time Route HUD      • Audio Quote Playback  │
│                                                                             │
│                                      │                                      │
│                                      ▼                                      │
│                                                                             │
│  [Doorstep Security] ◄─ [Live Route GPS HUD]  ◄── [Technician Transit]      │
│   • 4-Digit Arrival PIN  • Turn-by-Turn Waypoint    • Van Spares Ready      │
│   • Tool Unlock Barrier  • Landmark Guidance        • 28 km/h Transit Speed │
│                                                                             │
│                                      │                                      │
│                                      ▼                                      │
│                                                                             │
│  [Direct Spares]    ──► [Zero-Trust Cash]    ──► [Settlement & Warranty]    │
│   • Branded at MSRP      • 4-Digit Handshake PIN    • ₹0 Comm. Retained     │
│   • Zero Markup          • Doorstep Physical Cash   • 30-Day Guarantee      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. 15-Minute Hyperlocal Polling
Instead of broadcasting across entire metropolitan regions, SATTHI clusters cities into **2.5 km operational hexagons** (e.g., *Indiranagar Hub, Koramangala 4th Block, Bandra West, Connaught Place*). Dispatches reach only on-duty mobile vans located within minutes of the customer's doorstep.

### 2. ₹0 Aggregator Commission Standard
Technicians retain **100% of diagnostic and labor fees**. SATTHI charges only a flat, transparent **₹20 platform routing fee** per completed order to maintain server infrastructure. The technician earns ₹400–₹600 more per day, enabling them to offer competitive, honest rates to customers.

### 3. Upfront Price Lock & Automatic Fee Waiver
Diagnostic visit fees (e.g., ₹99 for Electrician/Plumber, ₹149 for Carpenter) are locked prior to dispatch. If the actual repair labor exceeds ₹300, the diagnostic fee is **100% waived**, preventing double-charging.

### 4. Zero-Trust Dual Handshake Security
* **Arrival PIN**: When the technician arrives at the gate, they cannot start billing until the resident shares their 4-digit Arrival PIN.
* **Completion PIN**: When repair work is finished, the resident visually inspects the fix, checks the transparent bill, and shares their 4-digit Completion PIN upon handing over cash. This immediately completes the ticket on Firestore and credits the technician's digital ledger.

### 5. Genuine Spare Parts Guarantee
Technicians carry pre-cataloged van stock (Havells sockets, Schneider MCBs, Jaquar cartridges, Godrej locks) billed at direct distributor MRP with no artificial platform margin.

---

## 📊 Market Opportunity & Unit Economics

### Market Sizing (India Metros)
* **Total Addressable Market (TAM)**: $24.8 Billion (India Home Services & Maintenance, 2026 est.)
* **Serviceable Available Market (SAM)**: $6.2 Billion (Top 8 Tier-1 Metros: Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad)
* **Serviceable Obtainable Market (SOM)**: $420 Million (Urgent Emergency Diagnostics & Minor Repairs in high-density urban corridors)

### Unit Economics Per Dispatch (Typical Electrical Repair)
```
  Customer Pays (Total):                                ₹433
  ├── Technician Diagnostic Base Fee:          ₹99
  ├── Repair Labor (Rewiring & Terminal Fix):  ₹180
  ├── Branded Spare Part (Havells 16A Socket): ₹139
  └── Platform Safety & Warranty Surcharge:    ₹15
      ├── 18% GST on Platform Fee:            ₹3
      └── First-Time Promo Waiver:            (-₹15)  [Net Customer = ₹433]

  Technician Payout (Settlement):                       ₹418
  ├── Gross Labor & Material Collected:        ₹418
  ├── SATTHI Commission Rate:                  0.0%  (₹0)
  └── Flat Platform Routing Infrastructure:    -₹20
  ─────────────────────────────────────────────────────────────
  NET EARNED IN HAND TO TECHNICIAN:            ₹398  (Instant IMPS)
```

---

## 📱 Visual UI Walkthrough & Screens

SATTHI features a production-grade, tactile mobile design engineered with Tailwind CSS v4 design tokens, high-contrast industrial colorways, and warm saffron/emerald accents.

### Screen 1: Customer Home & Emergency Broadcast Card
```
┌────────────────────────────────────────┐
│ 📍 Indiranagar Hub, Bengaluru     [🔔] │
│ Hi Priya, what needs repair today?     │
├────────────────────────────────────────┤
│ 🚨 EMERGENCY DISPATCH (Under 15 Mins)  │
│ Active nearby technicians on alert: 14 │
│ [ ⚡ Request Emergency Electrician ]   │
├────────────────────────────────────────┤
│ SERVICE VERTICALS                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ ⚡ Power │ │ 🔧 Plumb │ │ 🪚 Wood  │ │
│ │  ₹99 Min │ │  ₹99 Min │ │ ₹149 Min │ │
│ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ ❄️ AC/App │ │ 🔒 Lock  │ │ 🎨 Paint │ │
│ │ ₹199 Min │ │ ₹149 Min │ │ ₹249 Min │ │
│ └──────────┘ └──────────┘ └──────────┘ │
├────────────────────────────────────────┤
│ 🟢 ACTIVE DISPATCH IN PROGRESS         │
│ STH-8421 • Rahul Kumar (4.9★) arriving │
│ [ Track Live Technician & View PIN ➜ ] │
└────────────────────────────────────────┘
```

### Screen 2: Real-Time Radar Sweep & Provider Matching
```
┌────────────────────────────────────────┐
│ 📡 MATCHING LOCAL TECHNICIANS...       │
│                                        │
│               .  *  .                  │
│           *   ( ( ⚡ ) )  *             │
│        .   Scanning 2.5 km   .         │
│               '  *  '                  │
│                                        │
│ Fastest Responder: Rahul Kumar (2.1 km)│
│ Vehicle: KA-03-EM-4821 (TVS King Van)  │
│ ETA: ~11 Minutes • Trust Score: 98%    │
│                                        │
│ [ Dispatching Master Electrician... ]  │
└────────────────────────────────────────┘
```

### Screen 3: Live Route HUD & 4-Digit Doorstep Arrival PIN
```
┌────────────────────────────────────────┐
│ 🗺️ LIVE DISPATCH HUD (Indiranagar)     │
│ ────────────────────────────────────── │
│ 🟡 Rahul Kumar is 450m away            │
│ Vehicle: KA-03-EM-4821 • ETA: 3 Mins   │
├────────────────────────────────────────┤
│ 🔐 DOORSTEP ARRIVAL HANDSHAKE PIN      │
│                                        │
│              [ 4  8  2  1 ]            │
│                                        │
│ Give this code to technician ONLY when │
│ they arrive at your door to start work.│
├────────────────────────────────────────┤
│ ⏱️ 5-STAGE MILESTONE TRACKER           │
│  [✓] Dispatched  (10:42 AM)            │
│  [✓] En Route    (10:44 AM)            │
│  [●] At Doorstep (Verifying PIN)       │
│  [ ] In Progress                       │
│  [ ] Resolved & Cash Paid              │
└────────────────────────────────────────┘
```

### Screen 4: Technician Radar & Urgent Broadcast Alert
```
┌────────────────────────────────────────┐
│ ⚡ URGENT DISPATCH BROADCAST (Indiranagar│
│ Time to Accept: [████████░░] 16s left  │
├────────────────────────────────────────┤
│ Customer: Priya M. • 42, 12th Main Rd  │
│ Fault: Sparking MCB & Fan Regulator    │
│ Distance: 1.4 km • Est. Transit: 7 min │
├────────────────────────────────────────┤
│ 💵 GUARANTEED PAYOUT ESTIMATE          │
│ Total Billable Labor:       ₹279       │
│ Van Spare Parts:            ₹140       │
│ SATTHI Platform Comm.:      ₹0 (0%)    │
│ Net Payout to Bank:         ₹399       │
├────────────────────────────────────────┤
│ [ ✕ Decline ]     [ ✓ ACCEPT DISPATCH ]│
└────────────────────────────────────────┘
```

### Screen 5: Cash-on-Doorstep Handshake & Completion Modal
```
┌────────────────────────────────────────┐
│ 💵 CASH COLLECTION & JOB COMPLETION    │
├────────────────────────────────────────┤
│ Service Order: STH-8421                │
│ Customer: Priya M.                     │
│ Total Cash to Collect: ₹433            │
│ (Diagnostic ₹99 + Labor ₹180 + Part ₹140 + ₹14)
├────────────────────────────────────────┤
│ Ask customer for 4-digit Completion PIN│
│ Customer Completion PIN:               │
│               [ 7  1  3  0 ]           │
│                                        │
│ [ ⚡ Auto-Fill PIN (Demo Sandbox) ]     │
├────────────────────────────────────────┤
│ [ ✓ Confirm Cash Collected & Finish ]  │
└────────────────────────────────────────┘
```

---

## 🛠️ Core Feature Breakdown

### For Customers (Residents)
| Feature | Implementation | Description |
| :--- | :--- | :--- |
| **Emergency One-Tap SOS** | `CustomerHome.tsx` | Instantly broadcasts an urgent alert to all active pros in the neighborhood hexagon. |
| **Dual View Catalog** | `CategoryDetails.tsx` | Switch seamlessly between an itemized card list and a geographic map overlay with live pin locations. |
| **Instant Diagnostic Form** | `RequestForm.tsx` | Select fault chips, write custom instructions, attach inspection photos, and review upfront fee lock. |
| **Radar Broadcast Visualizer** | `MatchingRadar.tsx` | Real-time SVG radar sweep animating nearby candidate dispatch and auto-progression. |
| **Live Route & PIN Card** | `LiveTracking.tsx` | Simulated turn-by-turn route tracking, 5-stage milestone checklist, and bold arrival handshake PIN. |
| **Digital GST Receipt** | `ServiceInvoice.tsx` | Full cost breakdown, before/after proof images, interactive 5-star rating, and printable PDF invoice modal. |
| **Activity Archive & Re-Book** | `ActivityHistory.tsx` | Historical log of completed jobs with one-click re-booking of trusted past providers. |
| **Operations Help Desk** | `HelpSupportModal.tsx` | Localized FAQs, 30-day warranty rework claim submission, and simulated WhatsApp/call hotlines. |

### For Providers (Technicians)
| Feature | Implementation | Description |
| :--- | :--- | :--- |
| **Duty Toggle HUD** | `ProviderDashboard.tsx` | Switch status between `Online`, `On Job`, and `Resting` with real-time Firestore sync. |
| **24-Second Urgent Radar** | `ProviderJobsBroadcast.tsx` | Digital countdown gauge, route preview, audio quote playback, and guaranteed net payout forecast. |
| **Turn-by-Turn Navigation** | `ProviderActiveJob.tsx` | Tactical GPS HUD, doorstep landmark notes, direct resident call relay, and customer arrival trigger. |
| **Doorstep Handshake Validator** | `ProviderActiveJob.tsx` | Dedicated input verification for customer Arrival and Completion PINs before state transition. |
| **Mobile Van Inventory** | `ProviderActiveJob.tsx` | Add spares directly from digital van stock (MCBs, pipes, valves, locks) to update total dynamically. |
| **Instant IMPS Cashout Sandbox** | `ProviderEarningsView.tsx` | Weekly earnings bar metrics, today's gross/net settlement summary, and single-tap bank cashout simulation. |
| **Professional Credentials** | `ProviderProfileView.tsx` | ITI trade certifications, police verification badges, customer satisfaction metrics, and demo controls. |

---

## 🤝 The Zero-Trust Doorstep Handshake Protocol

SATTHI addresses the core vulnerability of unorganized home services—**mistrust at the door**—using a dual cryptographic handshake:

```
    RESIDENT (CUSTOMER)                       TECHNICIAN (PROVIDER)
         │                                               │
         │  1. Books Service (Generates Arrival PIN)     │
         │──────────────────────────────────────────────►│
         │                                               │
         │  2. Technician En Route & Rings Doorbell      │
         │◄──────────────────────────────────────────────│
         │                                               │
         │  3. Resident verbally reveals Arrival PIN     │
         │───── "My code is 4821" ──────────────────────►│
         │                                               │
         │  4. Technician enters PIN to unlock tools     │
         │     (State changes to IN_PROGRESS on Cloud)   │
         │                                               │
         │  5. Work performed; parts added from van      │
         │                                               │
         │  6. Total ₹433 displayed on resident screen   │
         │     with Completion PIN (7130)                │
         │                                               │
         │  7. Resident hands over ₹433 Cash + PIN       │
         │───── "Here is ₹450 cash, code is 7130" ──────►│
         │                                               │
         │  8. Technician enters PIN & confirms cash     │
         │     (State locks to COMPLETED & PAID)         │
         │                                               │
         ▼                                               ▼
   [Instant GST Receipt]                        [Instant Bank Credit]
```

1. **Step 1 (Arrival Handshake)**: Protects the resident from impostors. The technician cannot clock in, unlock their billing timer, or claim travel allowance until the customer confirms their arrival code.
2. **Step 2 (Completion & Cash Handshake)**: Protects the technician from unpaid labor and protects the resident from premature job closure. The technician enters the completion code only after physically holding the cash in hand.

---

## 👥 Dual Persona Architecture (Customer ⇄ Provider)

SATTHI provides a unified dual-sided marketplace within a single codebase. Switch roles instantly via the floating pill button on the bottom right:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROLE SWITCHER TOGGLE                            │
│                                                                        │
│   [ 👤 Customer: Priya M. ]   ⇄   [ ⚡ Pro: Rahul Kumar (Master) ]     │
│                                                                        │
│   * State synchronized bidirectionally via Firebase Firestore          │
│   * Try opening in two side-by-side browser windows for live demo!     │
└────────────────────────────────────────────────────────────────────────┘
```

| Dimension | Customer Persona (`Priya M.`) | Provider Persona (`Rahul Kumar`) |
| :--- | :--- | :--- |
| **Primary Need** | Emergency repair, upfront pricing, safety | Steady local jobs, zero commission, fast pay |
| **Default Location** | Indiranagar, Bengaluru | Indiranagar Mobile Van Cluster |
| **Active Screen Deck** | Home, Category, Radar, Tracking, Invoice | Dashboard, Broadcast Radar, Job HUD, Earnings |
| **Realtime Triggers** | Creates dispatch, monitors ETA, gives PINs | Receives broadcast, accepts job, validates PINs |

---

## 🏙️ Multi-City & Hyperlocal Clustering Engine

Configured in `/src/config/cityConfig.ts`, SATTHI operates across India's three highest-density tech and commercial hubs with hyper-local awareness:

### 1. Bengaluru (Karnataka) — *Silicon Valley Hub*
* **Emergency Grid Utility**: BESCOM Helpline (`1912`)
* **Trade Regulator**: Karnataka Electrical Inspectorate & PWD
* **Highways & Corridors**: Outer Ring Road, 100ft Indiranagar, Koramangala Sony World
* **Active Neighborhood Clusters**:
  * `Indiranagar Hub`: 14 active pros, ~14 min avg ETA
  * `Koramangala 4th Block`: 18 active pros, ~12 min avg ETA
  * `HSR Layout (Sectors 1-7)`: 11 active pros, ~16 min avg ETA
  * `Domlur / Old Airport Rd`: 9 active pros, ~18 min avg ETA

### 2. Mumbai (Maharashtra) — *Financial Capital*
* **Emergency Grid Utility**: Adani Electricity / BEST Helpline (`1912`)
* **Trade Regulator**: Maharashtra Energy Development Agency & PWD
* **Active Neighborhood Clusters**:
  * `Bandra West / Linking Rd`: 16 active pros, ~13 min avg ETA
  * `Andheri West / Lokhandwala`: 22 active pros, ~15 min avg ETA
  * `Powai / Hiranandani`: 12 active pros, ~17 min avg ETA

### 3. Delhi NCR (National Capital Region)
* **Emergency Grid Utility**: BSES Yamuna / Rajdhani Helpline (`19122`)
* **Trade Regulator**: Delhi PWD & Labour Department
* **Active Neighborhood Clusters**:
  * `Connaught Place / Central`: 15 active pros, ~12 min avg ETA
  * `Saket / South Delhi`: 19 active pros, ~16 min avg ETA
  * `Cyber City / Gurugram`: 14 active pros, ~14 min avg ETA

---

## 🏗️ Technical Architecture & State Management

SATTHI combines modern client-side React architecture with real-time cloud persistence:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION RUNTIME                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [ React 19 Frontend Components ]       [ Virtual Screen Router ]          │
│    • Customer Views (Home, Radar, etc.)    • Declarative Screen State       │
│    • Provider Views (HUD, Cashout, etc.)   • Zero page reloads              │
│                                                                             │
│                                  │                                          │
│                                  ▼                                          │
│                                                                             │
│   [ React Context State Engine (`AppContext.tsx`) ]                         │
│    • Active Request & Lifecycle State Machine                               │
│    • Cash Handshake & PIN Validation Logic                                  │
│    • Dynamic Multi-City Config & Proximity Calculator                       │
│                                                                             │
│                 │                                   │                       │
│                 ▼                                   ▼                       │
│                                                                             │
│   [ Realtime Cloud Persistence ]          [ Decoupled Simulation Layer ]     │
│    • Firebase Firestore SDK (`v13`)         • `simulationService.ts`        │
│    • Bidirectional `onSnapshot` Sync        • Masked VoIP & Voice Relays    │
│    • Attribute-Based Security Rules         • WhatsApp Milestone Webhooks   │
│    • ABAC Schema Validation                 • Bank IMPS Sandbox Cashouts    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Choices
1. **Virtual Routing Over Heavy Routers**: Uses an in-memory virtual router (`AppContext.currentScreen`) with deep-link state preservation, ensuring zero latency screen transitions on mobile viewports.
2. **Tailwind CSS v4 `@theme` Engine**: Built entirely with modern CSS custom property tokens (`--color-primary`, `--color-surface-container-high`, etc.), completely eliminating traditional `.css` file clutter.
3. **Reactive Firestore Database**: Utilizes Firestore snapshot listeners on `/dispatches/{id}`. When the customer books a job, it pops up on the technician's radar within ~200ms.
4. **Resilient Offline Fallback**: Even without network connectivity, the app leverages deterministic simulation engines with local storage persistence to showcase the complete workflow.

---

## 📈 Development Journey: What Was Built vs. What's Next

```
  Phase 1        Phase 2        Phase 3        Phase 4        Phase 5        Phase 6
 [Scaffold] ──► [Personas] ──► [Cities]  ──► [Security] ──► [Firebase] ──► [Live Prod]
  ✓ React 19     ✓ Customer    ✓ Bangalore    ✓ Honest Sim   ✓ Cloud DB     ⏳ Gateway
  ✓ Vite 8       ✓ Provider    ✓ Mumbai       ✓ Safe Docs    ✓ Handshake    ⏳ Aadhaar
  ✓ Types        ✓ Dual HUD    ✓ Delhi        ✓ No Fake Tax  ✓ Realtime     ⏳ WhatsApp
```

### ✅ What Has Been Completed & Shipped
* **Dual-Persona Switcher**: Seamless switching between Resident (`Priya M.`) and Master Technician (`Rahul Kumar`).
* **Multi-City & Locality Clustering**: Real neighborhood nodes with Haversine distance calculations and local utility grid mappings.
* **Complete Customer Journey**: Fault diagnosis form, radar dispatch sweep, live satellite route simulation, 5-stage milestone tracker, and itemized receipt.
* **Complete Provider Journey**: Duty status toggle, 24-second urgent job broadcast, turn-by-turn navigation HUD, van stock parts manager, and IMPS settlement sandbox.
* **Full Firebase Firestore Integration**: Cloud database provisioning with ABAC security rules (`firestore.rules`) and intermediate schema (`firebase-blueprint.json`).
* **Dual Handshake PIN Validation**: Real-time arrival code verification and doorstep cash collection handshake.
* **Production Build Hygiene**: Zero TypeScript errors (`tsc --noEmit`), passing Vite production build, strict Tailwind v4 theme tokens.

---

## 🔮 Future Production Roadmap

| Phase | Milestone | Target Deliverable |
| :--- | :--- | :--- |
| **Phase 6** | **Live Payment Gateways** | Integration of live Razorpay/Cashfree APIs for dynamic UPI QR generation at the doorstep alongside cash. |
| **Phase 7** | **Aadhaar & DigiLocker KYC** | Real-time government identity verification for technicians using UIDAI offline XML and DigiLocker trade diplomas. |
| **Phase 8** | **Telephony & WhatsApp Relays** | Number masking via Exotel/Twilio voice proxy and automated WhatsApp notification webhooks via Meta Cloud API. |
| **Phase 9** | **PWA & Offline Navigation** | Service worker caching, Web App Manifest, home screen install prompt, and offline-first field synchronization. |
| **Phase 10**| **Multilingual Voice AI** | Speech-to-text diagnostics supporting Hindi, Kannada, Marathi, and Tamil for technician accessibility. |

---

## 💻 Getting Started & Local Execution Guide

### Prerequisites
* **Node.js**: `v20.x` or higher
* **npm**: `v10.x` or higher (or `bun` / `pnpm`)
* **Modern Web Browser**: Chrome, Edge, Safari, or Firefox

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/satthi-services.git
   cd satthi-services
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Verify TypeScript compilation**:
   ```bash
   npm run lint
   ```

4. **Launch the local development server**:
   ```bash
   npm run dev
   ```
   *The development server will mount on `http://localhost:3000`.*

5. **Build for production**:
   ```bash
   npm run build
   ```
   *The optimized static assets will be output to `/dist`.*

---

## ☁️ Deploying to Vercel

SATTHI is pre-configured for one-click deployment on [Vercel](https://vercel.com):

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. **Import the repository into Vercel**:
   * **Framework Preset**: `Vite` (automatically detected via `vercel.json`)
   * **Root Directory**: `./`
   * **Build Command**: `vite build` (or `npm run build`)
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
3. **Configuration files included**:
   * `vercel.json`: Handles SPA rewrites (`/(.*) -> /index.html`) so refreshing on any route works seamlessly.
   * `.npmrc`: Configures `legacy-peer-deps=true` and `engine-strict=false` to prevent dependency resolution conflicts across Node versions.
4. **Click Deploy**: Your live deployment will build and go live in seconds!

---

## 🧪 Testing Live Real-Time Multi-Device Sync

To experience the real-time two-way synchronization powered by Firebase Firestore:

1. Open `http://localhost:3000` in **Window A** (e.g., standard browser window).
2. Open `http://localhost:3000` in **Window B** (e.g., an Incognito window or separate browser).
3. In **Window A**, stay in **Customer Mode** (`Priya M.`).
4. In **Window B**, click the floating pill at bottom-right and switch to **Provider Mode** (`Rahul Kumar`). Make sure duty status is set to **Active / On Duty**.
5. In **Window A**, navigate to *Electrician*, click *Book Emergency Electrician*, and click *Confirm & Search Nearby Electricians*.
6. Watch **Window B** instantly trigger the urgent job broadcast ticker with audio alert and 24s countdown!
7. Accept the job in **Window B**; watch **Window A** automatically transition to *Live Tracking* showing Rahul Kumar's ETA and the **Arrival PIN (4821)**.
8. In **Window B**, click *Simulate Doorstep Arrival*, enter the customer's PIN `4821`, and click *Verify PIN & Start Work*.
9. In **Window B**, add a spare part (e.g., *Schneider 32A MCB*), click *Complete Job & Collect Cash*, and enter the customer's completion PIN `7130`.
10. Watch both screens instantly finalize: the customer receives their itemized GST receipt, and the technician's dashboard updates with today's cash earnings!

---

## ⚠️ Simulation Boundary & Honest Disclaimers

In accordance with SATTHI's commitment to honest, transparent engineering:

* **Prototype Demonstration Environment**: This application is currently running in a prototype demonstration sandbox.
* **Payments & Bank Settlements**: Payment authorization via UPI, Card, or Doorstep Cash is simulated; no actual banking APIs or payment gateways are debited, and no real IMPS interbank wire transfers occur.
* **Telephony & Messaging**: Voice call buttons and WhatsApp alerts trigger simulated in-app relays; no live cellular calls or SMS gateways are invoked.
* **Receipts & Invoicing**: Invoices generated in this sandbox are titled *"Service Estimate & Receipt (Demo Simulation)"* and explicitly do not constitute registered tax invoices under Goods and Services Tax (GST) laws.
* **Emergency Grid Buttons**: Utility hotline callouts (BESCOM, Adani, BSES) simulate dialing local control centers and remind users to dial national emergency services (**112**) for genuine life-threatening emergencies.

---

## 📄 License & Ownership

Developed with pride for India's independent blue-collar artisans and urban residents.  
*SATTHI (साथी) — Empowering local skill with technology, dignity, and trust.*
