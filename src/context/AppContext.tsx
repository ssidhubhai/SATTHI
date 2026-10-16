import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  UserRole,
  ProviderDutyStatus,
  ServiceRequest,
  CompletedDispatchSummary,
  Provider,
  SparePartItem,
  ToastNotification,
  LocationCluster,
  CityConfig,
  ProviderProfile,
  JobOpportunity,
  VerificationStatus,
} from '../types';
import {
  MOCK_PROVIDERS,
  INITIAL_ACTIVE_REQUEST,
  MOCK_PAST_DISPATCHES,
  DEFAULT_LOGGED_IN_PROVIDER,
  MOCK_JOB_OPPORTUNITIES,
  AUTHORIZED_SPARE_PARTS,
} from '../data/mockData';
import { DEFAULT_ACTIVE_CITY, AVAILABLE_CITIES, calculateJobInvoiceTotal } from '../config/cityConfig';
import { dataLayer } from '../data/dataLayer';
import { simulationService } from '../services/simulationService';
import { db, testConnection } from '../services/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

export interface ProviderEarningsState {
  todayGross: number;
  platformCut: number;
  netDirect: number;
  jobsDone: number;
  pendingSettlement: number;
  settledAmount: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentScreen: string;
  navigateTo: (screen: string, params?: { categoryId?: string; providerId?: string; jobId?: string; faultType?: string }) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  selectedFaultType: string;
  setSelectedFaultType: (fault: string) => void;
  providers: Provider[];
  activeRequest: ServiceRequest | null;
  pastRequests: CompletedDispatchSummary[];
  providerDutyStatus: ProviderDutyStatus;
  setProviderDutyStatus: (status: ProviderDutyStatus) => void;
  providerProfile: ProviderProfile;
  setProviderProfile: (profile: ProviderProfile) => void;
  updateProviderProfile: (updates: Partial<ProviderProfile>) => void;
  providerEarnings: ProviderEarningsState;
  setProviderEarnings: React.Dispatch<React.SetStateAction<ProviderEarningsState>>;
  providerHistory: CompletedDispatchSummary[];
  jobOpportunities: JobOpportunity[];
  selectedOpportunityId: string;
  setSelectedOpportunityId: (id: string) => void;
  acceptJobOpportunity: (jobId: string) => void;
  declineJobOpportunity: (jobId: string) => void;
  startProviderTravel: () => void;
  markProviderArrived: () => void;
  verifyDoorstepPin: (enteredPin: string) => boolean;
  verifyCompletionAndCash: (enteredPin: string, cashAmount?: number) => boolean;
  isFirebaseConnected: boolean;
  addPartToActiveJob: (part: SparePartItem) => void;
  removePartFromActiveJob: (partId: string) => void;
  updateLaborFee: (fee: number) => void;
  completeServiceJob: (addedParts?: SparePartItem[], notes?: string) => void;
  registerProvider: (data: Partial<ProviderProfile>) => void;
  loginProvider: (preset: 'rahul-verified' | 'new-pro-pending' | 'custom', customName?: string) => void;
  cityConfig: CityConfig;
  setCity: (cityId: string) => void;
  availableCities: CityConfig[];
  currentLocation: LocationCluster;
  setCurrentLocation: (loc: LocationCluster) => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: string) => void;
  removeToast: (id: string) => void;
  createServiceRequest: (details: {
    faultType: string;
    description: string;
    urgency: 'immediate' | 'later';
    category?: string;
    providerId?: string;
  }) => void;
  acceptRequestAsProvider: () => void;
  submitInvoicePayment: (params: {
    rating: number;
    tip: number;
    method: 'upi' | 'cash' | 'card';
    feedbackTags: string[];
  }) => void;
  cancelActiveRequest: () => void;
  reBookProvider: (providerId: string, category: string) => void;
  resetDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cityId, setCityId] = useState<string>(() => {
    return localStorage.getItem('satthi_city_id') || DEFAULT_ACTIVE_CITY.id;
  });

  const cityConfig = AVAILABLE_CITIES[cityId] || DEFAULT_ACTIVE_CITY;
  const availableCities = Object.values(AVAILABLE_CITIES);

  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('satthi_role');
    return (saved as UserRole) || 'customer';
  });

  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    return role === 'provider' ? 'provider-dashboard' : 'home';
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('electrician');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('rahul-kumar');
  const [selectedFaultType, setSelectedFaultType] = useState<string>('');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('opp-1');

  const [currentLocation, setCurrentLocationState] = useState<LocationCluster>(() => {
    const defaultCluster = cityConfig.clusters.find((c) => c.id === cityConfig.defaultClusterId);
    return defaultCluster || cityConfig.clusters[0];
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    dataLayer.setCity(cityConfig);
    return dataLayer.getProviders(undefined, cityConfig.defaultClusterId);
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Provider Profile
  const [providerProfile, setProviderProfile] = useState<ProviderProfile>(() => {
    const saved = localStorage.getItem('satthi_provider_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_LOGGED_IN_PROVIDER;
      }
    }
    return DEFAULT_LOGGED_IN_PROVIDER;
  });

  // Active Request
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(() => {
    const saved = localStorage.getItem('satthi_active_request');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACTIVE_REQUEST;
      }
    }
    return INITIAL_ACTIVE_REQUEST;
  });

  // Customer Past Dispatches
  const [pastRequests, setPastRequests] = useState<CompletedDispatchSummary[]>(() => {
    const saved = localStorage.getItem('satthi_past_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_PAST_DISPATCHES;
      }
    }
    return MOCK_PAST_DISPATCHES;
  });

  // Provider History
  const [providerHistory, setProviderHistory] = useState<CompletedDispatchSummary[]>(() => {
    const saved = localStorage.getItem('satthi_provider_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_PAST_DISPATCHES.filter(
          (d) => d.providerId === 'rahul-kumar' || d.providerName.includes('Rahul')
        );
      }
    }
    return MOCK_PAST_DISPATCHES.filter(
      (d) => d.providerId === 'rahul-kumar' || d.providerName.includes('Rahul')
    );
  });

  // Provider Duty Status
  const [providerDutyStatus, setProviderDutyStatusState] = useState<ProviderDutyStatus>(() => {
    const saved = localStorage.getItem('satthi_provider_duty');
    return (saved as ProviderDutyStatus) || 'online';
  });

  // Provider Earnings
  const [providerEarnings, setProviderEarnings] = useState<ProviderEarningsState>(() => {
    const saved = localStorage.getItem('satthi_provider_earnings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          todayGross: 1480,
          platformCut: 60,
          netDirect: 1420,
          jobsDone: 3,
          pendingSettlement: 0,
          settledAmount: 8450,
        };
      }
    }
    return {
      todayGross: 1480,
      platformCut: 60,
      netDirect: 1420,
      jobsDone: 3,
      pendingSettlement: 0,
      settledAmount: 8450,
    };
  });

  // Job Opportunities feed
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(MOCK_JOB_OPPORTUNITIES);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('satthi_role', role);
  }, [role]);

  useEffect(() => {
    if (activeRequest) {
      localStorage.setItem('satthi_active_request', JSON.stringify(activeRequest));
    } else {
      localStorage.removeItem('satthi_active_request');
    }
  }, [activeRequest]);

  useEffect(() => {
    localStorage.setItem('satthi_past_requests', JSON.stringify(pastRequests));
  }, [pastRequests]);

  useEffect(() => {
    localStorage.setItem('satthi_provider_history', JSON.stringify(providerHistory));
  }, [providerHistory]);

  useEffect(() => {
    localStorage.setItem('satthi_provider_duty', providerDutyStatus);
  }, [providerDutyStatus]);

  useEffect(() => {
    localStorage.setItem('satthi_provider_earnings', JSON.stringify(providerEarnings));
  }, [providerEarnings]);

  useEffect(() => {
    localStorage.setItem('satthi_provider_profile', JSON.stringify(providerProfile));
  }, [providerProfile]);

  // Check connection to Firestore on startup
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // Sync helper to Firestore dispatches collection
  const syncToFirestore = async (req: ServiceRequest) => {
    try {
      const payload = {
        id: req.id,
        customerId: req.customerId || 'cust-demo',
        customerName: req.customerName || 'Resident',
        customerPhone: req.customerPhone || '+91 98450 12891',
        address: req.customerAddress || 'Indiranagar, Bengaluru',
        cityId: (cityConfig.id || 'bengaluru').toLowerCase(),
        clusterId: req.dispatchZone || 'indiranagar',
        category: (req.category === 'electrician' ? 'electrical' : req.category).toLowerCase(),
        faultTitle: req.faultType || 'Utility Issue',
        faultDescription: req.description || '',
        status:
          req.status === 'SEARCHING' || req.status === 'REQUESTED'
            ? 'DISPATCHED'
            : req.status === 'DRAFT'
            ? 'DISPATCHED'
            : req.status,
        providerId: req.assignedProviderId || '',
        providerName: req.assignedProviderName || '',
        providerPhone: req.assignedProviderPhone || '+91 98450 88210',
        arrivalPin: req.arrivalPin || req.pin || '4821',
        completionPin: req.completionPin || '7130',
        baseFee: req.visitFee || 99,
        laborFee: req.laborFee || 220,
        partsFee: (req.parts || []).reduce((acc, p) => acc + (p.price || 0), 0),
        taxAmount: req.taxes || 3,
        totalAmount: req.totalPayable || 433,
        paymentMode: req.paymentMethod ? (req.paymentMethod.toUpperCase() === 'CASH' ? 'CASH' : 'UPI') : 'CASH',
        paymentStatus: req.paymentStatus === 'paid' ? 'COLLECTED' : 'PENDING',
        createdAt: req.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'dispatches', req.id), payload, { merge: true });
    } catch (err) {
      console.warn('Firestore dispatch sync:', err);
    }
  };

  // Real-time Firestore snapshot listener for active dispatch
  useEffect(() => {
    if (!activeRequest?.id) return;

    // Seed document to Firestore if initializing
    syncToFirestore(activeRequest);

    const unsub = onSnapshot(
      doc(db, 'dispatches', activeRequest.id),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data && data.status) {
            setActiveRequest((prev) => {
              if (!prev) return prev;
              const remoteStatus = data.status === 'DISPATCHED' ? 'SEARCHING' : data.status;
              const remotePaymentPaid = data.paymentStatus === 'COLLECTED';
              const isDifferent =
                prev.status !== remoteStatus ||
                (remotePaymentPaid && prev.paymentStatus !== 'paid') ||
                (data.providerId && prev.assignedProviderId !== data.providerId) ||
                (data.parts && data.parts.length !== prev.parts.length);

              if (isDifferent) {
                return {
                  ...prev,
                  status: remoteStatus,
                  assignedProviderId: data.providerId || prev.assignedProviderId,
                  assignedProviderName: data.providerName || prev.assignedProviderName,
                  assignedProviderPhone: data.providerPhone || prev.assignedProviderPhone,
                  arrivalPin: data.arrivalPin || prev.arrivalPin || prev.pin,
                  pin: data.arrivalPin || prev.pin,
                  completionPin: data.completionPin || prev.completionPin || '7130',
                  paymentStatus: remotePaymentPaid ? 'paid' : prev.paymentStatus,
                  cashCollected: remotePaymentPaid || prev.cashCollected,
                  cashAmountReceived: data.totalAmount || prev.totalPayable,
                  totalPayable: data.totalAmount || prev.totalPayable,
                  taxes: data.taxAmount ?? prev.taxes,
                };
              }
              return prev;
            });
          }
        }
      },
      (err) => {
        console.warn('Firestore snapshot listener error:', err);
      }
    );

    return () => unsub();
  }, [activeRequest?.id]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    icon?: string
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, message, type, icon, durationMs: 3200 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrentLocation = (loc: LocationCluster) => {
    setCurrentLocationState(loc);
    const updatedPros = dataLayer.getProviders(undefined, loc.id);
    setProviders(updatedPros);
    showToast(`Delivery location set to ${loc.name}`, 'success', 'location_on');
  };

  const setCity = (newCityId: string) => {
    if (AVAILABLE_CITIES[newCityId]) {
      setCityId(newCityId);
      localStorage.setItem('satthi_city_id', newCityId);
      const newCity = AVAILABLE_CITIES[newCityId];
      dataLayer.setCity(newCity);
      const defaultCluster =
        newCity.clusters.find((c) => c.id === newCity.defaultClusterId) || newCity.clusters[0];
      setCurrentLocationState(defaultCluster);
      const updatedPros = dataLayer.getProviders(undefined, defaultCluster.id);
      setProviders(updatedPros);
      showToast(`Service city switched to ${newCity.name} (${defaultCluster.name})`, 'success', 'location_city');
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'provider') {
      showToast(`Switched to Provider Mode (${providerProfile.name})`, 'info', 'engineering');
      if (
        activeRequest &&
        (activeRequest.status === 'ACCEPTED' ||
          activeRequest.status === 'ON_THE_WAY' ||
          activeRequest.status === 'ARRIVED' ||
          activeRequest.status === 'IN_PROGRESS')
      ) {
        setCurrentScreen('provider-active-job');
      } else {
        setCurrentScreen('provider-dashboard');
      }
    } else {
      showToast(`Switched to Customer Mode (${cityConfig.demoUser.name})`, 'info', 'person');
      if (
        activeRequest &&
        (activeRequest.status === 'ACCEPTED' ||
          activeRequest.status === 'ON_THE_WAY' ||
          activeRequest.status === 'ARRIVED' ||
          activeRequest.status === 'IN_PROGRESS')
      ) {
        setCurrentScreen('live-tracking');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const navigateTo = (
    screen: string,
    params?: { categoryId?: string; providerId?: string; jobId?: string; faultType?: string }
  ) => {
    if (params?.categoryId) setSelectedCategory(params.categoryId);
    if (params?.providerId) setSelectedProviderId(params.providerId);
    if (params?.jobId) setSelectedOpportunityId(params.jobId);
    if (params?.faultType) setSelectedFaultType(params.faultType);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setProviderDutyStatus = (status: ProviderDutyStatus) => {
    setProviderDutyStatusState(status);
    setProviderProfile((prev) => ({ ...prev, availability: status }));
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerProfile.id ? { ...p, isAvailable: status === 'online' } : p
      )
    );
    const label =
      status === 'online'
        ? 'Active & Receiving Jobs'
        : status === 'busy'
        ? 'On Assignment'
        : 'Resting (Offline)';
    showToast(`Duty Status: ${label}`, status === 'online' ? 'success' : 'info', 'radio_button_checked');
  };

  const updateProviderProfile = (updates: Partial<ProviderProfile>) => {
    setProviderProfile((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
    showToast('Provider profile updated successfully!', 'success', 'check_circle');
  };

  const registerProvider = (data: Partial<ProviderProfile>) => {
    const newId = `pro-${Date.now().toString().slice(-4)}`;
    const newProfile: ProviderProfile = {
      ...DEFAULT_LOGGED_IN_PROVIDER,
      id: newId,
      userId: `usr-${newId}`,
      name: data.name || 'New Service Professional',
      phone: data.phone || '+91 98000 00000',
      email: data.email || 'pro@satthi.com',
      profession: data.profession || 'Independent Specialist',
      category: data.category || 'electrician',
      experienceYears: data.experienceYears || 4,
      skills: data.skills && data.skills.length > 0 ? data.skills : ['Standard Inspection', 'Troubleshooting'],
      serviceArea: data.serviceArea || `${currentLocation.name} Hub`,
      serviceRadiusKm: data.serviceRadiusKm || 3.0,
      availability: 'online',
      verificationStatus: data.verificationStatus || 'UNDER_REVIEW',
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      visitFee: data.visitFee || cityConfig.pricing.baseInspectionFee,
      laborRateRange: data.laborRateRange || '₹150 – ₹350 avg fix',
      profileImage: data.profileImage || DEFAULT_LOGGED_IN_PROVIDER.profileImage,
      bio: data.bio || 'Independent verified tradesperson on SATTHI network.',
      languages: data.languages || ['English', 'Hindi'],
      cityId: cityConfig.id,
      clusterId: currentLocation.id,
      emergencyAvailable: data.emergencyAvailable ?? true,
    };

    setProviderProfile(newProfile);
    setProviderDutyStatusState('online');
    setRoleState('provider');
    setCurrentScreen('provider-dashboard');
    showToast(
      `Welcome to SATTHI, ${newProfile.name}! Application received & dashboard ready.`,
      'success',
      'verified'
    );
  };

  const loginProvider = (
    preset: 'rahul-verified' | 'new-pro-pending' | 'custom',
    customName?: string
  ) => {
    if (preset === 'rahul-verified') {
      setProviderProfile(DEFAULT_LOGGED_IN_PROVIDER);
      setProviderDutyStatusState('online');
      showToast('Logged in as Rahul Kumar (Verified Pro Master)', 'success', 'engineering');
    } else if (preset === 'new-pro-pending') {
      setProviderProfile({
        ...DEFAULT_LOGGED_IN_PROVIDER,
        id: 'pro-new-applicant',
        name: customName || 'Amit Verma',
        profession: 'Licensed Plumber & Sanitation Tech',
        category: 'plumber',
        verificationStatus: 'UNDER_REVIEW',
        completedJobsCount: 0,
        reviewCount: 0,
      });
      setProviderDutyStatusState('online');
      showToast('Logged in as Amit Verma (Under Review Profile)', 'info', 'person_search');
    }
    setRoleState('provider');
    setCurrentScreen('provider-dashboard');
  };

  // Create Service Request (Customer action)
  const createServiceRequest = (details: {
    faultType: string;
    description: string;
    urgency: 'immediate' | 'later';
    category?: string;
    providerId?: string;
  }) => {
    const reqCat = details.category || selectedCategory || 'electrician';
    const reqPro = details.providerId || selectedProviderId || 'rahul-kumar';
    const foundPro = providers.find((p) => p.id === reqPro) || providers[0];

    // Pick vertical-appropriate default part & labor
    let defaultLabor = 220;
    let defaultPart: SparePartItem = AUTHORIZED_SPARE_PARTS[0];

    if (reqCat === 'plumber') {
      defaultLabor = 200;
      defaultPart = AUTHORIZED_SPARE_PARTS.find((p) => p.id === 'part-pipe-valve-1') || AUTHORIZED_SPARE_PARTS[0];
    } else if (reqCat === 'carpenter') {
      defaultLabor = 250;
      defaultPart = AUTHORIZED_SPARE_PARTS.find((p) => p.id === 'part-lock-godrej') || AUTHORIZED_SPARE_PARTS[0];
    } else if (reqCat === 'appliance-ac') {
      defaultLabor = 350;
      defaultPart = AUTHORIZED_SPARE_PARTS.find((p) => p.id === 'part-ac-capacitor') || AUTHORIZED_SPARE_PARTS[0];
    }

    const initialParts = [defaultPart];
    const invoiceCalculation = calculateJobInvoiceTotal(
      defaultLabor,
      defaultPart.price,
      cityConfig.pricing,
      0
    );

    const newReqId = `STH-${Math.floor(1000 + Math.random() * 9000)}`;
    const arrivalPin = `${Math.floor(1000 + Math.random() * 9000)}`;
    const completionPin = `${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq: ServiceRequest = {
      id: newReqId,
      customerId: 'cust-demo',
      customerName: cityConfig.demoUser.name,
      customerPhone: cityConfig.demoUser.phone,
      customerAvatar: cityConfig.demoUser.avatar,
      customerAddress: `${cityConfig.demoUser.defaultAddress}, ${cityConfig.name}`,
      landmark: cityConfig.demoUser.landmark,
      category: reqCat,
      faultType: details.faultType,
      description: details.description,
      urgency: details.urgency,
      status: 'SEARCHING',
      assignedProviderId: foundPro.id,
      assignedProviderName: foundPro.name,
      assignedProviderPhone: '+91 98450 88210',
      pin: arrivalPin,
      arrivalPin: arrivalPin,
      completionPin: completionPin,
      visitFee: foundPro.visitFee || cityConfig.pricing.baseInspectionFee,
      laborFee: defaultLabor,
      parts: initialParts,
      platformFee: cityConfig.pricing.platformSafetyFee,
      discount: cityConfig.pricing.firstTimeDiscount,
      taxes: invoiceCalculation.gstTax,
      totalPayable: invoiceCalculation.grandTotal,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      createdAt: 'Just now',
      etaMinutesRemaining: foundPro.etaMinutes || 12,
      dispatchZone: `${currentLocation.name} Cluster`,
      invoiceNumber: `SAT-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setActiveRequest(newReq);
    syncToFirestore(newReq);

    // Sync into job opportunities so provider sees the active request
    const newOpportunity: JobOpportunity = {
      id: `opp-${newReq.id}`,
      originalRequestId: newReq.id,
      serviceType: reqCat.charAt(0).toUpperCase() + reqCat.slice(1),
      category: reqCat,
      customerName: newReq.customerName,
      customerRating: 4.95,
      customerAddress: newReq.customerAddress,
      locality: currentLocation.name,
      distanceKm: foundPro.distanceKm || 0.8,
      requestedTimeAgo: 'Just now',
      urgency: details.urgency,
      estimatedEarningsRange: `₹${defaultLabor} – ₹${defaultLabor + defaultPart.price}`,
      baseInspectionFee: newReq.visitFee,
      issueTitle: details.faultType,
      issueDescription: details.description,
      requiredSkills: [details.faultType, `${reqCat} diagnostics`],
      photoUrl: newReq.photoUrl,
      status: 'AVAILABLE',
    };

    setJobOpportunities((prev) => [newOpportunity, ...prev.filter((o) => o.id !== newOpportunity.id)]);

    showToast(`Radar searching nearby ${reqCat}s in ${currentLocation.name}...`, 'info', 'radar');
    setCurrentScreen('matching-radar');
  };

  // Provider accepts request from broadcast/radar
  const acceptRequestAsProvider = () => {
    if (!activeRequest) return;
    const updated: ServiceRequest = {
      ...activeRequest,
      status: 'ACCEPTED',
      assignedProviderId: providerProfile.id,
      assignedProviderName: providerProfile.name,
    };
    setActiveRequest(updated);
    syncToFirestore(updated);

    showToast(
      `Job Accepted! Navigation route to ${activeRequest.customerAddress.split(',')[0]} locked.`,
      'success',
      'near_me'
    );
    setCurrentScreen('provider-active-job');
  };

  // Provider accepts specific opportunity from /provider/jobs feed
  const acceptJobOpportunity = (jobId: string) => {
    const opp = jobOpportunities.find((j) => j.id === jobId);
    if (!opp) return;

    // If it maps to the active request, update it
    if (activeRequest && (opp.originalRequestId === activeRequest.id || opp.id === `opp-${activeRequest.id}`)) {
      const updated: ServiceRequest = {
        ...activeRequest,
        status: 'ACCEPTED',
        assignedProviderId: providerProfile.id,
        assignedProviderName: providerProfile.name,
      };
      setActiveRequest(updated);
      syncToFirestore(updated);
    } else {
      // Or instantiate a synchronized active request from this opportunity
      const calc = calculateJobInvoiceTotal(240, 210, cityConfig.pricing, 0);
      const newActiveReq: ServiceRequest = {
        id: `STH-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: 'cust-opp',
        customerName: opp.customerName,
        customerPhone: '+91 98450 12891',
        customerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0jvPP9BqfTgRvSFtPoRv1XBASZQr--39R7ro2SLoEOHAu7q-l8VS6oYJGtO2oMgwc5WsZGvP6UrzWuooM3jFJ2z33ozxBMSZOupgdYge6Tc5XpCKZPoEFhlH0QGVTPh1jWETGNq4kVt8z5_cOChFZA-yTJ501t-hyRVbYoGLDq4oKID9xoY5gdsVK4_ce39h6vyCXRw4ms2BbY2gI_FkswL8kI1X7QZm02q1GzVvXgdhXmSks08ZI',
        customerAddress: opp.customerAddress,
        landmark: 'Opposite main gate, ring bell #2',
        category: opp.category,
        faultType: opp.issueTitle,
        description: opp.issueDescription,
        urgency: opp.urgency,
        preferredTimeSlot: opp.preferredTimeSlot,
        status: 'ACCEPTED',
        assignedProviderId: providerProfile.id,
        assignedProviderName: providerProfile.name,
        pin: '4821',
        arrivalPin: '4821',
        completionPin: '7130',
        visitFee: opp.baseInspectionFee,
        laborFee: 240,
        parts: [AUTHORIZED_SPARE_PARTS[0]],
        platformFee: cityConfig.pricing.platformSafetyFee,
        discount: cityConfig.pricing.firstTimeDiscount,
        taxes: calc.gstTax,
        totalPayable: calc.grandTotal,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        createdAt: 'Just now',
        etaMinutesRemaining: Math.round(opp.distanceKm * 4 + 4),
        dispatchZone: opp.locality,
        invoiceNumber: `SAT-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setActiveRequest(newActiveReq);
      syncToFirestore(newActiveReq);
    }

    // Mark opportunity accepted in feed
    setJobOpportunities((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'ACCEPTED' } : j))
    );

    showToast(`Job #${opp.issueTitle} Accepted! Ready for travel.`, 'success', 'near_me');
    setCurrentScreen('provider-active-job');
  };

  const declineJobOpportunity = (jobId: string) => {
    setJobOpportunities((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'DECLINED' } : j))
    );
    showToast('Opportunity passed. No ranking or acceptance penalty.', 'info', 'close');
  };

  // Provider begins travel: ACCEPTED -> ON_THE_WAY
  const startProviderTravel = () => {
    if (!activeRequest) return;
    const updated: ServiceRequest = { ...activeRequest, status: 'ON_THE_WAY' };
    setActiveRequest(updated);
    syncToFirestore(updated);
    showToast('Transit telemetry live! Resident notified you are on the way.', 'success', 'two_wheeler');
  };

  // Provider arrives: ON_THE_WAY -> ARRIVED
  const markProviderArrived = () => {
    if (!activeRequest) return;
    const updated: ServiceRequest = { ...activeRequest, status: 'ARRIVED' };
    setActiveRequest(updated);
    syncToFirestore(updated);
    showToast(`Arrived at doorstep! Ask resident for 4-digit PIN.`, 'warning', 'door_front');
  };

  // PIN Verification: ARRIVED -> IN_PROGRESS
  const verifyDoorstepPin = (enteredPin: string): boolean => {
    if (!activeRequest) return false;
    const validPins = [activeRequest.pin, activeRequest.arrivalPin, '4821'].filter(Boolean);
    if (validPins.includes(enteredPin)) {
      const updated: ServiceRequest = { ...activeRequest, status: 'IN_PROGRESS' };
      setActiveRequest(updated);
      syncToFirestore(updated);
      showToast('PIN Verified! Work authorization and toolkit unlocked.', 'success', 'verified_user');
      return true;
    }
    showToast(`Invalid PIN (${enteredPin}). Please check customer screen.`, 'error', 'error');
    return false;
  };

  // Verify Completion PIN and Doorstep Cash
  const verifyCompletionAndCash = (enteredPin: string, cashAmount?: number): boolean => {
    if (!activeRequest) return false;
    const validPins = [activeRequest.completionPin, '7130'].filter(Boolean);
    if (validPins.includes(enteredPin)) {
      const amount = cashAmount ?? activeRequest.totalPayable;
      const completedReq: ServiceRequest = {
        ...activeRequest,
        status: 'COMPLETED',
        paymentStatus: 'paid',
        paymentMethod: 'cash',
        cashCollected: true,
        cashAmountReceived: amount,
        completedAt: 'Just now',
      };
      setActiveRequest(completedReq);
      syncToFirestore(completedReq);

      const netPayout = Math.max(0, amount - cityConfig.pricing.providerFlatFee);
      setProviderEarnings((prev) => ({
        todayGross: prev.todayGross + amount,
        platformCut: prev.platformCut + cityConfig.pricing.providerFlatFee,
        netDirect: prev.netDirect + netPayout,
        jobsDone: prev.jobsDone + 1,
        pendingSettlement: prev.pendingSettlement,
        settledAmount: prev.settledAmount + netPayout,
      }));

      const historyItem: CompletedDispatchSummary = {
        id: `disp-pro-${Date.now()}`,
        orderNumber: activeRequest.id,
        serviceTitle: `${activeRequest.faultType} Diagnostic`,
        customerName: activeRequest.customerName,
        customerAddress: activeRequest.customerAddress,
        durationMinutes: 38,
        grossAmount: amount,
        platformFee: cityConfig.pricing.providerFlatFee,
        netPayout: netPayout,
        rating: 5.0,
        timeAgo: 'Just now',
        status: 'Completed',
        category: activeRequest.category,
        providerId: providerProfile.id,
        providerName: providerProfile.name,
        providerAvatar: providerProfile.profileImage,
        partsUsed: activeRequest.parts,
        laborFee: activeRequest.laborFee,
        paymentMethod: 'cash',
        notes: 'Doorstep cash payment verified via 4-digit Completion PIN handshake.',
      };
      setProviderHistory((prev) => [historyItem, ...prev]);

      showToast(
        `Completion PIN verified! Cash of ₹${amount} received. Receipt released to customer.`,
        'success',
        'payments'
      );
      return true;
    }

    showToast(`Invalid Completion PIN (${enteredPin}). Check resident invoice screen.`, 'error', 'error');
    return false;
  };

  // Add Part to active job
  const addPartToActiveJob = (part: SparePartItem) => {
    if (!activeRequest) return;
    const updatedParts = [...activeRequest.parts, part];
    const partsTotal = updatedParts.reduce((sum, p) => sum + p.price, 0);
    const invoice = calculateJobInvoiceTotal(
      activeRequest.laborFee,
      partsTotal,
      cityConfig.pricing,
      activeRequest.tip || 0
    );

    const updated: ServiceRequest = {
      ...activeRequest,
      parts: updatedParts,
      taxes: invoice.gstTax,
      totalPayable: invoice.grandTotal,
    };
    setActiveRequest(updated);
    syncToFirestore(updated);
    showToast(`Added ${part.name} (₹${part.price}) to bill.`, 'success', 'inventory_2');
  };

  // Remove Part from active job
  const removePartFromActiveJob = (partId: string) => {
    if (!activeRequest) return;
    const updatedParts = activeRequest.parts.filter((p) => p.id !== partId);
    const partsTotal = updatedParts.reduce((sum, p) => sum + p.price, 0);
    const invoice = calculateJobInvoiceTotal(
      activeRequest.laborFee,
      partsTotal,
      cityConfig.pricing,
      activeRequest.tip || 0
    );

    const updated: ServiceRequest = {
      ...activeRequest,
      parts: updatedParts,
      taxes: invoice.gstTax,
      totalPayable: invoice.grandTotal,
    };
    setActiveRequest(updated);
    syncToFirestore(updated);
    showToast('Part removed from active bill.', 'info', 'delete');
  };

  // Update labor fee
  const updateLaborFee = (newFee: number) => {
    if (!activeRequest) return;
    const partsTotal = activeRequest.parts.reduce((sum, p) => sum + p.price, 0);
    const invoice = calculateJobInvoiceTotal(
      newFee,
      partsTotal,
      cityConfig.pricing,
      activeRequest.tip || 0
    );

    const updated: ServiceRequest = {
      ...activeRequest,
      laborFee: newFee,
      taxes: invoice.gstTax,
      totalPayable: invoice.grandTotal,
    };
    setActiveRequest(updated);
    syncToFirestore(updated);
    showToast(`Labor fee updated to ₹${newFee}.`, 'info', 'handyman');
  };

  // Complete Job: IN_PROGRESS -> COMPLETED
  const completeServiceJob = (addedParts?: SparePartItem[], notes?: string) => {
    if (!activeRequest) return;

    const finalParts = addedParts ? [...activeRequest.parts, ...addedParts] : activeRequest.parts;
    const partsTotal = finalParts.reduce((sum, p) => sum + p.price, 0);
    const invoice = calculateJobInvoiceTotal(
      activeRequest.laborFee || 220,
      partsTotal,
      cityConfig.pricing,
      0
    );

    const completedReq: ServiceRequest = {
      ...activeRequest,
      status: 'COMPLETED',
      parts: finalParts,
      taxes: invoice.gstTax,
      totalPayable: invoice.grandTotal,
      completedAt: 'Just now',
    };

    setActiveRequest(completedReq);
    syncToFirestore(completedReq);

    const netPayout = Math.max(0, invoice.grandTotal - cityConfig.pricing.providerFlatFee);

    // Update provider earnings
    setProviderEarnings((prev) => ({
      todayGross: prev.todayGross + invoice.grandTotal,
      platformCut: prev.platformCut + cityConfig.pricing.providerFlatFee,
      netDirect: prev.netDirect + netPayout,
      jobsDone: prev.jobsDone + 1,
      pendingSettlement: prev.pendingSettlement,
      settledAmount: prev.settledAmount + netPayout,
    }));

    // Record in Provider History
    const historyItem: CompletedDispatchSummary = {
      id: `disp-pro-${Date.now()}`,
      orderNumber: activeRequest.id,
      serviceTitle: `${activeRequest.faultType} Diagnostic`,
      customerName: activeRequest.customerName,
      customerAddress: activeRequest.customerAddress,
      durationMinutes: 38,
      grossAmount: invoice.grandTotal,
      platformFee: cityConfig.pricing.providerFlatFee,
      netPayout: netPayout,
      rating: 5.0,
      timeAgo: 'Just now',
      status: 'Completed',
      category: activeRequest.category,
      providerId: providerProfile.id,
      providerName: providerProfile.name,
      providerAvatar: providerProfile.profileImage,
      partsUsed: finalParts,
      laborFee: activeRequest.laborFee,
      notes: notes || 'Diagnosed, replaced faulty components, and tested circuit safely under load.',
    };

    setProviderHistory((prev) => [historyItem, ...prev]);

    showToast(
      `Job Completed! Earned ₹${netPayout} net. Service estimate & receipt sent to resident.`,
      'success',
      'task_alt'
    );

    if (role === 'customer') {
      setCurrentScreen('service-invoice');
    } else {
      setCurrentScreen('provider-dashboard');
    }
  };

  // Submit Invoice Payment (Customer action)
  const submitInvoicePayment = ({
    rating,
    tip,
    method,
    feedbackTags,
  }: {
    rating: number;
    tip: number;
    method: 'upi' | 'cash' | 'card';
    feedbackTags: string[];
  }) => {
    if (!activeRequest) return;

    const assignedPro = providers.find((p) => p.id === activeRequest.assignedProviderId) || providers[0];
    const grandAmount = activeRequest.totalPayable + tip;
    const netPayout = grandAmount - cityConfig.pricing.providerFlatFee;

    const summary: CompletedDispatchSummary = {
      id: `disp-${Date.now()}`,
      orderNumber: activeRequest.id,
      serviceTitle: `${activeRequest.faultType} Diagnostic`,
      customerName: activeRequest.customerName,
      customerAddress: activeRequest.customerAddress,
      durationMinutes: 38,
      grossAmount: grandAmount,
      platformFee: cityConfig.pricing.providerFlatFee,
      netPayout: netPayout,
      rating: rating,
      timeAgo: 'Just completed',
      status: 'Completed',
      category: activeRequest.category,
      providerId: activeRequest.assignedProviderId || assignedPro.id,
      providerName: `${assignedPro.name} (${assignedPro.category})`,
      providerAvatar: assignedPro.avatar,
      partsUsed: activeRequest.parts,
      laborFee: activeRequest.laborFee,
      paymentMethod: method,
    };

    setPastRequests((prev) => [summary, ...prev]);

    // Also update provider history if matching
    setProviderHistory((prev) => {
      const exists = prev.some((p) => p.orderNumber === activeRequest.id);
      if (exists) {
        return prev.map((p) =>
          p.orderNumber === activeRequest.id
            ? { ...p, rating, grossAmount: grandAmount, netPayout, paymentMethod: method }
            : p
        );
      }
      return [summary, ...prev];
    });

    setActiveRequest((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        paymentStatus: 'paid' as const,
        rating,
        tip,
        paymentMethod: method,
        feedbackTags,
      };
      syncToFirestore(updated);
      return updated;
    });

    const sim = simulationService.simulatePayment({
      amount: grandAmount,
      method,
      currencySymbol: cityConfig.currencySymbol,
    });
    showToast(sim.message, 'success', 'check_circle');
    setCurrentScreen('activity-history');
  };

  const cancelActiveRequest = () => {
    if (activeRequest) {
      const updated: ServiceRequest = { ...activeRequest, status: 'CANCELLED' };
      setActiveRequest(updated);
      syncToFirestore(updated);
    }
    showToast('Booking cancelled. No fee charged.', 'info', 'cancel');
    setCurrentScreen(role === 'provider' ? 'provider-dashboard' : 'home');
  };

  const reBookProvider = (providerId: string, category: string) => {
    setSelectedProviderId(providerId);
    setSelectedCategory(category);
    showToast('Pre-selected technician for request', 'info', 'handyman');
    setCurrentScreen('request-form');
  };

  const resetDemoState = () => {
    localStorage.clear();
    setActiveRequest(INITIAL_ACTIVE_REQUEST);
    syncToFirestore(INITIAL_ACTIVE_REQUEST);
    setPastRequests(MOCK_PAST_DISPATCHES);
    setProviderProfile(DEFAULT_LOGGED_IN_PROVIDER);
    setProviderHistory(
      MOCK_PAST_DISPATCHES.filter(
        (d) => d.providerId === 'rahul-kumar' || d.providerName.includes('Rahul')
      )
    );
    setProviderDutyStatusState('online');
    setProviderEarnings({
      todayGross: 1480,
      platformCut: 60,
      netDirect: 1420,
      jobsDone: 3,
      pendingSettlement: 0,
      settledAmount: 8450,
    });
    setJobOpportunities(MOCK_JOB_OPPORTUNITIES);
    setRoleState('customer');
    const defaultCluster =
      cityConfig.clusters.find((c) => c.id === cityConfig.defaultClusterId) || cityConfig.clusters[0];
    setCurrentLocationState(defaultCluster);
    showToast('Demo state reset to default active booking', 'info', 'restart_alt');
    setCurrentScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentScreen,
        navigateTo,
        selectedCategory,
        setSelectedCategory,
        selectedProviderId,
        setSelectedProviderId,
        selectedFaultType,
        setSelectedFaultType,
        providers,
        activeRequest,
        pastRequests,
        providerDutyStatus,
        setProviderDutyStatus,
        providerProfile,
        setProviderProfile,
        updateProviderProfile,
        providerEarnings,
        setProviderEarnings,
        providerHistory,
        jobOpportunities,
        selectedOpportunityId,
        setSelectedOpportunityId,
        acceptJobOpportunity,
        declineJobOpportunity,
        startProviderTravel,
        markProviderArrived,
        verifyDoorstepPin,
        verifyCompletionAndCash,
        isFirebaseConnected,
        addPartToActiveJob,
        removePartFromActiveJob,
        updateLaborFee,
        completeServiceJob,
        registerProvider,
        loginProvider,
        cityConfig,
        setCity,
        availableCities,
        currentLocation,
        setCurrentLocation,
        toasts,
        showToast,
        removeToast,
        createServiceRequest,
        acceptRequestAsProvider,
        submitInvoicePayment,
        cancelActiveRequest,
        reBookProvider,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
