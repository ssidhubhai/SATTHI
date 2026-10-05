# QA_CHECKLIST.md

## 1. Automated Build & Typecheck Verifications

| Check | Command | Expected Result | Current Status |
| :--- | :--- | :--- | :--- |
| **TypeScript Validation** | `npm run lint` (`tsc --noEmit`) | Clean exit, 0 errors | **PASS** |
| **Vite Production Build** | `npm run build` (`vite build`) | Successful compilation to `/dist` | **PASS** |
| **Development Server** | `npm run dev` | Running on `http://localhost:3000` | **PASS** |

---

## 2. Customer Journey Smoke Tests

### Test 1: Category Navigation & Upfront Pricing
* **Steps**:
  1. Open app in Customer Mode (`currentScreen = 'home'`).
  2. Verify active cluster is Indiranagar Hub (14 active pros).
  3. Tap "Electrician" card.
  4. Ensure category details screen loads with list of technicians.
  5. Verify visit fee is ₹99 and waiver threshold is ₹300.
* **Pass Criteria**: Category details loads smoothly without console errors; pricing matches `cityConfig.ts`.

### Test 2: Request Booking & Radar Matching
* **Steps**:
  1. From `CategoryDetails.tsx`, tap "Request Technician".
  2. Select fault chip "MCB Repeatedly Tripping".
  3. Tap "Find Available Technician Near Me".
  4. Verify radar sweep initiates with "Live Broadcast" status.
  5. Tap "Simulate: Auto-Accept Order as Rahul".
* **Pass Criteria**: Radar smoothly transitions to `LiveTracking.tsx` with request status set to `ON_THE_WAY`.

### Test 3: Live Tracking & Doorstep Handshake Code
* **Steps**:
  1. Verify map route displays with driver marker at 0.4 km away.
  2. Verify 4-digit PIN is displayed with "Copy" button.
  3. Tap "Copy" button -> toast shows PIN copied.
  4. Tap "1. Arrived" in simulator bar -> status updates to `ARRIVED`.
  5. Tap "2. Verify PIN" -> status updates to `IN_PROGRESS`.
  6. Tap "3. Complete" -> status updates to `COMPLETED` and opens `ServiceInvoice.tsx`.
* **Pass Criteria**: Status progression is reactive; milestone stepper checkmarks activate in sequence.

### Test 4: Checkout, Invoicing & Payment
* **Steps**:
  1. On `ServiceInvoice.tsx`, inspect Before & After inspection shots.
  2. Select 5 stars and tip amount ₹50.
  3. Select "Instant UPI" as payment mode.
  4. Tap "View / Download Service Receipt Preview (PDF)".
  5. Verify modal displays GST sandbox disclaimer notice.
  6. Close modal and tap "Pay ₹448 (Simulated)".
* **Pass Criteria**: Payment completes with demo toast (`[Demo Sandbox] Payment simulated...`); screen redirects to `ActivityHistory.tsx` with order archived.

---

## 3. Provider Journey Smoke Tests

### Test 5: Role Switch & Duty Status Toggle
* **Steps**:
  1. Tap floating bottom-right role toggle ("Customer").
  2. Ensure screen switches to "Technician Mode" (`ProviderDashboard.tsx`).
  3. Tap "Resting / Offline" -> status pill turns gray.
  4. Tap "Active" -> status pill turns green.
* **Pass Criteria**: Duty status persists in state; role switcher reflects "Technician".

### Test 6: Incoming Dispatch Broadcast & PIN Verification
* **Steps**:
  1. From `ProviderDashboard.tsx`, tap "Jobs Broadcast Radar".
  2. Verify 24s countdown gauge runs smoothly.
  3. Tap "Accept Job (Lock Dispatch)".
  4. Verify `ProviderActiveJob.tsx` opens with customer address and turn-by-turn HUD.
  5. Tap "I'm Outside Doorstep" -> status becomes `ARRIVED`.
  6. Tap "Auto-fill PIN" -> fills 4 digits.
  7. Tap "Verify PIN & Begin Work" -> unlocks work session and spare parts manager.
* **Pass Criteria**: Pin verification triggers `IN_PROGRESS` state; spare parts drawer becomes active.

### Test 7: Van Spares & Earnings Cashout
* **Steps**:
  1. On `ProviderActiveJob.tsx`, tap "Add Spare Part".
  2. Select Havells 16A Socket (+₹140) -> verify item adds to bill.
  3. Tap "Finish Repair & Generate Service Receipt (Demo)".
  4. From dashboard, tap "Today's Completed Dispatches -> Full Statement".
  5. On `ProviderEarningsView.tsx`, tap "Withdraw (Demo)".
* **Pass Criteria**: Cashout fires `simulationService.simulateBankCashout()`, showing a simulated IMPS reference code in toast.

---

## 4. Multi-City & Cluster Switching Tests

### Test 8: City Switching Verification
* **Steps**:
  1. Tap top header location badge -> opens `LocationDrawer.tsx`.
  2. Select **Mumbai** -> select cluster **Bandra West**.
  3. Verify local utility changes to Adani Electricity (`1912` Helpline).
  4. Select **Delhi NCR** -> select cluster **Connaught Place**.
  5. Verify local utility changes to BSES (`19122` Helpline).
  6. Re-select **Bengaluru** -> Indiranagar Hub.
* **Pass Criteria**: Local emergency SOS label, utility helpline, and clusters dynamically update throughout the app.

---

## 5. Honest Simulation & Anti-Deception Verifications

* [x] **No Fake Payment Confirmation**: All payments display `[Demo Sandbox]` and explicitly declare no actual money was charged.
* [x] **No Fake Tax Invoice**: All documents are titled "Service Estimate & Receipt (Demo Simulation)" and feature an explicit GST disclaimer that no tax filing occurred.
* [x] **No Fake Police/Govt Verification**: Profile badges state "Demo Screening: Mock ID & Skill Checked", disclaiming official UIDAI or police database connections.
* [x] **No Fake Telecom Calls**: Phone buttons trigger `[Demo Voice Relay]` toasts clarifying no live phone call was dialed.
* [x] **No Fake Emergency Dispatch**: SOS triggers clearly state they are demo dialers and instruct calling 112 for real emergencies.
