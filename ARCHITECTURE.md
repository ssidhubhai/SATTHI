# ARCHITECTURE.md

## 1. High-Level Technology Stack
* **Runtime / Framework**: React 19.0.1, TypeScript 7.0.2, Vite 8.3.0.
* **Styling Engine**: Tailwind CSS v4 (`@tailwindcss/vite` plugin, configured via `@theme` tokens in `/src/index.css`).
* **Icons & Fonts**: Google Fonts `Plus Jakarta Sans` and Google `Material Symbols Outlined` (loaded via CDN in `/index.html`).
* **State Management**: React Context (`AppContext.tsx`) utilizing `useState`, `useCallback`, and browser `localStorage` for cross-reload persistence.
* **Simulation Layer**: Standalone abstraction service (`src/services/simulationService.ts`) isolating mock external dependencies from UI components.

---

## 2. Virtual Routing Architecture
SATTHI avoids heavy client-side router packages (`react-router`) in favor of a fast, declarative, lightweight virtual screen router driven by `AppContext.currentScreen`.

### Screen Graph & Transitions

```
[Customer Mode]
       │
       ├── 'home' (CustomerHome)
       │      │
       │      ├──► 'category-details' (CategoryDetails)
       │      │          │
       │      │          ├──► 'provider-profile' (ProviderProfile)
       │      │          │          │
       │      │          │          └──► 'request-form'
       │      │          │
       │      │          └──► 'request-form' (RequestForm)
       │      │                     │
       │      │                     └──► 'matching-radar' (MatchingRadar)
       │      │                                │
       │      │                                └──► 'live-tracking' (LiveTracking)
       │      │                                           │
       │      │                                           └──► 'service-invoice' (ServiceInvoice)
       │      │                                                      │
       │      │                                                      └──► 'activity-history'
       │      │
       │      ├──► 'activity-history' (ActivityHistory)
       │      │          │
       │      │          └──► 'service-invoice' / 'request-form' (Re-book)
       │      │
       │      └──► 'help' (HelpSupportModal)

[Provider Mode]
       │
       ├── 'provider-dashboard' (ProviderDashboard)
       │      │
       │      ├──► 'provider-jobs' (ProviderJobsBroadcast)
       │      │          │
       │      │          └──► 'provider-active-job' (ProviderActiveJob)
       │      │
       │      ├──► 'provider-active-job' (ProviderActiveJob)
       │      │          │
       │      │          └──► 'service-invoice' / 'provider-dashboard'
       │      │
       │      ├──► 'provider-earnings' (ProviderEarningsView)
       │      │
       │      └──► 'provider-profile' (ProviderProfileView)
```

---

## 3. Global State Architecture (`AppContext.tsx`)

All cross-component operational data is held in `AppContext`:

```typescript
interface AppContextType {
  role: UserRole;                           // 'customer' | 'provider'
  setRole: (role: UserRole) => void;
  currentScreen: AppScreen;                 // Active virtual route
  navigateTo: (screen: AppScreen, params?: Record<string, string>) => void;
  activeRequest: ServiceRequest | null;     // Ongoing emergency order
  pastRequests: CompletedDispatchSummary[]; // Historical orders
  providers: Provider[];                    // Neighborhood technician roster
  selectedProviderId: string | null;        // Active technician being viewed/booked
  selectedCategory: string;                 // Selected vertical filter
  providerDutyStatus: ProviderDutyStatus;   // 'online' | 'busy' | 'offline'
  providerEarnings: ProviderEarningsState;  // Today's gross/net/jobs metrics
  cityId: string;                           // Active city ID ('bengaluru' | 'mumbai' | 'delhi')
  cityConfig: CityConfig;                   // Resolved city metadata and pricing
  currentLocation: LocationCluster;         // Active neighborhood cluster
  availableCities: CityConfig[];            // All supported cities
  toasts: ToastNotification[];              // Floating UI notifications
  showToast: (message: string, type?: ToastType, icon?: string) => void;
  createServiceRequest: (details: NewRequestDetails) => void;
  acceptRequestAsProvider: () => void;
  markProviderArrived: () => void;
  verifyDoorstepPin: (enteredPin: string) => boolean;
  completeServiceJob: (addedParts?: SparePartItem[]) => void;
  submitInvoicePayment: (params: PaymentParams) => void;
  cancelActiveRequest: () => void;
  setProviderDutyStatus: (status: ProviderDutyStatus) => void;
  setCity: (cityId: string) => void;
  setCurrentLocation: (cluster: LocationCluster) => void;
  resetDemoState: () => void;
}
```

### State Persistence Rules
* `satthi_role`: Saved to `localStorage` (`'customer'` or `'provider'`).
* `satthi_city_id`: Saved to `localStorage` (defaults to `'bengaluru'`).
* `satthi_cluster_id`: Saved to `localStorage` (defaults to `'indiranagar'`).
* State resets can be triggered via `resetDemoState()` in `ProviderProfileView.tsx`, clearing `localStorage` and restoring pristine seed data from `mockData.ts`.

---

## 4. The Decoupled Simulation Service (`simulationService.ts`)

To avoid vendor lock-in and enable zero-code-change transition to production APIs, all external mocks are encapsulated in `SimulationService`:

```
               [ React UI Components ]
                          │
                          ▼
            [ simulationService.ts ] (Boundary Layer)
            ┌─────────────┴─────────────┐
            ▼                           ▼
    [ Demo Sandbox Engine ]   [ Future Real Adapters ]
    • simulatePayment()        • Razorpay / Stripe
    • simulateBankCashout()    • IMPS / Setu / RazorpayX
    • simulateVoiceCall()      • Twilio / Exotel
    • simulateChat()           • WebSocket / Sendbird
    • simulateNotification()   • WhatsApp Business API
    • simulateGpsTelemetry()   • Google Maps Directions API
    • simulateSosHotline()     • Municipal 112 API
```

Each simulation method returns a standardized `SimulationResult` object:
```typescript
export interface SimulationResult {
  success: boolean;
  referenceId: string;
  isSimulated: true;
  message: string;
  disclaimer: string;
}
```

---

## 5. Hyperlocal Distance & Pricing Engine (`dataLayer.ts`)
* **Haversine Distance Approximation**: Calculates realistic point-to-point road distances between the customer's selected cluster and provider home clusters.
* **Dynamic Provider Hydration**: When the customer changes their location cluster in `LocationDrawer.tsx`, `dataLayer.getProviders(filters, clusterId)` recalculates distances (`distanceKm`), updates arrival times (`etaMinutes`), and updates vehicle registration prefixes (`KA`, `MH`, `DL`) to match the selected city.
* **Invoice Total Engine**: Computes job totals via `calculateJobInvoiceTotal(baseInspection, labor, parts, safety, discount, gst)`.
