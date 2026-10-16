# SATTHI (साथी) — Production Real-Time Dispatch & Cash Handshake Architecture

A production-grade hyper-local home emergency and technician dispatch platform connecting Indian residents with verified local electricians, plumbers, carpenters, and appliance mechanics, powered by real-time Firebase Firestore synchronization and a zero-trust cash-on-doorstep OTP handshake protocol.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction below incorporates all preferences confirmed during Phase 1 clarification:
> - **Backend & Persistence**: Real-time Firebase Firestore database with live reactive document subscriptions (`onSnapshot`), robust security rules, and user/provider profile separation.
> - **Dispatch Coordination**: Real-time two-way synchronization between customer order placement, provider radar broadcast queues, active job locks, and live tracking telemetry.
> - **Settlement & Billing**: Doorstep cash collection backed by a two-stage OTP handshake (4-digit Arrival PIN + 4-digit Job Completion PIN) and itemized GST digital service receipts.

- **Confirmed Decision 1 (Real-Time Cloud Backend)**: Transition from in-memory / local storage state to live Firebase Firestore collections (`dispatches`, `providers`, `users`).
- **Confirmed Decision 2 (Cross-Persona State Sync)**: Simultaneous two-way state propagation across Customer and Technician views, so dispatch status changes made by one persona update the other instantly.
- **Confirmed Decision 3 (Doorstep Cash & OTP Security)**: Prevent disputed jobs or cash mishandling by locking work authorization behind an Arrival Handshake PIN, and invoice sign-off behind a Completion Handshake PIN.

---

## 1. Overview & Core Concept

- **What It Does**: SATTHI provides rapid under-30-minute hyper-local dispatches for residential utilities and emergency breakdowns across Bengaluru, Mumbai, and Delhi NCR. Customers book diagnosed faults with upfront visit tariffs; nearby technicians receive broadcast alerts, navigate to the site, verify door access via arrival OTP, log installed van spare parts, collect cash payment, and close the job with a completion OTP.
- **Target Audience / Personas**:
  - *Residents / Homemakers / Tenants*: Require verified, transparently priced technicians in emergency breakdown situations (tripped MCBs, pipe bursts, lock jams) without price gouging.
  - *Independent Skilled Tradespeople (Sathis)*: Seek immediate neighborhood emergency dispatches, transparent payout calculations, instant doorstep cash realization, and verifiable track records.
- **Key Value**: Replaces opaque local phone directories with deterministic, real-time dispatch queues, tamper-proof OTP handshakes, and transparent multi-city rate cards.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Customer Request & Diagnostics Flow**:
   - Customer selects service category (Electrical, Plumbing, Carpentry, Appliances) and city cluster (e.g., Indiranagar, Bandra West, Connaught Place).
   - Selects specific fault chips (e.g., "Tripped MCB", "Sparking Socket"), attaches fault details, and locks in the city-standard visit tariff.
   - Live matching radar broadcasts the ticket to active providers in the local corridor.
2. **Provider Broadcast & Acceptance Flow**:
   - Nearby on-duty technicians receive a real-time dispatch ticker with a 24-second acceptance gauge, guaranteed payout breakdown, and distance ETA.
   - First accepting technician secures the job lock; Firestore updates the dispatch status to `ACCEPTED` and transitions the customer screen to live tracking.
3. **Arrival & Doorstep Handshake Flow**:
   - Technician navigates to doorstep and requests customer's 4-digit Arrival PIN.
   - Customer shares PIN; technician validates it in the Navigation HUD. Status moves to `IN_PROGRESS`.
4. **Repairs, Van Spares & Cash Handshake Flow**:
   - Technician performs work and adds installed van stock spare parts (with verified rate-card pricing).
   - System calculates itemized labor + spare parts + GST total.
   - Customer hands over cash; technician enters the 4-digit Completion PIN generated on the customer's phone to verify receipt of payment.
   - Status transitions to `COMPLETED`; both parties view and download the official itemized service receipt.

### Visual Identity & Theme

- **Aesthetic Direction**: High-trust Indian utility & emergency dispatch interface — utilitarian, crisp, and tactile. Avoids generic AI pastel cards and empty gradients.
- **Color Palette (Tailwind Tokens)**:
  - *Canvas*: Soft daylight warm gray (`bg-[#F9FAFB]`, dark: `bg-[#0F172A]`).
  - *Surfaces*: Pure crisp white (`bg-white`, dark: `bg-[#1E293B]`) with subtle hairline dividers (`border-slate-200`, dark: `border-slate-800`).
  - *Primary Action*: Deep emergency amber/navy (`text-[#0F172A]`, `bg-[#F59E0B]` for emergency triggers, `bg-[#1E3A8A]` for primary dispatches).
  - *Success / Cash Collected*: Crisp emerald (`text-emerald-700`, `bg-emerald-50`, `border-emerald-200`).
- **Typography & Hierarchy**:
  - *Headlines & Display*: **Plus Jakarta Sans** (SemiBold / Bold 600–700) with `text-wrap: balance`.
  - *Body Prose*: **Plus Jakarta Sans** (400 / 500), 15px–16px, 1.5 line height.
  - *Pricing, Timers & PINs*: **JetBrains Mono** or `font-mono tabular-nums` for all INR amounts, OTP PINs, countdown gauges, and distance metrics.
- **Anti-Slop Discipline**:
  - Zero static pill enclosures: metadata rendered as unboxed text separated by quiet `·` dots.
  - No decorative pulsing green dots or pseudo-technical `//` headers.
  - Minimum 44px touch targets on all mobile interactive affordances.
  - Sticky mobile chrome capped at under 15% of viewport height.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real-Time Firestore Synchronization vs Client In-Memory State**:
  - *Chosen Approach*: Firestore collection `/dispatches` with snapshot listeners (`onSnapshot`) on both Customer and Provider clients.
  - *Why*: Enables genuine multi-window/multi-device coordination. An acceptance or status update in one tab or role immediately triggers reactive state transitions in the other.
  - *Alternatives Considered*: Polling REST endpoints (inefficient and introduces latency) or WebSocket custom servers (unnecessary maintenance overhead compared to Firestore).
- **Decision 2: Doorstep Cash Handshake with Dual-PIN Protocol**:
  - *Chosen Approach*: Generate distinct 4-digit Arrival PIN and 4-digit Completion PIN stored securely on the dispatch document.
  - *Why*: Eliminates false "no show" disputes and prevents unauthorized job closure before cash is verified. The customer holds the PIN until work and cash settlement are completed.
  - *Alternatives Considered*: Unvalidated cash checkmarks (prone to customer/provider disputes).
- **Decision 3: Multi-City Pricing Rules & Van Stock Synchronization**:
  - *Chosen Approach*: Preserve the multi-city matrix (`cityConfig.ts`) while persisting dynamic dispatch line items (base visit fee + diagnosed labor + added spare parts) to Firestore documents.
  - *Why*: Keeps city-level regulatory compliance (BESCOM/Adani/BSES tariffs, state taxes) predictable and transparent.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SATTHI CLIENT APPLICATION                         │
├──────────────────────────────────────┬──────────────────────────────────────┤
│            CUSTOMER FLOW             │            PROVIDER FLOW             │
│  - CustomerHome & CategoryDetails    │  - ProviderDashboard & Duty Toggle   │
│  - RequestForm (Diagnostics & Slot)  │  - ProviderJobsBroadcast (Radar HUD) │
│  - MatchingRadar & Dispatch Trigger  │  - ProviderActiveJob (Navigation)    │
│  - LiveTracking (Arrival PIN Display)│  - Doorstep PIN Verification HUD     │
│  - ServiceInvoice (Completion PIN)   │  - Van Stock Spare Parts Selector    │
│  - ActivityHistory & PDF Receipt     │  - Earnings & Cashout Summary        │
└──────────────────┬───────────────────┴──────────────────┬───────────────────┘
                   │                                      │
                   ▼                                      ▼
         ┌──────────────────────────────────────────────────────────┐
         │             AppContext / Firebase Data Provider          │
         │  - Real-time onSnapshot listeners for active dispatches  │
         │  - Atomic status transitions (DISPATCHED->ACCEPTED->...) │
         │  - Role switching context with persistent user IDs       │
         └──────────────────────────┬───────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FIREBASE FIRESTORE DATA LAYER                         │
│                                                                             │
│  /dispatches/{dispatchId}                                                   │
│   ├── customerId, providerId, cityId, category, clusterId                   │
│   ├── status: 'DISPATCHED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED'       │
│   ├── arrivalPin: '4829', completionPin: '7130'                             │
│   ├── pricing: { baseFee, laborFee, partsTotal, gst, totalAmount }          │
│   ├── lineItems: [ { id, title, type, cost } ]                              │
│   └── payment: { mode: 'CASH', status: 'COLLECTED', collectedAt }           │
│                                                                             │
│  /providers/{providerId}                                                    │
│   ├── name, phone, category, rating, isOnline, currentCluster, bankInfo      │
│                                                                             │
│  /users/{userId}                                                            │
│   ├── name, phone, defaultCity, defaultAddress                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Schema & Entities (`firebase-blueprint.json`)

1. **Entity `dispatch`**:
   - `id` (string, max 128)
   - `customerId` (string, required)
   - `customerName` (string, required)
   - `customerPhone` (string, required)
   - `address` (string, required)
   - `cityId` (string, enum: `bengaluru`, `mumbai`, `delhi`)
   - `clusterId` (string, required)
   - `category` (string, enum: `electrical`, `plumbing`, `carpentry`, `appliances`)
   - `faultTitle` (string, required)
   - `faultDescription` (string)
   - `status` (string, enum: `DISPATCHED`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
   - `providerId` (string, optional)
   - `providerName` (string, optional)
   - `arrivalPin` (string, pattern: `^[0-9]{4}$`)
   - `completionPin` (string, pattern: `^[0-9]{4}$`)
   - `parts` (array of spare part items)
   - `baseFee` (number)
   - `laborFee` (number)
   - `partsFee` (number)
   - `taxAmount` (number)
   - `totalAmount` (number)
   - `paymentMode` (string, enum: `CASH`, `UPI`)
   - `paymentStatus` (string, enum: `PENDING`, `COLLECTED`)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

2. **Entity `provider`**:
   - `id` (string)
   - `name` (string)
   - `category` (string)
   - `rating` (number)
   - `totalJobs` (number)
   - `isOnline` (boolean)
   - `currentCluster` (string)
   - `phone` (string)

3. **Entity `user`**:
   - `id` (string)
   - `name` (string)
   - `phone` (string)
   - `cityId` (string)
   - `address` (string)

### Security Rules Hardening (`firestore.rules`)

- **Default-Deny**: Global catch-all denying unauthorized reads/writes.
- **Master Gate & Schema Validation**:
  - `isValidDispatch(data)` helper enforcing valid IDs, status enums, 4-digit PIN patterns, and non-negative pricing numbers.
  - Action-based update guards:
    - Customer can cancel only while `DISPATCHED`.
    - Provider can claim job only if currently `DISPATCHED` by populating `providerId` and setting status to `ACCEPTED`.
    - Provider can transition to `IN_PROGRESS` only when matching `arrivalPin`.
    - Provider can transition to `COMPLETED` only when matching `completionPin` and confirming cash collection.
- **Terminal State Lock**: Once status is `COMPLETED` or `CANCELLED`, no further state modifications are permitted.

---

## 5. Execution Roadmap

1. **Step 1: Firebase Provisioning & Blueprint Initialization**:
   - Launch Firebase Provisioning UI flow (`show_aistudio_ui` / `GetFirebaseTos` / `ProvisionFirebase`).
   - Create `firebase-blueprint.json` and generate hardened `firestore.rules`.
   - Install Firebase SDK packages and configure `firebase-applet-config.json`.
2. **Step 2: Dual-Persona Context Refactoring (`AppContext.tsx`)**:
   - Connect real-time Firestore `onSnapshot` listeners for the active dispatch.
   - Implement seamless atomic mutations for `createDispatch`, `acceptDispatch`, `verifyArrivalPin`, `addVanSparePart`, and `confirmCashCompletion`.
3. **Step 3: Customer Live Tracking & PIN Handshake UI**:
   - Surface the 4-digit Arrival PIN prominently in `LiveTracking.tsx`.
   - Surface the 4-digit Completion PIN and cash payment verification state in `ServiceInvoice.tsx`.
4. **Step 4: Provider Active Job & Cash Verification HUD**:
   - Update `ProviderActiveJob.tsx` with Arrival PIN input modal and validation logic.
   - Add Cash Collection tally and Completion PIN entry modal before closing dispatch.
   - Sync added van parts directly to the Firestore document.
5. **Step 5: Testing, Linting & Build Verification**:
   - Verify TypeScript compilation and production build.
   - Validate live two-way sync across Customer and Provider roles.
