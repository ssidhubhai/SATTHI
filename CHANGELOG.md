# CHANGELOG.md

All notable changes to the **SATTHI (साथी)** codebase are documented in this file.

---

## [Phase 4: Current Checkpoint] - 2026-10-05

### Added
* Comprehensive developer handoff documentation:
  * `/AGENTS.md`: Operating guide, directory structure, rules for future agents, and Current Project Status.
  * `/PRODUCT.md`: Problem statement, value propositions, dual personas, and vertical fee structures.
  * `/ARCHITECTURE.md`: Virtual router graph, React Context state map, and decoupled simulation service.
  * `/DESIGN_SYSTEM.md`: Tailwind v4 `@theme` design tokens, typography scale, and UI patterns.
  * `/DATA_MODEL.md`: Full TypeScript entity schemas, request lifecycle state transitions.
  * `/UX_FLOWS.md`: Step-by-step customer and technician journey maps with edge cases.
  * `/QA_CHECKLIST.md`: Automated test commands, smoke test matrix, honest simulation checks.
  * `/CHANGELOG.md`: Detailed milestone history.

### Security, Realism & Honest Simulation Audit
* **Decoupled Simulation Service (`/src/services/simulationService.ts`)**:
  * Centralized all mocked external actions (Payments, IMPS Cashouts, Telephony Relays, Chat Channels, WhatsApp Webhooks, GPS Telemetry, Emergency SOS Hotlines, Doorstep Handshake, and Verification Profile Auditing).
* **Elimination of Fake Financial Claims**:
  * Clarified checkout toasts to declare `[Demo Sandbox] Payment simulated via UPI/Card/Cash (No real funds transferred)`.
  * Updated technician cashouts to declare `[Demo Payout Sandbox] Simulated cashout... (No real bank transfer occurred)`.
* **Elimination of Fake Tax Invoices**:
  * Replaced "Digital Tax Invoice" labels with "Service Receipt & Estimate (Demo Simulation)".
  * Injected explicit legal notice: *"DEMO DOCUMENT: Generated in a prototype sandbox environment for workflow demonstration. This document is not a legally registered tax invoice under GST laws. No tax liability is created or reported."*
* **Elimination of Fake Official Police/Government Certifications**:
  * Replaced "Aadhaar & Police Cleared" with "Demo Screening: Mock ID & Skill Checked".
  * Replaced "Govt. ITI Certified" with "ITI Diploma (Demo Check)".
  * Replaced "Police Background Verified" with "Demo Screening Passed".
  * Added prominent disclaimer box in provider profile clarifying badges are prototype demonstration records.
* **Emergency Hotline & Telephony Realism**:
  * Replaced "Police Assist" with "Emergency Grid Hotline (Simulated Dialer)".
  * Routed utility SOS buttons through `simulateSosHotline()`, advising users to dial 112 for real emergencies.

---

## [Phase 3: Multi-City & Hyperlocal Clustering Engine] - 2026-10-04

### Added
* **Multi-City Configuration Layer (`src/config/cityConfig.ts`)**:
  * Added full configuration sets for **Bengaluru**, **Mumbai**, and **Delhi NCR**.
  * Embedded local utility emergency providers (BESCOM, Adani Electricity, BSES).
  * Defined local trade compliance authorities and state regulatory references.
* **Hyperlocal Clustering & Distance Calculation (`src/data/dataLayer.ts`)**:
  * Implemented Haversine road distance approximation between user clusters and technician bases.
  * Added dynamic provider recalculation when changing location clusters.
  * Linked vehicle license plate prefixes to city codes (`KA`, `MH`, `DL`).
* **Location Drawer (`src/components/LocationDrawer.tsx`)**:
  * Interactive sheet allowing instant switching of active city and neighborhood clusters.

---

## [Phase 2: Dual Persona Implementation & Stitch UI Integration] - 2026-10-03

### Added
* **Provider HUD & Active Job Flow**:
  * `ProviderDashboard.tsx`: Duty toggle, earnings summary, recent dispatches.
  * `ProviderJobsBroadcast.tsx`: 24s countdown gauge, audio quote playback, urgent dispatch card.
  * `ProviderActiveJob.tsx`: Turn-by-turn directions, GPS HUD modal, 4-digit PIN verification.
  * `ProviderEarningsView.tsx`: Weekly performance bar chart, HDFC bank settlement sandbox.
  * `ProviderProfileView.tsx`: Credentials checklist, role switcher, demo reset.
* **Customer Lifecycle Expansion**:
  * `MatchingRadar.tsx`: Animated radar sweep with local technician polling.
  * `LiveTracking.tsx`: 5-stage milestone tracker, arrival PIN card, simulated map route.
  * `ServiceInvoice.tsx`: Before/after inspection evidence, itemized bill, tip selector, rating.
  * `ActivityHistory.tsx`: Completed dispatch archive and repeat re-booking.
  * `HelpSupportModal.tsx`: Dynamic FAQs and 30-day warranty claim workflow.
* **Design System Integration (`src/index.css`)**:
  * Ported Stitch theme tokens to Tailwind CSS v4 `@theme`.
  * Added custom typography utility classes for Plus Jakarta Sans.

---

## [Phase 1: Project Initialization] - 2026-10-02

### Added
* Initial project scaffold (Vite + React 19 + TypeScript).
* Mock provider seed data (`src/data/mockData.ts`).
* Initial customer browsing interface (`CustomerHome.tsx`, `CategoryDetails.tsx`).
