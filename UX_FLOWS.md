# UX_FLOWS.md

## 1. Journey Overview
SATTHI features two interconnected user journeys:
1. **Customer Journey**: Discover, diagnose, request, match, track, verify at doorstep, inspect invoice, pay, and review.
2. **Provider Journey**: Manage duty status, receive broadcast dispatch, review route, navigate to doorstep, verify customer PIN, record spare parts, finalize bill, and withdraw earnings.

---

## 2. Customer Journey Step-by-Step

### Stage 1: Landing & Discovery
* **Component**: `CustomerHome.tsx` (`currentScreen = 'home'`)
* **User Actions**:
  * Tap location badge in header -> opens `LocationDrawer.tsx` to switch city (Bengaluru / Mumbai / Delhi) or neighborhood cluster.
  * Enter text in search input -> filters categories and technicians in real time.
  * Tap emergency banner (*"Power outage / Water leakage?"*) -> navigates directly to `RequestForm.tsx`.
  * Tap category card (Electrician, Plumber, Carpenter, Appliance) -> navigates to `CategoryDetails.tsx`.
  * Tap a nearby technician card -> navigates to `ProviderProfile.tsx`.

### Stage 2: Category Exploration & Provider Selection
* **Component**: `CategoryDetails.tsx` (`currentScreen = 'category-details'`)
* **User Actions**:
  * Toggle between "List View" and "Full Map" view.
  * Filter technicians by "Available Right Now" or "Govt ID Verified".
  * Tap "Request Technician" on a card -> navigates to `RequestForm.tsx` with preselected provider ID.
  * Tap "View Profile & Rates" -> opens `ProviderProfile.tsx`.

### Stage 3: Request & Diagnostic Triage
* **Component**: `RequestForm.tsx` (`currentScreen = 'request-form'`)
* **User Actions**:
  * Select fault chip (e.g., *"Short Circuit / Blackout"*, *"MCB Repeatedly Tripping"*).
  * Type issue narrative in textarea.
  * Tap "Tap to Attach Photo / Video" -> toggles inspection evidence attachment.
  * Select urgency ("Right Now" vs. "Schedule Later").
  * Review upfront fee lock (Standard visit fee ₹99 waived if repair > ₹300).
  * Tap **"Find Available Technician Near Me"** -> calls `createServiceRequest()`, sets request to `SEARCHING`, and navigates to `MatchingRadar.tsx`.

### Stage 4: Radar Polling & Match Dispatch
* **Component**: `MatchingRadar.tsx` (`currentScreen = 'matching-radar'`)
* **User Actions**:
  * Watches animated radar sweep polling nearby certified pros within search radius (2.5 km).
  * Views fastest responder card (e.g., Rahul Kumar, ~12 mins arrival).
  * Tap "Simulate: Auto-Accept Order as Rahul" (demo helper) -> calls `acceptRequestAsProvider()`, transitions status to `ON_THE_WAY`, and navigates to `LiveTracking.tsx`.
  * Tap "Cancel Request" -> invokes `cancelActiveRequest()`.

### Stage 5: Live Dispatch Tracking & Doorstep Handshake PIN
* **Component**: `LiveTracking.tsx` (`currentScreen = 'live-tracking'`)
* **User Actions**:
  * Observes driver vehicle marker advancing along route on map.
  * Notes 4-digit arrival handshake PIN (e.g., `4821`), with one-tap copy button.
  * Receives milestone progress updates across 5 stages:
    1. Request Broadcasted
    2. Rahul Accepted Order
    3. Rahul En Route (~6m ETA)
    4. Arrival & Doorstep PIN Verification
    5. Diagnostic, Repair & Itemized Bill
  * Taps call button -> displays simulated encrypted voice relay toast.
  * Taps chat button -> displays simulated masked chat preview toast.
  * Uses Testing Simulator bar (`1. Arrived`, `2. Verify PIN`, `3. Complete`) to advance lifecycle.
  * Upon job completion, taps **"View Service Receipt & Summary (Demo)"** -> navigates to `ServiceInvoice.tsx`.

### Stage 6: Service Receipt, Rating & Checkout
* **Component**: `ServiceInvoice.tsx` (`currentScreen = 'service-invoice'`)
* **User Actions**:
  * Inspects Before and After visual photo evidence (burned MCB vs. replaced Schneider MCB).
  * Reviews itemized tariff breakdown (Inspection waived, MCB labor ₹220, Schneider MCB ₹210, Safety Fee ₹15, Discount -₹15, GST ₹3).
  * Selects 1 to 5 star rating and feedback tag chips.
  * Selects technician appreciation tip (₹30, ₹50, ₹100, or Custom).
  * Chooses payment method (Instant UPI, Cash, Card).
  * Taps "View / Download Service Receipt Preview (PDF)" -> opens modal with GST disclaimer.
  * Taps **"Pay ₹448 (Simulated)"** -> calls `submitInvoicePayment()`, saves order to `pastRequests`, shows success toast, and navigates to `ActivityHistory.tsx`.

### Stage 7: Activity History & Repeat Re-Booking
* **Component**: `ActivityHistory.tsx` (`currentScreen = 'activity-history'`)
* **User Actions**:
  * Views completed service history with order numbers, timestamps, and net totals.
  * Taps "Receipt (Demo)" -> re-opens service receipt preview.
  * Taps "Re-Book" -> preselects technician and opens `RequestForm.tsx`.
  * Taps "Operations Desk" -> navigates to `HelpSupportModal.tsx`.

---

## 3. Provider (Technician) Journey Step-by-Step

### Stage 1: Technician Home & Duty Status
* **Component**: `ProviderDashboard.tsx` (`currentScreen = 'provider-dashboard'`)
* **User Actions**:
  * Toggles duty status between "Active", "On Job", and "Resting".
  * Reviews today's gross collected earnings and completed job count.
  * Taps "Cashout (Demo)" -> calls `simulationService.simulateBankCashout()`.
  * If active request exists, taps "Open Active Job Navigation" -> opens `ProviderActiveJob.tsx`.
  * Taps "Jobs Broadcast Radar" -> navigates to `ProviderJobsBroadcast.tsx`.

### Stage 2: Emergency Broadcast Acceptance
* **Component**: `ProviderJobsBroadcast.tsx` (`currentScreen = 'provider-jobs'`)
* **User Actions**:
  * 24-second digital countdown timer ticks down with chime indicator.
  * Reviews emergency fault description, customer landmark, and travel time (6–8 mins).
  * Reviews guaranteed payout banner (₹220–₹450 + tips, ₹99 base visit locked).
  * Taps **"Accept Job (Lock Dispatch)"** -> calls `acceptRequestAsProvider()`, transitions status to `ON_THE_WAY`, and navigates to `ProviderActiveJob.tsx`.
  * Taps "Pass Job" -> returns to dashboard.

### Stage 3: Navigation & Doorstep PIN Verification
* **Component**: `ProviderActiveJob.tsx` (`currentScreen = 'provider-active-job'`)
* **User Actions**:
  * Reviews turn-by-turn route direction ("In 150m Turn Right onto 12th Main Road").
  * Taps "GPS HUD" -> opens Turn-by-Turn GPS HUD simulation modal.
  * Taps call button -> dials resident via encrypted private line.
  * Reaches doorstep -> taps "I'm Outside Doorstep" (status -> `ARRIVED`).
  * Enters customer's 4-digit PIN in the input boxes (or taps "Auto-fill PIN" demo helper).
  * Taps **"Verify PIN & Begin Work"** -> calls `verifyDoorstepPin()`, unlocks tools, and transitions status to `IN_PROGRESS`.

### Stage 4: Parts Management & Job Finalization
* **Component**: `ProviderActiveJob.tsx` (`currentScreen = 'provider-active-job'`)
* **User Actions**:
  * Taps "Add Spare Part" -> opens authorized van stock drawer.
  * Selects spare parts approved by resident (e.g., Havells Socket, Anchor Switch).
  * Taps **"Finish Repair & Generate Service Receipt (Demo)"** -> calls `completeServiceJob()`, adds earnings to provider state, and transitions status to `COMPLETED`.

### Stage 5: Settlement & Earnings Wallet
* **Component**: `ProviderEarningsView.tsx` (`currentScreen = 'provider-earnings'`)
* **User Actions**:
  * Reviews weekly performance bar chart (Monday through Sunday).
  * Views today's net direct balance to bank (HDFC Bank ••4091).
  * Taps **"Withdraw (Demo)"** -> calls `simulationService.simulateBankCashout()`, generating a simulated IMPS reference ID and toast alert.
