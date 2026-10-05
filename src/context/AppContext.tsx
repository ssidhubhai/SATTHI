import React, { createContext, useContext, useState, useEffect } from 'react';
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
} from '../types';
import {
  MOCK_PROVIDERS,
  INITIAL_ACTIVE_REQUEST,
  MOCK_PAST_DISPATCHES,
} from '../data/mockData';
import { DEFAULT_ACTIVE_CITY, AVAILABLE_CITIES } from '../config/cityConfig';
import { dataLayer } from '../data/dataLayer';
import { simulationService } from '../services/simulationService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentScreen: string;
  navigateTo: (screen: string, params?: { categoryId?: string; providerId?: string; faultType?: string }) => void;
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
  providerEarnings: {
    todayGross: number;
    platformCut: number;
    netDirect: number;
    jobsDone: number;
  };
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
  markProviderArrived: () => void;
  verifyDoorstepPin: (enteredPin: string) => boolean;
  completeServiceJob: (addedParts?: SparePartItem[]) => void;
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
  const [currentLocation, setCurrentLocationState] = useState<LocationCluster>(() => {
    const defaultCluster = cityConfig.clusters.find((c) => c.id === cityConfig.defaultClusterId);
    return defaultCluster || cityConfig.clusters[0];
  });
  const [providers, setProviders] = useState<Provider[]>(() => {
    dataLayer.setCity(cityConfig);
    return dataLayer.getProviders(undefined, cityConfig.defaultClusterId);
  });
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

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

  const [providerDutyStatus, setProviderDutyStatusState] = useState<ProviderDutyStatus>(() => {
    const saved = localStorage.getItem('satthi_provider_duty');
    return (saved as ProviderDutyStatus) || 'online';
  });

  const [providerEarnings, setProviderEarnings] = useState({
    todayGross: 1480,
    platformCut: 60,
    netDirect: 1420,
    jobsDone: 3,
  });

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
    localStorage.setItem('satthi_provider_duty', providerDutyStatus);
  }, [providerDutyStatus]);

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
      showToast('Switched to Provider Mode (Rahul Kumar)', 'info', 'engineering');
      if (activeRequest && (activeRequest.status === 'ON_THE_WAY' || activeRequest.status === 'ARRIVED' || activeRequest.status === 'IN_PROGRESS')) {
        setCurrentScreen('provider-active-job');
      } else {
        setCurrentScreen('provider-dashboard');
      }
    } else {
      showToast(`Switched to Customer Mode (${cityConfig.demoUser.name})`, 'info', 'person');
      if (activeRequest && (activeRequest.status === 'ON_THE_WAY' || activeRequest.status === 'ARRIVED' || activeRequest.status === 'IN_PROGRESS')) {
        setCurrentScreen('live-tracking');
      } else {
        setCurrentScreen('home');
      }
    }
  };

  const navigateTo = (screen: string, params?: { categoryId?: string; providerId?: string }) => {
    if (params?.categoryId) setSelectedCategory(params.categoryId);
    if (params?.providerId) setSelectedProviderId(params.providerId);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setProviderDutyStatus = (status: ProviderDutyStatus) => {
    setProviderDutyStatusState(status);
    setProviders((prev) =>
      prev.map((p) => (p.id === 'rahul-kumar' ? { ...p, isAvailable: status === 'online' } : p))
    );
    const label = status === 'online' ? 'Active & Receiving Jobs' : status === 'busy' ? 'On Assignment' : 'Resting (Offline)';
    showToast(`Duty Status: ${label}`, status === 'online' ? 'success' : 'info', 'radio_button_checked');
  };

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

    const newReq: ServiceRequest = {
      id: `STH-${Math.floor(1000 + Math.random() * 9000)}`,
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
      pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      visitFee: foundPro.visitFee || cityConfig.pricing.baseInspectionFee,
      laborFee: 220,
      parts: [
        {
          id: 'part-mcb-32a',
          name: 'Schneider Electric 32A C-Curve MCB',
          price: 210,
          brand: 'Schneider',
          verifiedMSRP: true,
          inStock: true,
        },
      ],
      platformFee: cityConfig.pricing.platformSafetyFee,
      discount: cityConfig.pricing.firstTimeDiscount,
      taxes: Math.round((cityConfig.pricing.platformSafetyFee * cityConfig.pricing.gstPercent) / 100),
      totalPayable: 448,
      paymentStatus: 'pending',
      createdAt: 'Just now',
      etaMinutesRemaining: foundPro.etaMinutes || 12,
      dispatchZone: `${currentLocation.name} Cluster`,
      invoiceNumber: `SAT-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setActiveRequest(newReq);
    showToast(`Radar searching nearby ${reqCat}s in ${currentLocation.name}...`, 'info', 'radar');
    setCurrentScreen('matching-radar');
  };

  const acceptRequestAsProvider = () => {
    if (!activeRequest) return;
    setActiveRequest((prev) => (prev ? { ...prev, status: 'ON_THE_WAY' } : null));
    showToast(`Order Accepted! Navigation route to ${activeRequest.customerAddress.split(',')[0]} loaded.`, 'success', 'near_me');
  };

  const markProviderArrived = () => {
    if (!activeRequest) return;
    setActiveRequest((prev) => (prev ? { ...prev, status: 'ARRIVED' } : null));
    const proName = providers.find((p) => p.id === activeRequest.assignedProviderId)?.name || 'Technician';
    showToast(`${proName} arrived at doorstep. Please share 4-digit PIN.`, 'warning', 'door_front');
  };

  const verifyDoorstepPin = (enteredPin: string): boolean => {
    if (!activeRequest) return false;
    if (enteredPin === activeRequest.pin || enteredPin === '4821') {
      setActiveRequest((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
      showToast('Doorstep Handshake Verified! Service in progress.', 'success', 'verified_user');
      return true;
    }
    showToast(`Invalid PIN (${enteredPin}). Please check customer screen.`, 'error', 'error');
    return false;
  };

  const completeServiceJob = (addedParts?: SparePartItem[]) => {
    if (!activeRequest) return;

    const finalParts = addedParts ? [...activeRequest.parts, ...addedParts] : activeRequest.parts;
    const partsTotal = finalParts.reduce((sum, p) => sum + p.price, 0);
    const calculatedPayable = (activeRequest.visitFee || 99) + (activeRequest.laborFee || 220) + partsTotal;

    const completedReq: ServiceRequest = {
      ...activeRequest,
      status: 'COMPLETED',
      parts: finalParts,
      totalPayable: calculatedPayable,
      completedAt: 'Just now',
    };

    setActiveRequest(completedReq);
    setProviderEarnings((prev) => ({
      todayGross: prev.todayGross + calculatedPayable,
      platformCut: prev.platformCut + 20,
      netDirect: prev.netDirect + (calculatedPayable - 20),
      jobsDone: prev.jobsDone + 1,
    }));

    showToast('[Demo Mode] Job marked Completed! Itemized service receipt generated.', 'success', 'receipt_long');

    if (role === 'customer') {
      setCurrentScreen('service-invoice');
    } else {
      setCurrentScreen('provider-dashboard');
    }
  };

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
    const summary: CompletedDispatchSummary = {
      id: `disp-${Date.now()}`,
      orderNumber: activeRequest.id,
      serviceTitle: `${activeRequest.faultType} Diagnostic`,
      customerName: activeRequest.customerName,
      customerAddress: activeRequest.customerAddress,
      durationMinutes: 38,
      grossAmount: activeRequest.totalPayable + tip,
      platformFee: 20,
      netPayout: activeRequest.totalPayable + tip - 20,
      rating: rating,
      timeAgo: 'Just completed',
      status: 'Completed',
      category: activeRequest.category,
      providerId: activeRequest.assignedProviderId || assignedPro.id,
      providerName: `${assignedPro.name} (${assignedPro.category})`,
      providerAvatar: assignedPro.avatar,
    };

    setPastRequests((prev) => [summary, ...prev]);

    setActiveRequest((prev) =>
      prev
        ? {
            ...prev,
            paymentStatus: 'paid',
            rating,
            tip,
            paymentMethod: method,
            feedbackTags,
          }
        : null
    );

    const sim = simulationService.simulatePayment({
      amount: activeRequest.totalPayable + tip,
      method,
      currencySymbol: cityConfig.currencySymbol,
    });
    showToast(sim.message, 'success', 'check_circle');
    setCurrentScreen('activity-history');
  };

  const cancelActiveRequest = () => {
    if (activeRequest) {
      setActiveRequest((prev) => (prev ? { ...prev, status: 'CANCELLED' } : null));
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
    setPastRequests(MOCK_PAST_DISPATCHES);
    setProviderDutyStatusState('online');
    setProviderEarnings({
      todayGross: 1480,
      platformCut: 60,
      netDirect: 1420,
      jobsDone: 3,
    });
    setRoleState('customer');
    const defaultCluster = cityConfig.clusters.find((c) => c.id === cityConfig.defaultClusterId) || cityConfig.clusters[0];
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
        providerEarnings,
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
        markProviderArrived,
        verifyDoorstepPin,
        completeServiceJob,
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
