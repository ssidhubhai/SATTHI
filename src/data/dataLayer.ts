import {
  DEFAULT_ACTIVE_CITY,
  AVAILABLE_CITIES,
  calculateJobInvoiceTotal,
  formatCurrency,
} from '../config/cityConfig';
import {
  SERVICE_CATEGORIES,
  MOCK_PROVIDERS,
  AUTHORIZED_SPARE_PARTS,
  MOCK_PAST_DISPATCHES,
  SATTHI_LOGO_URL,
  CUSTOMER_AVATAR,
  PRO_RAHUL_AVATAR,
  MAP_RADAR_IMAGE,
  MAP_DETAIL_IMAGE,
  BEFORE_FAULT_PHOTO,
  AFTER_FIXED_PHOTO,
} from './mockData';
import {
  CityConfig,
  ServiceCategory,
  Provider,
  SparePartItem,
  LocationCluster,
  CompletedDispatchSummary,
  CityPricingConfig,
} from '../types';

export class ServiceDataLayer {
  private activeCity: CityConfig;

  constructor(cityConfig: CityConfig = DEFAULT_ACTIVE_CITY) {
    this.activeCity = cityConfig;
  }

  // ==========================================
  // 1. CITY CONFIGURATION LAYER
  // ==========================================
  public getCity(): CityConfig {
    return this.activeCity;
  }

  public setCity(cityOrId: CityConfig | string): void {
    if (typeof cityOrId === 'string') {
      const found = AVAILABLE_CITIES[cityOrId];
      if (found) {
        this.activeCity = found;
      }
    } else {
      this.activeCity = cityOrId;
    }
  }

  public getAvailableCities(): CityConfig[] {
    return Object.values(AVAILABLE_CITIES);
  }

  public getCityPricing(): CityPricingConfig {
    return this.activeCity.pricing;
  }

  // ==========================================
  // 2. AREAS & CLUSTERS LAYER
  // ==========================================
  public getClusters(): LocationCluster[] {
    return this.activeCity.clusters;
  }

  public getClusterById(id: string): LocationCluster | undefined {
    return this.activeCity.clusters.find((c: LocationCluster) => c.id === id);
  }

  public getDefaultCluster(): LocationCluster {
    const found = this.activeCity.clusters.find((c: LocationCluster) => c.id === this.activeCity.defaultClusterId);
    return found || this.activeCity.clusters[0];
  }

  public getTrafficCorridor(clusterId?: string): string {
    const cluster = clusterId ? this.getClusterById(clusterId) : this.getDefaultCluster();
    return cluster?.trafficCorridor || `${cluster?.name || this.activeCity.name} Transit Corridor`;
  }

  // ==========================================
  // 3. PROVIDERS & CATALOG LAYER
  // ==========================================
  public getProviders(
    filters?: {
      category?: string;
      verifiedOnly?: boolean;
      availableOnly?: boolean;
      searchQuery?: string;
      maxDistanceKm?: number;
    },
    userClusterId?: string
  ): Provider[] {
    const currentCluster = userClusterId
      ? this.getClusterById(userClusterId) || this.getDefaultCluster()
      : this.getDefaultCluster();

    let list = MOCK_PROVIDERS.map((p) => {
      // Dynamically calculate realistic distance relative to active cluster
      const dynamicDistance = this.calculateProviderDistanceKm(p, currentCluster);
      const dynamicEta = this.calculateEtaForDistance(dynamicDistance, currentCluster.trafficCondition);

      // Adapt vehicle plate state prefix to active city
      const statePrefix = this.activeCity.id === 'mumbai' ? 'MH' : this.activeCity.id === 'delhi' ? 'DL' : 'KA';
      const adaptedPlate = p.vehicle.plate.replace(/^(KA|MH|DL)/, statePrefix);

      return {
        ...p,
        distanceKm: dynamicDistance,
        etaMinutes: dynamicEta,
        vehicle: {
          ...p.vehicle,
          plate: adaptedPlate,
        },
      };
    });

    if (filters?.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters?.verifiedOnly) {
      list = list.filter((p) => p.isGovtCertified && p.isBackgroundVerified);
    }

    if (filters?.availableOnly) {
      list = list.filter((p) => p.isAvailable);
    }

    if (filters?.maxDistanceKm) {
      list = list.filter((p) => p.distanceKm <= filters.maxDistanceKm!);
    }

    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public getProviderById(id: string, userClusterId?: string): Provider | undefined {
    const all = this.getProviders(undefined, userClusterId);
    return all.find((p) => p.id === id);
  }

  public getNearbyProsForRadar(clusterId?: string, category: string = 'electrician') {
    const pros = this.getProviders({ category }, clusterId).slice(0, 3);
    const positions = [
      { top: '22%', left: '64%' },
      { top: '68%', left: '16%' },
      { top: '18%', left: '18%' },
    ];

    return pros.map((pro, idx) => ({
      ...pro,
      position: positions[idx] || { top: '50%', left: '50%' },
    }));
  }

  // ==========================================
  // 4. SERVICES LAYER
  // ==========================================
  public getCategories(): ServiceCategory[] {
    return SERVICE_CATEGORIES;
  }

  public getCategoryById(id: string): ServiceCategory | undefined {
    return SERVICE_CATEGORIES.find((cat) => cat.id === id);
  }

  public getSpareParts(): SparePartItem[] {
    return AUTHORIZED_SPARE_PARTS;
  }

  public getPastDispatches(): CompletedDispatchSummary[] {
    return MOCK_PAST_DISPATCHES;
  }

  // ==========================================
  // 5. PRICING ENGINE LAYER
  // ==========================================
  public calculateInvoice(laborFee: number, partsTotal: number, tip: number = 0) {
    return calculateJobInvoiceTotal(laborFee, partsTotal, this.activeCity.pricing, tip);
  }

  public isInspectionFeeWaived(laborFee: number, partsTotal: number): boolean {
    return laborFee + partsTotal >= this.activeCity.pricing.inspectionWaiveThreshold;
  }

  public getWarrantyDays(): number {
    return this.activeCity.pricing.warrantyDays;
  }

  // ==========================================
  // 6. DISTANCES & ETA CALCULATION
  // ==========================================
  public calculateProviderDistanceKm(provider: Provider, userCluster: LocationCluster): number {
    // If provider has base cluster, calculate distance between cluster coordinates
    if (provider.baseClusterId && userCluster.coordinates) {
      const baseCluster = this.getClusterById(provider.baseClusterId);
      if (baseCluster?.coordinates) {
        const dLat = (userCluster.coordinates.lat - baseCluster.coordinates.lat) * 111;
        const dLng =
          (userCluster.coordinates.lng - baseCluster.coordinates.lng) *
          111 *
          Math.cos((userCluster.coordinates.lat * Math.PI) / 180);
        const directKm = Math.sqrt(dLat * dLat + dLng * dLng);
        // City road tortuosity factor ~1.3
        const roadDistance = Math.max(0.4, Number((directKm * 1.3).toFixed(1)));
        return roadDistance;
      }
    }

    // Default realistic neighborhood proximity (0.6 km to 2.2 km)
    const baseOffset = (provider.id.charCodeAt(0) % 5) * 0.3;
    return Number((0.6 + baseOffset).toFixed(1));
  }

  public calculateEtaForDistance(
    distanceKm: number,
    trafficCondition: 'clear' | 'moderate' | 'dense' = 'clear'
  ): number {
    const speedKmH = trafficCondition === 'dense' ? 14 : trafficCondition === 'moderate' ? 20 : 26;
    const transitMinutes = Math.round((distanceKm / speedKmH) * 60);
    // Add 3-5 mins dispatch preparation & bike start time
    return Math.max(8, transitMinutes + 4);
  }

  public formatDistance(distanceKm: number): string {
    return `${distanceKm} km`;
  }

  // ==========================================
  // 7. SURGE & AVAILABILITY ENGINE
  // ==========================================
  public getSurgeInfo(clusterId?: string): {
    isSurgeActive: boolean;
    surgeMultiplier: number;
    surgeReason: string;
  } {
    const cluster = clusterId ? this.getClusterById(clusterId) : this.getDefaultCluster();
    return {
      isSurgeActive: Boolean(cluster?.surgeActive),
      surgeMultiplier: cluster?.surgeMultiplier || 1.0,
      surgeReason: cluster?.surgeReason || 'Normal demand levels',
    };
  }

  public getAvailabilityInfo(
    clusterId?: string,
    categoryId?: string
  ): {
    activeProsCount: number;
    avgArrivalMins: number;
    statusText: string;
  } {
    const cluster = clusterId ? this.getClusterById(clusterId) : this.getDefaultCluster();
    const count = cluster?.activeProsCount || 10;
    const mins = cluster?.avgArrivalMins || 15;
    return {
      activeProsCount: count,
      avgArrivalMins: mins,
      statusText: `${count} Pros Active (~${mins}m arrival)`,
    };
  }
}

export const dataLayer = new ServiceDataLayer();

export {
  calculateJobInvoiceTotal,
  formatCurrency,
  SATTHI_LOGO_URL,
  CUSTOMER_AVATAR,
  PRO_RAHUL_AVATAR,
  MAP_RADAR_IMAGE,
  MAP_DETAIL_IMAGE,
  BEFORE_FAULT_PHOTO,
  AFTER_FIXED_PHOTO,
};
