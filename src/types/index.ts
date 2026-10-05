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

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  onlineCount: number;
  visitFee: number;
  description: string;
  badge?: string;
  bgTint?: string;
  textTint?: string;
}

export interface Review {
  id: string;
  author: string;
  authorInitials: string;
  locality: string;
  timeAgo: string;
  rating: number;
  comment: string;
  tag: string;
  isVerified: boolean;
}

export interface Provider {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  distanceKm: number;
  etaMinutes: number;
  isAvailable: boolean;
  visitFee: number;
  avgFixRange: string;
  avatar: string;
  isGovtCertified: boolean;
  isBackgroundVerified: boolean;
  damageCoverage: boolean;
  onTimeRate: number;
  repeatBookingsCount: number;
  vanStock: string[];
  specialties: string[];
  coverageZones: string[];
  languages: string[];
  cityId?: string;
  baseClusterId?: string;
  vehicle: {
    model: string;
    plate: string;
    hasInsulatedKit: boolean;
  };
  pricingBreakdown: {
    inspectionFee: number;
    inspectionWaiveThreshold: number;
    laborRates: Array<{ label: string; range: string; icon: string }>;
  };
  reviews: Review[];
}

export interface SparePartItem {
  id: string;
  name: string;
  price: number;
  brand: string;
  verifiedMSRP: boolean;
  inStock: boolean;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  customerAddress: string;
  landmark: string;
  category: string;
  faultType: string;
  description: string;
  photoUrl?: string;
  urgency: 'immediate' | 'later';
  preferredTimeSlot?: string;
  status: RequestStatus;
  assignedProviderId?: string;
  pin: string; // e.g., '4821'
  visitFee: number;
  laborFee: number;
  parts: SparePartItem[];
  platformFee: number;
  discount: number;
  taxes: number;
  totalPayable: number;
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
  invoiceNumber: string;
}

export interface CompletedDispatchSummary {
  id: string;
  orderNumber: string;
  serviceTitle: string;
  customerName: string;
  customerAddress: string;
  durationMinutes: number;
  grossAmount: number;
  platformFee: number;
  netPayout: number;
  rating: number;
  timeAgo: string;
  status: 'Completed';
  category: string;
  providerId?: string;
  providerName: string;
  providerAvatar: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  icon?: string;
  durationMs?: number;
}

export interface LocationCluster {
  id: string;
  name: string;
  area: string;
  activeProsCount: number;
  avgArrivalMins: number;
  surgeActive?: boolean;
  surgeMultiplier?: number;
  surgeReason?: string;
  trafficCondition?: 'clear' | 'moderate' | 'dense';
  trafficCorridor?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CityPricingConfig {
  baseInspectionFee: number;
  inspectionWaiveThreshold: number;
  platformSafetyFee: number;
  firstTimeDiscount: number;
  lateCancellationFee: number;
  freeCancellationMinutes: number;
  warrantyDays: number;
  providerFlatFee: number;
  gstPercent: number;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  country: string;
  currencySymbol: string;
  currencyCode: string;
  supportHelpline: string;
  supportTel: string;
  supportWhatsAppNumber: string;
  operationsDeskName: string;
  defaultClusterId: string;
  localUtilityProvider: {
    name: string;
    type: string;
    helpline: string;
    sosLabel: string;
  };
  tradeCompliance: {
    authority: string;
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
