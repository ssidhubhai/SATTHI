import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MAP_DETAIL_IMAGE } from '../data/mockData';
import { Provider } from '../types';
import { LocationDrawer } from './LocationDrawer';

export const CategoryDetails: React.FC = () => {
  const {
    navigateTo,
    setSelectedProviderId,
    providers,
    createServiceRequest,
    selectedCategory,
    currentLocation,
    showToast,
    cityConfig,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'available' | 'distance' | 'rating' | 'rate' | 'rapid'>('available');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isAutoDispatching, setIsAutoDispatching] = useState(false);
  const [selectedMapPro, setSelectedMapPro] = useState<Provider | null>(null);
  const [showLocationDrawer, setShowLocationDrawer] = useState(false);

  // Filter pros by category
  const categoryPros = providers.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const displayPros = categoryPros.length > 0 ? categoryPros : providers;

  const filteredPros = displayPros.filter((p) => {
    if (activeFilter === 'available') return p.isAvailable;
    if (activeFilter === 'distance') return p.distanceKm <= 1.5;
    if (activeFilter === 'rating') return p.rating >= 4.8;
    if (activeFilter === 'rate') return p.visitFee <= 99;
    if (activeFilter === 'rapid') return p.etaMinutes <= 15;
    return true;
  });

  const categoryName =
    selectedCategory === 'plumber'
      ? 'Plumbers'
      : selectedCategory === 'carpenter'
      ? 'Carpenters'
      : selectedCategory === 'appliance-ac'
      ? 'Appliance & AC Technicians'
      : selectedCategory === 'cleaning'
      ? 'Cleaning Specialists'
      : 'Electricians';

  const handleRequest = (providerId: string) => {
    setSelectedProviderId(providerId);
    navigateTo('request-form', { categoryId: selectedCategory, providerId });
  };

  const handleProfile = (providerId: string) => {
    setSelectedProviderId(providerId);
    navigateTo('provider-profile', { providerId });
  };

  const handleAutoDispatch = () => {
    setIsAutoDispatching(true);
    showToast('Matching closest available certified technician...', 'info', 'radar');
    setTimeout(() => {
      setIsAutoDispatching(false);
      createServiceRequest({
        faultType: `Immediate ${categoryName.slice(0, -1)} Emergency Auto-Dispatch`,
        description: `Auto-dispatched nearest available pro in ${currentLocation.name}.`,
        urgency: 'immediate',
        category: selectedCategory,
        providerId: filteredPros[0]?.id || 'rahul-kumar',
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      {/* Top Context & Live Radius Banner */}
      <section className="px-margin pt-space-md flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs min-w-0">
            <span className="p-1 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">
                {selectedCategory === 'plumber' ? 'plumbing' : 'bolt'}
              </span>
            </span>
            <div
              className="flex flex-col min-w-0 cursor-pointer"
              onClick={() => setShowLocationDrawer(true)}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  {categoryName} in {currentLocation.name}
                </span>
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                  verified
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary truncate flex items-center gap-1">
                <span>{currentLocation.area}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
              </p>
            </div>
          </div>
          <button
            aria-label="Change location"
            onClick={() => setShowLocationDrawer(true)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-sm text-label-sm flex items-center gap-1 active:scale-95 transition-transform shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">my_location</span>
            <span>GPS</span>
          </button>
        </div>

        {/* Live Telemetry Pill */}
        <div className="flex items-center justify-between bg-surface-container-lowest p-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {filteredPros.length} Verified Techs Available Now
            </span>
          </div>
          <span className="font-body-sm text-body-sm text-secondary bg-surface-container px-2 py-0.5 rounded-full font-medium">
            Within 3.0 km
          </span>
        </div>

        {/* Filter & Sort Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-margin px-margin">
          <button
            onClick={() => setActiveFilter('available')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer font-medium ${
              activeFilter === 'available'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
            <span>Available Now</span>
          </button>

          <button
            onClick={() => setActiveFilter('distance')}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer font-medium ${
              activeFilter === 'distance'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span>Distance &lt; 1.5 km</span>
            <span className="material-symbols-outlined text-[14px]">tune</span>
          </button>

          <button
            onClick={() => setActiveFilter('rating')}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer font-medium ${
              activeFilter === 'rating'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">
              star
            </span>
            <span>4.8+ Rated</span>
          </button>

          <button
            onClick={() => setActiveFilter('rate')}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer font-medium ${
              activeFilter === 'rate'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span>Visit: {cityConfig.currencySymbol}{cityConfig.pricing.baseInspectionFee}</span>
          </button>

          <button
            onClick={() => setActiveFilter('rapid')}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer font-medium ${
              activeFilter === 'rapid'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-lowest text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
            <span>Rapid (&lt;15m)</span>
          </button>
        </div>
      </section>

      {/* Mini Radar / Map Strip or Full Map View */}
      {viewMode === 'list' ? (
        <section className="px-margin mt-space-md">
          <div className="relative w-full h-[142px] rounded-xl overflow-hidden bg-surface-container-high shadow-inner">
            <div
              className="w-full h-full bg-cover bg-center filter saturate-150 brightness-95 opacity-80"
              style={{ backgroundImage: `url('${MAP_DETAIL_IMAGE}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent pointer-events-none"></div>

            {/* User Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center text-on-primary shadow-md">
                  <span className="material-symbols-outlined text-[12px]">person_pin_circle</span>
                </span>
              </span>
              <span className="mt-0.5 px-1.5 py-0.5 rounded bg-surface/90 text-on-surface font-label-sm text-[9px] shadow-sm font-bold">
                You (12th Main)
              </span>
            </div>

            {/* Tech Pin 1 */}
            {filteredPros[0] && (
              <div
                onClick={() => handleProfile(filteredPros[0].id)}
                className="absolute top-5 left-10 flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-md animate-bounce cursor-pointer"
                style={{ animationDuration: '3s' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  {filteredPros[0].name.split(' ')[0]} ({filteredPros[0].distanceKm} km)
                </span>
              </div>
            )}

            {/* Tech Pin 2 */}
            {filteredPros[1] && (
              <div
                onClick={() => handleProfile(filteredPros[1].id)}
                className="absolute bottom-5 right-8 flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-md cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-bold">
                  {filteredPros[1].name.split(' ')[0]} ({filteredPros[1].distanceKm} km)
                </span>
              </div>
            )}

            {/* Map/List Dual Toggle Floating in Corner */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center bg-surface-container-lowest/95 backdrop-blur-md p-0.5 rounded-lg shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-bold ${
                  viewMode === 'list'
                    ? 'bg-primary text-on-primary'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">format_list_bulleted</span>
                <span>List</span>
              </button>
              <button
                onClick={() => {
                  setViewMode('map');
                  showToast('Interactive tactical map opened', 'info', 'map');
                }}
                className="px-2 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-bold text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[13px]">map</span>
                <span>Full Map</span>
              </button>
            </div>

            <div className="absolute top-2.5 right-2.5 bg-surface-container-lowest/90 px-2 py-0.5 rounded-full font-label-sm text-label-sm text-secondary font-medium">
              Simulated GPS Radar (Demo)
            </div>
          </div>
        </section>
      ) : (
        /* Full Interactive Map View */
        <section className="px-margin mt-space-md animate-in fade-in">
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-surface-container-high shadow-lg">
            <div
              className="w-full h-full bg-cover bg-center filter saturate-150 brightness-95"
              style={{ backgroundImage: `url('${MAP_DETAIL_IMAGE}')` }}
            />
            <div className="absolute inset-0 bg-black/15 pointer-events-none"></div>

            {/* Toggle Switch */}
            <div className="absolute top-3 left-3 flex items-center bg-surface-container-lowest/95 backdrop-blur-md p-0.5 rounded-lg shadow-md z-20">
              <button
                onClick={() => setViewMode('list')}
                className="px-2.5 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-bold text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className="px-2.5 py-1 rounded font-label-sm text-label-sm flex items-center gap-1 cursor-pointer font-bold bg-primary text-on-primary"
              >
                <span className="material-symbols-outlined text-[14px]">map</span>
                <span>Full Map</span>
              </button>
            </div>

            {/* User Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <span className="relative flex h-7 w-7">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                <span className="relative inline-flex rounded-full h-7 w-7 bg-primary items-center justify-center text-on-primary shadow-xl ring-2 ring-white">
                  <span className="material-symbols-outlined text-[16px]">person_pin_circle</span>
                </span>
              </span>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/95 text-on-surface font-label-sm text-xs shadow-md font-bold">
                You (12th Main)
              </span>
            </div>

            {/* Interactive Provider Markers */}
            {filteredPros.map((pro, idx) => {
              const offsets = [
                { top: '22%', left: '26%' },
                { top: '68%', left: '72%' },
                { top: '28%', left: '68%' },
                { top: '74%', left: '24%' },
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = selectedMapPro?.id === pro.id;

              return (
                <div
                  key={pro.id}
                  onClick={() => setSelectedMapPro(pro)}
                  className={`absolute z-20 cursor-pointer flex flex-col items-center transition-transform active:scale-95 ${
                    isSelected ? 'scale-110 z-30' : ''
                  }`}
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="relative">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className={`w-9 h-9 rounded-full object-cover shadow-lg border-2 ${
                        isSelected ? 'border-primary ring-4 ring-primary/40' : 'border-white'
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1 ring-white ${
                        pro.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    ></span>
                  </div>
                  <span className="mt-0.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/95 text-on-surface font-label-sm text-[10px] font-bold shadow-md whitespace-nowrap">
                    {pro.name.split(' ')[0]} • {pro.distanceKm}km
                  </span>
                </div>
              );
            })}

            {/* Selected Provider Bottom Slider Card */}
            {selectedMapPro && (
              <div className="absolute bottom-3 inset-x-3 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-xl shadow-xl border border-surface-container flex items-center justify-between gap-3 z-30 animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={selectedMapPro.avatar}
                    alt={selectedMapPro.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 bg-surface-container"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                        {selectedMapPro.name}
                      </h4>
                      <span className="text-amber-500 font-bold text-xs flex items-center">
                        ★ {selectedMapPro.rating}
                      </span>
                    </div>
                    <p className="font-body-sm text-[11px] text-secondary truncate">
                      {selectedMapPro.distanceKm} km away • {selectedMapPro.etaMinutes} mins arrival
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleProfile(selectedMapPro.id)}
                    className="px-2.5 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleRequest(selectedMapPro.id)}
                    className="px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Provider Cards Feed */}
      <section className="px-margin mt-space-md flex flex-col gap-space-md">
        {filteredPros.map((pro, index) => {
          const isFastest = index === 0;

          return (
            <article
              key={pro.id}
              className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container/60 flex flex-col gap-3 hover:shadow-sm transition-all relative overflow-hidden"
            >
              {isFastest && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white font-label-sm text-[10px] px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[11px]">near_me</span>
                  FASTEST ARRIVAL
                </div>
              )}

              {/* Header Row */}
              <div className="flex items-start justify-between gap-space-sm pt-1">
                <div className="flex items-start gap-space-sm">
                  <div className="relative flex-shrink-0">
                    <img
                      className="w-12 h-12 rounded-full object-cover bg-surface-container ring-1 ring-surface-container-high"
                      alt={pro.name}
                      src={pro.avatar}
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-surface-container-lowest ${
                        pro.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    ></span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-headline-sm text-base text-on-surface font-extrabold tracking-tight">
                        {pro.name}
                      </span>
                      {pro.isGovtCertified && (
                        <span
                          className="material-symbols-outlined text-tertiary text-[17px]"
                          title="Govt ITI & Background Cleared"
                        >
                          verified
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-xs text-secondary truncate mt-0.5">
                      {pro.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
                      <span>{pro.experienceYears} yrs exp</span>
                      <span>·</span>
                      <span>{pro.vehicle.model}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-label-md text-xs text-on-surface font-bold flex items-center justify-end gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-[16px] fill-1">
                      star
                    </span>{' '}
                    {pro.rating}
                  </span>
                  <span className="font-body-sm text-[11px] text-secondary">
                    {pro.reviewCount} reviews
                  </span>
                </div>
              </div>

              {/* Telemetry Indicator */}
              <div className="flex items-center justify-between py-2 px-2.5 bg-surface-container-low rounded-lg border border-surface-container/60 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pro.isAvailable ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
                    }`}
                  ></span>
                  <span
                    className={`font-label-md font-semibold ${
                      pro.isAvailable ? 'text-emerald-800' : 'text-amber-800'
                    }`}
                  >
                    {pro.isAvailable ? 'Available Right Now' : 'Engaged on Job'}
                  </span>
                  <span className="text-secondary font-bold">·</span>
                  <span className="font-body-sm text-on-surface font-medium">
                    {pro.distanceKm} km away
                  </span>
                </div>
                <span className="font-label-sm text-primary font-bold">
                  ~{pro.etaMinutes} min arrival
                </span>
              </div>

              {/* Specialties Chips */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {pro.specialties.map((spec, sIdx) => (
                  <span
                    key={sIdx}
                    className="font-label-sm text-[11px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Transparent Pricing Breakdown */}
              <div className="bg-surface-container-low/70 rounded-xl p-2.5 flex items-center justify-between border border-surface-container/60">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-label-sm text-xs text-secondary">Visit Fee:</span>
                    <span className="font-data-metric text-lg text-on-surface font-bold">
                      {cityConfig.currencySymbol}{pro.visitFee}
                    </span>
                  </div>
                  <p className="font-body-sm text-[11px] text-secondary">
                    {pro.visitFee === cityConfig.pricing.baseInspectionFee
                      ? `Waived if service > ${cityConfig.currencySymbol}${cityConfig.pricing.inspectionWaiveThreshold} · Est repair: ${cityConfig.currencySymbol}150–${cityConfig.currencySymbol}350`
                      : 'Includes diagnostic inspection kit'}
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-label-sm text-[10px] font-bold">
                  {isFastest ? 'SATTHI Assured' : 'Zero Surprise Policy'}
                </span>
              </div>

              {/* Card CTA Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleRequest(pro.id)}
                  className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <span>Request {pro.name.split(' ')[0]}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => handleProfile(pro.id)}
                  aria-label={`${pro.name}'s details`}
                  className="h-11 px-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-xs font-semibold flex items-center justify-center active:scale-95 transition-transform cursor-pointer border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">info</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Neighborhood Community Note */}
      <section className="px-margin mt-space-lg mb-space-sm">
        <div className="bg-secondary-container/50 rounded-xl p-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              SATTHI 100% Quality &amp; Safety Promise
            </span>
            <span className="font-body-sm text-body-sm text-secondary">
              Govt ID validated · Fair pricing strictly capped · Free redo if issue persists
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Auto-Dispatch Bar */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-md shadow-md pb-safe border-t border-surface-container/60">
        <div className="max-w-2xl mx-auto p-3 flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="font-label-sm text-xs text-primary font-bold">
                Can't decide?
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-secondary truncate mt-0.5">
              Auto-dispatch closest pro in 60s
            </p>
          </div>
          <button
            onClick={handleAutoDispatch}
            disabled={isAutoDispatching}
            className="flex-shrink-0 h-11 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            {isAutoDispatching ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                <span>Matching nearest...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">flash_on</span>
                <span>Auto-Dispatch ({cityConfig.currencySymbol}{cityConfig.pricing.baseInspectionFee})</span>
                <span className="material-symbols-outlined text-[14px]">east</span>
              </>
            )}
          </button>
        </div>
      </aside>

      <LocationDrawer
        isOpen={showLocationDrawer}
        onClose={() => setShowLocationDrawer(false)}
      />
    </div>
  );
};
