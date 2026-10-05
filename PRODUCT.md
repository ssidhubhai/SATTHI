# PRODUCT.md

## 1. Product Identity & Overview
* **Product Name**: SATTHI (साथी — "Companion / Partner")
* **Tagline**: Local On-Demand Blue-Collar Services at Fair & Transparent Rates.
* **Core Problem**: Urban residents face opaque pricing, delayed emergency dispatches, and fraudulent middlemen markups when seeking urgent home repairs (short circuits, pipe bursts, lockouts). Meanwhile, independent technicians (electricians, plumbers, carpenters) lose 20–35% of their hard-earned labor income to aggregator commission algorithms.
* **Core Solution**: A hyperlocal, real-time, two-sided marketplace connecting urban residents with nearby independent trade professionals in under 15 minutes, operating on a **₹0 Commission Standard** where technicians retain 100% of their labor fees.

---

## 2. Key Value Propositions

### For Customers (Residents)
1. **Under-15-Minute Emergency Dispatch**: Hyperlocal proximity clustering matches residents with certified pros within a 2.5 km radius.
2. **Transparent Price Lock**: Visit and diagnostic fees (e.g., ₹99 for Electrician/Plumber, ₹149 for Carpenter) are locked upfront and waived 100% if repair labor exceeds ₹300.
3. **Zero Markup on Spare Parts**: Technicians supply branded replacement parts at direct distributor MSRP with original receipts; no hidden markups.
4. **Doorstep Handshake PIN Security**: Anti-fraud verification code (4-digit PIN) must be verbally confirmed before tools are unlocked and billing begins.
5. **SATTHI 30-Day Guarantee**: If a repaired circuit trips or a fixture leaks within 30 days, re-inspection and rework labor is 100% free.

### For Providers (Technicians / Craftsmen)
1. **Ethical ₹0 Commission Model**: Technicians keep 100% of diagnostic and labor fees. SATTHI deducts only a flat ₹20 server/dispatch fee per completed order.
2. **Instant Settlement Sandbox**: Daily earnings are calculated in real time with single-tap simulated IMPS withdrawal directly to the technician's bank account.
3. **Neighborhood Density**: Dispatches are routed strictly within the technician's designated zone (e.g., Indiranagar Hub, Bandra West, CP Cluster), minimizing transit fuel and unbillable travel time.
4. **Digital Credential Showcase**: Verified skill records, trade diplomas (Govt ITI), and verified customer review counts build long-term local reputation.

---

## 3. Dual Persona Architecture

SATTHI operates with two distinct primary personas rendered from a shared state engine:

| Attribute | Customer Persona | Provider Persona |
| :--- | :--- | :--- |
| **Demo User** | Priya M. (Resident) | Rahul Kumar (Master Electrician) |
| **Default Location** | 42, 12th Main Rd, Indiranagar, Bengaluru | Indiranagar Hub • On-Duty Van |
| **Primary Goal** | Fast, trustworthy repair of urgent home faults | Steady, dignified local jobs with instant daily payout |
| **Entry Point** | `CustomerHome.tsx` | `ProviderDashboard.tsx` |
| **Key Screens** | Home, Categories, Pro Profile, Request Form, Matching Radar, Live Tracking, Invoice, History, Help | Dashboard, Jobs Broadcast Radar, Active Job HUD, Earnings & IMPS Cashout, Profile View |
| **Persistent Switcher**| Floating pill at bottom-right (`RoleSwitcher.tsx`) toggles roles seamlessly. |

---

## 4. Multi-City & Hyperlocal Cluster Coverage

SATTHI is architected with a multi-city configuration layer (`src/config/cityConfig.ts`):

### 1. Bengaluru (Active Demo Default)
* **Currency**: ₹ (INR)
* **Local Utility Emergency Partner**: BESCOM (`1912` Grid Helpline)
* **Trade Authority**: Karnataka PWD & Electrical Inspectorate
* **Clusters**:
  * *Indiranagar Hub*: 100ft Rd, Defense Colony & HAL 2nd Stage (14 active pros, ~14m ETA, Moderate traffic corridor)
  * *Domlur / Old Airport Rd*: EGL Tech Park, Domlur Layout & Command Hospital (9 active pros, ~18m ETA)
  * *Koramangala*: 80ft Rd, Sony Signal & 4th Block (18 active pros, ~12m ETA)
  * *HSR Layout*: 27th Main, Sector 1 & Sector 2 (11 active pros, ~16m ETA)

### 2. Mumbai
* **Currency**: ₹ (INR)
* **Local Utility Emergency Partner**: Adani Electricity / BEST (`1912` Helpline)
* **Trade Authority**: Maharashtra Energy Development Agency & PWD
* **Clusters**: Bandra West, Andheri West / Lokhandwala, Powai / Hiranandani

### 3. Delhi NCR
* **Currency**: ₹ (INR)
* **Local Utility Emergency Partner**: BSES Yamuna / Rajdhani (`19122` Helpline)
* **Trade Authority**: Delhi PWD & Labour Department
* **Clusters**: Connaught Place / Central, Saket / South Delhi, Cyber City / Gurugram

---

## 5. Service Verticals & Fee Structure

| Vertical | Icon | Inspection Fee | Waive Threshold | Common Faults | Sample Spare Parts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Electrician** | `electric_bolt` | ₹99 | ₹300 | Short circuits, MCB tripping, fan wiring, sparking switchboard | Schneider 32A MCB (₹210), Havells 16A Socket (₹140), Finolex 2.5mm Wire (₹180) |
| **Plumber** | `plumbing` | ₹99 | ₹300 | Sink clog, pipe burst, flush tank leak, tap dripping | Jaquar Ceramic Cartridge (₹180), PVC Waste Pipe (₹90), Teflon Tape (₹20) |
| **Carpenter** | `carpenter` | ₹149 | ₹300 | Door lock jammed, wardrobe hinges, wall drill mount, furniture repair | Godrej Mortise Lock (₹450), Heavy Duty Soft-Close Hinge (₹120) |
| **Appliance & AC** | `mode_fan` | ₹199 | ₹400 | AC not cooling, jet pump clean, geyser water cold, washing machine drain | AC Capacitor 45uF (₹280), Geyser Heating Element 2kW (₹420) |

---

## 6. Commercial Model & Tariff Rules
* **Platform Safety Fee**: A nominal ₹15 fee paid by the customer per dispatch to cover safety monitoring and warranty underwriting.
* **First-Time Resident Coupon**: Automatically applies `-₹15` (`SATTHI50`), offsetting the safety fee for first-time orders.
* **Taxes**: 18% GST applied strictly to the platform safety fee (₹3), not to the independent technician's labor.
* **Technician Flat Deduction**: Fixed ₹20 per job deducted from the gross payout for routing and server dispatch infrastructure.
* **Free Cancellation**: 100% free cancellation if canceled within the initial 2-minute dispatch window.
