# DATA_MODEL.md

## 1. Type Architecture Overview
All primary interfaces are located in `/src/types/index.ts`. The data model supports multi-city configuration, technician profiles, visual proof attachments, live dispatch states, and itemized billing.

---

## 2. Core Entities & TypeScript Interfaces

### User Roles & Status Enums
```typescript
export type UserRole = 'customer' | 'provider';

export type RequestStatus =
  | 'DRAFT'
  | 'SEARCHING'
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProviderDutyStatus = 'online' | 'busy' | 'offline';
```

### Provider (Technician) Schema
```typescript
export interface Provider {
  id: string;                               // e.g., 'rahul-kumar'
  name: string;                             // e.g., 'Rahul Kumar'
  title: string;                            // e.g., 'Master Electrician'
  category: string;                         // 'electrician' | 'plumber' | 'carpenter' | 'appliance-ac'
  rating: number;                           // 4.95
  reviewCount: number;                      // 184
  experienceYears: number;                  // 8
  distanceKm: number;                       // Dynamic distance in km from active cluster
  etaMinutes: number;                       // Dynamic arrival time in minutes
  isAvailable: boolean;
  visitFee: number;                         // e.g., 99
  avgFixRange: string;                      // '₹200 - ₹450'
  avatar: string;                           // Image URL
  isGovtCertified: boolean;
  isBackgroundVerified: boolean;
  damageCoverage: boolean;
  onTimeRate: number;                       // 99.4
  repeatBookingsCount: number;              // 42
  vanStock: string[];
  specialties: string[];
  coverageZones: string[];
  languages: string[];
  cityId?: string;                          // 'bengaluru' | 'mumbai' | 'delhi'
  baseClusterId?: string;                   // 'indiranagar' | 'domlur' | 'hsr'
  vehicle: {
    model: string;                          // 'Honda Activa 6G'
    plate: string;                          // 'KA 03 HM 4821'
    hasInsulatedKit: boolean;
  };
  pricingBreakdown: {
    inspectionFee: number;
    inspectionWaiveThreshold: number;
    laborRates: Array<{ label: string; range: string; icon: string }>;
  };
  reviews: Review[];
}
```

### Service Request Schema
```typescript
export interface ServiceRequest {
  id: string;                               // e.g., 'STH-8821'
  customerId: string;
  customerName: string;                     // 'Priya M.'
  customerPhone: string;
  customerAvatar?: string;
  customerAddress: string;
  landmark: string;
  category: string;                         // 'electrician'
  faultType: string;                        // 'Short Circuit & MCB Tripping'
  description: string;
  photoUrl?: string;
  urgency: 'immediate' | 'later';
  preferredTimeSlot?: string;
  status: RequestStatus;                    // Lifecycle status
  assignedProviderId?: string;              // 'rahul-kumar'
  pin: string;                              // e.g., '4821' (Doorstep Handshake Code)
  visitFee: number;                         // ₹99
  laborFee: number;                         // ₹220
  parts: SparePartItem[];                   // Replaced parts
  platformFee: number;                      // ₹15
  discount: number;                         // ₹15 (SATTHI50)
  taxes: number;                            // ₹3 (18% on platform fee)
  totalPayable: number;                     // Gross total
  paymentMethod?: 'upi' | 'cash' | 'card';
  paymentStatus: 'pending' | 'paid';
  rating?: number;
  tip?: number;
  feedbackTags?: string[];
  createdAt: string;
  completedAt?: string;
  etaMinutesRemaining?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  dispatchZone: string;
  invoiceNumber: string;                    // 'SAT-8821'
}
```

### Completed Dispatch Summary (History Archive)
```typescript
export interface CompletedDispatchSummary {
  id: string;                               // e.g., 'disp-1'
  orderNumber: string;                      // 'STH-4019'
  serviceTitle: string;
  customerName: string;
  customerAddress: string;
  durationMinutes: number;                  // 38
  grossAmount: number;                      // 448
  platformFee: number;                      // 20
  netPayout: number;                        // 428
  rating: number;                           // 5
  timeAgo: string;                          // '2 hours ago'
  status: 'Completed';
  category: string;
  providerId?: string;
  providerName: string;
  providerAvatar: string;
}
```

### Multi-City Configuration Schema
```typescript
export interface LocationCluster {
  id: string;                               // 'indiranagar'
  name: string;                             // 'Indiranagar Hub'
  area: string;                             // '100ft Rd, Defense Colony & HAL 2nd Stage'
  activeProsCount: number;                  // 14
  avgArrivalMins: number;                   // 14
  surgeActive?: boolean;
  surgeMultiplier?: number;
  surgeReason?: string;
  trafficCondition?: 'clear' | 'moderate' | 'dense';
  trafficCorridor?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CityConfig {
  id: string;                               // 'bengaluru'
  name: string;                             // 'Bengaluru'
  state: string;                            // 'Karnataka'
  country: string;                          // 'India'
  currencySymbol: string;                   // '₹'
  currencyCode: string;                     // 'INR'
  supportHelpline: string;
  supportTel: string;
  supportWhatsAppNumber: string;
  operationsDeskName: string;
  defaultClusterId: string;
  localUtilityProvider: {
    name: string;                           // 'BESCOM'
    type: string;                           // 'Electricity Supply Company'
    helpline: string;                       // '1912'
    sosLabel: string;                       // 'BESCOM SOS'
  };
  tradeCompliance: {
    authority: string;                      // 'Karnataka PWD & Electrical Inspectorate'
    wiremanLicenseName: string;
    itiDiplomaAuthority: string;
    insuranceUnderwriter: string;
    trafficGridName: string;
    gstin: string;
  };
  demoUser: {
    name: string;
    avatar: string;
    defaultAddress: string;
    landmark: string;
    phone: string;
  };
  pricing: CityPricingConfig;
  clusters: LocationCluster[];
  searchRadiusKm?: number;
}
```

---

## 3. Request Lifecycle State Transitions

```
[DRAFT]
   │
   ▼ User taps "Find Available Technician"
[SEARCHING] (MatchingRadar.tsx active; radar animation polling)
   │
   ▼ Technician auto-accepts or simulation trigger fires
[ON_THE_WAY] (LiveTracking.tsx active; ETA ~6m, transit marker moving)
   │
   ▼ Provider triggers "Arrived at Door"
[ARRIVED] (Waiting for PIN verbal handshake from customer)
   │
   ▼ Verbal PIN verified on technician HUD
[IN_PROGRESS] (Tools unlocked, diagnostic & repair underway, parts added)
   │
   ▼ Technician taps "Finish Repair"
[COMPLETED] (ServiceInvoice.tsx rendered, payment simulated)
```
*(At any point prior to ARRIVED, customer can invoke `cancelActiveRequest()` to transition to `[CANCELLED]`)*
