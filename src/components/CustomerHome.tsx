import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, MAP_RADAR_IMAGE } from '../data/mockData';

export const CustomerHome: React.FC = () => {
  const {
    navigateTo,
    setSelectedCategory,
    setSelectedProviderId,
    providers,
    currentLocation,
    showToast,
    cityConfig,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigateTo('category-details', { categoryId });
  };

  const handleProRequest = (providerId: string, category: string) => {
    setSelectedProviderId(providerId);
    setSelectedCategory(category);
    navigateTo('request-form', { categoryId: category, providerId });
  };

  const handleProProfile = (providerId: string) => {
    setSelectedProviderId(providerId);
    navigateTo('provider-profile', { providerId });
  };

  // Filter categories by search
  const filteredCategories = SERVICE_CATEGORIES.filter((cat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  // Filter providers by search & verified toggle
  const availablePros = providers.filter((pro) => {
    if (filterVerifiedOnly && !pro.isGovtCertified) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      pro.name.toLowerCase().includes(q) ||
      pro.title.toLowerCase().includes(q) ||
      pro.specialties.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      {/* Top Greeting & Locality Context */}
      <section className="px-margin pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              {currentLocation.name}
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mt-0.5 font-extrabold">
              Good evening, Priya
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              {currentLocation.activeProsCount} Pros Live
            </span>
          </div>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Local on-demand services: Who can help you right now? Verified independent pros at locked rates.
        </p>
      </section>

      {/* High-Craft Search & Quick Pills */}
      <section className="px-margin pt-2 pb-4">
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="w-full h-12 pl-10 pr-20 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary border border-surface-container/80 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            placeholder="Search 'fan repair', 'switchboard', 'tap leak'..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer rounded-full"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              aria-label="Filter Services"
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors active:scale-95 cursor-pointer ${
                showFilterBar || filterVerifiedOnly
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filter Toggle Sub-bar */}
        {showFilterBar && (
          <div className="flex items-center gap-2 mt-2.5 p-2 bg-surface-container-low rounded-lg animate-in fade-in">
            <span className="font-label-sm text-label-sm text-secondary">Quick Filters:</span>
            <button
              onClick={() => setFilterVerifiedOnly(!filterVerifiedOnly)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filterVerifiedOnly
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              ✓ Govt ID Verified Only
            </button>
            <button
              onClick={() => showToast('Distance filtered: within 2.5 km', 'info', 'near_me')}
              className="px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer"
            >
              📍 &lt; 2.5 km
            </button>
          </div>
        )}

        {/* Micro Intent Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1 -mx-margin px-margin">
          <button
            onClick={() => {
              setSelectedCategory('electrician');
              navigateTo('request-form', { categoryId: 'electrician' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-[13px]">⚡</span> Fan Repair
          </button>
          <button
            onClick={() => {
              setSelectedCategory('plumber');
              navigateTo('request-form', { categoryId: 'plumber' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-[13px]">🚰</span> Sink Clog
          </button>
          <button
            onClick={() => {
              setSelectedCategory('electrician');
              navigateTo('request-form', { categoryId: 'electrician' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-[13px]">🔌</span> Short Circuit
          </button>
          <button
            onClick={() => {
              setSelectedCategory('appliance-ac');
              navigateTo('request-form', { categoryId: 'appliance-ac' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-md font-label-md whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-[13px]">❄️</span> AC Jet Service
          </button>
        </div>

        {/* 3-Pillar Trust Micro-Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-surface-container/60 text-center text-on-surface-variant font-label-sm text-[11px]">
          <div className="flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">bolt</span>
            <span>~12m Arrival</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
            <span>Locked Rates</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
            <span>30-Day Cover</span>
          </div>
        </div>
      </section>

      {/* Urgent Action Banner: Instant Radar */}
      <section className="px-margin mb-5">
        <div className="relative overflow-hidden rounded-xl bg-inverse-surface text-inverse-on-surface p-4 shadow-md">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm leading-tight text-white font-bold">
                  Instant Dispatch Radar
                </h2>
                <p className="font-body-sm text-body-sm text-secondary-fixed-dim mt-0.5">
                  Average arrival: {currentLocation.avgArrivalMins} mins in {currentLocation.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-label-sm text-label-sm font-semibold">Live Proximity</span>
            </div>
          </div>
          <div className="mt-3.5 pt-3 bg-surface-variant/10 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">
                radar
              </span>
              <span className="font-body-sm text-body-sm font-medium">
                {currentLocation.activeProsCount} verified pros within 2.5 km
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary-fixed font-bold tracking-wide">
              0.6 km closest
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('electrician');
              setSelectedProviderId('rahul-kumar');
              navigateTo('request-form', { categoryId: 'electrician' });
            }}
            className="mt-3 w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm cursor-pointer font-bold"
          >
            <span>Quick Match Available Pro</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Core Category Grid */}
      <section className="px-margin mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Categories &amp; Transparent Rates
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Guaranteed inspection fee · No surprise surge
            </p>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="p-4 bg-surface-container-low rounded-xl text-center text-secondary">
            No service categories matched "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-3.5 rounded-xl text-left transition-all active:scale-[0.98] shadow-xs border flex flex-col justify-between min-h-[112px] cursor-pointer ${
                  cat.id === 'all'
                    ? 'bg-primary-fixed/20 border-primary/40 hover:bg-primary-fixed/30'
                    : 'bg-surface-container-lowest border-surface-container/70 hover:border-surface-container-high hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${cat.bgTint || 'bg-surface-container'} ${cat.textTint || 'text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  </span>
                  <span
                    className={`font-label-sm text-[11px] font-semibold ${
                      cat.badge
                        ? 'text-primary font-bold'
                        : 'text-emerald-800'
                    }`}
                  >
                    {cat.badge ? cat.badge : `· ${cat.onlineCount} online`}
                  </span>
                </div>
                <div>
                  <span
                    className={`font-headline-sm text-[15px] font-bold block leading-tight ${
                      cat.id === 'all' ? 'text-primary' : 'text-on-surface'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">
                    {cat.id === 'all' ? 'Browse Catalog →' : `₹${cat.visitFee} visit fee`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Live Proximity Feed */}
      <section className="px-margin mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Available Near You Right Now
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Independent technicians ready for immediate callout
            </p>
          </div>
          <button
            onClick={() => navigateTo('category-details')}
            className="flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-label-md whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">map</span>
            <span>Map ({availablePros.length})</span>
          </button>
        </div>

        {availablePros.length === 0 ? (
          <div className="p-4 bg-surface-container-low rounded-xl text-center text-secondary">
            No technicians found for "{searchQuery}". Try searching 'electrician' or 'plumber'.
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {availablePros.map((pro) => (
              <article
                key={pro.id}
                className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container/60 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        className="w-12 h-12 rounded-full object-cover bg-surface-container ring-1 ring-surface-container-high"
                        alt={pro.name}
                        src={pro.avatar}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-surface-container-lowest ${
                          pro.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-headline-sm text-base text-on-surface leading-tight font-extrabold">
                          {pro.name}
                        </h3>
                        {pro.isGovtCertified && (
                          <span
                            className="material-symbols-outlined text-tertiary text-[17px]"
                            title="Govt ID & Background Cleared"
                          >
                            verified
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                        {pro.title.split('&')[0]} · {pro.experienceYears} yrs exp
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md text-xs text-on-surface font-bold flex items-center justify-end gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-[16px] fill-1">
                        star
                      </span>{' '}
                      {pro.rating}
                    </span>
                    <span className="font-body-sm text-[11px] text-secondary">
                      {pro.reviewCount} jobs
                    </span>
                  </div>
                </div>

                {/* Telemetry & Distance Badge */}
                <div className="mt-3 flex items-center justify-between py-2 px-2.5 bg-surface-container-low rounded-lg border border-surface-container/60 text-xs">
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
                      {pro.isAvailable ? 'Available now' : 'On assignment'}
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

                {/* Toolkit / Specialties */}
                <p className="mt-2.5 font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    handyman
                  </span>
                  <span>Specialties: {pro.specialties.join(', ')}</span>
                </p>

                {/* Pricing & Action Row */}
                <div className="mt-3 pt-3 flex items-center justify-between gap-3 bg-surface-container/20 border-t border-surface-container/60 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                  <div>
                    <span className="font-data-metric text-lg text-on-surface font-bold">
                      ₹{pro.visitFee}
                    </span>
                    <span className="font-body-sm text-xs text-secondary ml-1">visit fee</span>
                    <span className="block font-body-sm text-[11px] text-secondary">
                      {pro.avgFixRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleProProfile(pro.id)}
                      className="min-h-[40px] px-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-colors active:scale-95 cursor-pointer font-semibold border border-surface-container"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleProRequest(pro.id, pro.category)}
                      className="min-h-[40px] px-4 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs rounded-lg transition-all active:scale-95 shadow-xs cursor-pointer font-bold"
                    >
                      Request {pro.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SATTHI Local Neighborhood Map Glimpse */}
      <section className="px-margin mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">fmd_good</span>
              <span className="font-headline-sm text-base text-on-surface font-extrabold tracking-tight">
                Active Radar Map
              </span>
            </div>
            <span className="font-label-sm text-xs text-secondary font-medium">
              100m Precision
            </span>
          </div>

          <div
            onClick={() => navigateTo('category-details')}
            className="w-full h-36 rounded-xl bg-cover bg-center relative overflow-hidden flex items-end p-3 cursor-pointer group border border-surface-container/60"
            style={{ backgroundImage: `url('${MAP_RADAR_IMAGE}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
            <div className="relative z-10 w-full flex items-center justify-between text-surface-container-lowest">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-label-md text-xs sm:text-sm font-semibold text-white">
                  Live telemetry active in {currentLocation.name}
                </span>
              </div>
              <span className="font-label-sm text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-bold group-hover:bg-primary transition-colors">
                Expand View
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Service Promise & Trust Strip */}
      <section className="px-margin pb-4">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container/60">
          <h3 className="font-label-sm text-xs uppercase tracking-wider font-extrabold text-secondary mb-3">
            The SATTHI Trust Standard
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0 text-primary shadow-2xs">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-on-surface font-bold text-sm leading-tight">
                  Zero Hidden Markups
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Visit fee is locked upfront. Spare parts are billed at market MSRP with distributor
                  retail receipt.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0 text-primary shadow-2xs">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-on-surface font-bold text-sm leading-tight">
                  Direct to Local Pros
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Technicians keep 100% of labour earnings. No middlemen commissions, ensuring fair
                  service and dignified work.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0 text-primary shadow-2xs">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-on-surface font-bold text-sm leading-tight">
                  SATTHI Work Guarantee
                </h4>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                  Every verified dispatch is backed by up to ₹10,000 property protection and a{' '}
                  {cityConfig.pricing.warrantyDays}-day warranty callback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
