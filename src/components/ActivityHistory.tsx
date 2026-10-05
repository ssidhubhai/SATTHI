import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { simulationService } from '../services/simulationService';

export const ActivityHistory: React.FC = () => {
  const { activeRequest, pastRequests, navigateTo, reBookProvider, showToast, cityConfig } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'scheduled'>('all');

  const hasActiveJob =
    activeRequest &&
    activeRequest.status !== 'COMPLETED' &&
    activeRequest.status !== 'CANCELLED';

  const activeCount = hasActiveJob ? 1 : 0;
  const completedCount = pastRequests.length;
  const totalCount = activeCount + completedCount;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      {/* Top Summary & Service History Header Banner */}
      <div className="px-margin pt-space-md pb-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Activity Hub
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-extrabold tracking-tight">
              Orders &amp; History
            </h1>
          </div>
          <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-full shadow-xs border border-surface-container">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              verified_user
            </span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              100% Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="px-margin py-space-sm overflow-x-auto no-scrollbar flex items-center gap-space-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
            filter === 'all'
              ? 'bg-primary text-on-primary shadow-xs font-bold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              filter === 'all'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface'
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('active')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
            filter === 'active'
              ? 'bg-primary text-on-primary shadow-xs font-bold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Active</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              filter === 'active'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface'
            }`}
          >
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
            filter === 'completed'
              ? 'bg-primary text-on-primary shadow-xs font-bold'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <span>Completed</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              filter === 'completed'
                ? 'bg-primary-container text-on-primary'
                : 'bg-surface-container-high text-on-surface'
            }`}
          >
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('scheduled')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all shrink-0 cursor-pointer ${
            filter === 'scheduled'
              ? 'bg-primary text-on-primary shadow-xs font-bold'
              : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span>Scheduled</span>
          <span className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
            0
          </span>
        </button>
      </div>

      {/* Active Telemetry In-Progress Order Card */}
      {hasActiveJob && (filter === 'all' || filter === 'active') && (
        <div className="px-margin pt-space-xs pb-space-sm">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md relative overflow-hidden flex flex-col gap-3 border border-surface-container/60">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-container to-amber-500"></div>

            {/* Telemetry Live Status Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="font-label-sm text-label-sm font-bold tracking-wide uppercase">
                  {activeRequest.status === 'ARRIVED'
                    ? 'Technician Arrived'
                    : activeRequest.status === 'IN_PROGRESS'
                    ? 'Work In Progress'
                    : 'In Progress • En Route'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  ETA {activeRequest.etaMinutesRemaining || 9} mins
                </span>
              </div>
            </div>

            {/* Service Title & ID */}
            <div className="flex flex-col">
              <div className="flex items-baseline justify-between">
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {activeRequest.faultType}
                </h2>
                <span className="font-data-metric text-data-metric text-primary font-bold">
                  ₹{activeRequest.totalPayable}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Standard Diagnostic &amp; Repair • Order #{activeRequest.id}
              </span>
            </div>

            {/* Pro Snapshot & Start OTP Box */}
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between gap-space-sm border border-surface-container">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="relative shrink-0">
                  <img
                    alt="Rahul Kumar"
                    className="w-12 h-12 rounded-full object-cover bg-surface-container"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 bg-tertiary text-on-tertiary rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    <span className="material-symbols-outlined text-[11px] fill-1">
                      electric_bolt
                    </span>
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface truncate">
                      Rahul Kumar
                    </span>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[10px] px-1 rounded font-bold uppercase">
                      Pro
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-500 fill-1">
                      star
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      4.94
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                      (320+ jobs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Start Code OTP Box */}
              <div className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-xs border border-surface-container">
                <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant leading-none">
                  Share OTP
                </span>
                <span className="font-data-metric text-data-metric font-extrabold text-primary tracking-widest leading-tight">
                  {activeRequest.pin}
                </span>
              </div>
            </div>

            {/* Live Action Buttons */}
            <div className="grid grid-cols-2 gap-space-sm pt-1">
              <button
                onClick={() => showToast(simulationService.simulateVoiceCall('Rahul Kumar').message, 'info', 'phone')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                <span>Call Rahul</span>
              </button>
              <button
                onClick={() => navigateTo('live-tracking')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <span>Track Live</span>
                <span className="material-symbols-outlined text-[18px]">near_me</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Local Trusted Favorites Horizontal Strip */}
      <div className="pt-space-sm pb-space-xs">
        <div className="px-margin flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px] fill-1">
              favorite
            </span>
            <h3 className="font-headline-sm text-[15px] font-bold text-on-surface">
              My Neighborhood Pros
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-primary font-semibold cursor-pointer">
            Quick Re-Dispatch
          </span>
        </div>

        {/* Horizontal scrollable pro quick dispatch chips */}
        <div className="px-margin overflow-x-auto no-scrollbar flex items-center gap-space-sm pb-1">
          {/* Pro 1: Rahul */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container/60 flex items-center gap-3 shrink-0 min-w-[240px]">
            <img
              alt="Rahul Kumar"
              className="w-10 h-10 rounded-full object-cover shrink-0 bg-surface-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                  Rahul Kumar
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                  Active
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                Electrician • 2 jobs done
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-label-sm text-[11px] font-bold text-primary">~10 min away</span>
                <button
                  onClick={() => reBookProvider('rahul-kumar', 'electrician')}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          </div>

          {/* Pro 2: Suresh */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container/60 flex items-center gap-3 shrink-0 min-w-[240px]">
            <img
              alt="Suresh Patil"
              className="w-10 h-10 rounded-full object-cover shrink-0 bg-surface-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKZN1twV62YaktsZTIhpcrWrP1g3TGgjZ4tUw1e2VYzCtHmm_soOL_7Rh5Mh1DaMvNXDMjDFyUYzoI4ebi3it49Lb-ifVJpRTNINA1xXFyV0yeFMgLi321i-9j9xsgcN4ycVce0QDn3DFkpQQeclRG8zFh7DMITyHLXCUBijmi2gqUuv-NAgfhQ6tfF_zl9sTQY5uBGtjYweRtWn33riVGw9iZJDTi5YYMEqckQpsgJbTAe2O5x6Za"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                  Suresh Patil
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 rounded">
                  Available
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                Master Plumber • 1 job
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-label-sm text-[11px] font-bold text-primary">~15 min away</span>
                <button
                  onClick={() => reBookProvider('suresh-patil', 'plumber')}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          </div>

          {/* Pro 3: Manjunath */}
          <div className="bg-surface-container-lowest p-3 rounded-xl shadow-xs border border-surface-container/60 flex items-center gap-3 shrink-0 min-w-[240px]">
            <img
              alt="Manjunath Gowda"
              className="w-10 h-10 rounded-full object-cover shrink-0 bg-surface-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFDjLTa1DnDZ37HRKYI7YHL1jIgSr4TfcdBynEypEblaQnbOCubY0_y3hO9C1Z6CYN7BMseTcydXkAP_7Ykzt-A0hBWUH1cjh_UAyi8Gqo9mW-tRsxOXy2WJOeekzqiWs_N9M9_8UVEo2cGoDhYaPLcEZWRm-hdeNMbZ27j60h6RzkmFukLfNoEKfccBhbGJiDf2_NOKwSBbyPa-JsWira-O5VnojYLiSOrnH5PLwQMRd4aIhH9V0O"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                  Manjunath G.
                </span>
                <span className="text-[10px] font-bold text-secondary bg-surface-container px-1.5 rounded">
                  Available
                </span>
              </div>
              <span className="font-body-sm text-[11px] text-on-surface-variant truncate">
                Electrical &amp; Appliance Specialist
              </span>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-label-sm text-[11px] font-bold text-primary">~8 min away</span>
                <button
                  onClick={() => reBookProvider('manjunath-gowda', 'electrician')}
                  className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Completed Services Section */}
      {(filter === 'all' || filter === 'completed') && (
        <div className="px-margin pt-space-md flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Past Services
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {pastRequests.length} Orders Completed
            </span>
          </div>

          {pastRequests.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.category === 'plumber'
                        ? 'plumbing'
                        : item.category === 'electrician'
                        ? 'mode_fan'
                        : 'water_drop'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {item.serviceTitle}
                    </h4>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">
                      {item.timeAgo} • {item.customerAddress}
                    </span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                  Completed
                </span>
              </div>

              {/* Pro Attribution */}
              <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-lg border border-surface-container">
                <div className="flex items-center gap-2">
                  <img
                    alt={item.providerName}
                    className="w-7 h-7 rounded-full object-cover bg-surface-container"
                    src={item.providerAvatar}
                  />
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      {item.providerName}
                    </span>
                    <div className="flex items-center text-amber-500 text-[12px]">
                      <span className="material-symbols-outlined text-[13px] fill-1">star</span>
                      <span className="text-on-surface-variant ml-1 font-body-sm text-[10px]">
                        Rated {item.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-data-metric text-[16px] font-bold text-on-surface">
                    ₹{item.grossAmount}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-semibold">UPI Paid</span>
                </div>
              </div>

              {/* SATTHI Warranty */}
              <div className="flex items-center justify-between bg-emerald-50/70 px-3 py-2 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700">
                    shield
                  </span>
                  <span className="font-label-sm text-[11px] font-bold text-emerald-900">
                    30 days warranty active
                  </span>
                </div>
                <button
                  onClick={() => showToast(`Warranty claim registered for #${item.orderNumber}. Senior supervisor dispatching within 15 mins.`, 'success', 'verified_user')}
                  className="text-[11px] text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Claim Fix
                </button>
              </div>

              {/* Card Action Buttons */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  onClick={() => navigateTo('service-invoice')}
                  className="flex-1 py-2 px-3 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Receipt (Demo)</span>
                </button>
                <button
                  onClick={() => reBookProvider(item.providerId || (item.providerName.includes('Rahul') ? 'rahul-kumar' : 'suresh-patil'), item.category)}
                  className="flex-1 py-2 px-3 rounded-lg bg-primary/10 text-primary font-label-md text-label-md font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>
                  <span>Re-Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Operations Support Desk Floating Card */}
      <div className="px-margin pt-space-lg pb-space-xl">
        <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-space-md shadow-xs border border-surface-container/60 flex items-center gap-3 relative overflow-hidden">
          <div className="w-11 h-11 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">support_agent</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase tracking-wider">
              {cityConfig.operationsDeskName}
            </span>
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
              Need help with an order?
            </h4>
            <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">
              Instant 2-minute chat resolution or call back.
            </p>
          </div>
          <button
            onClick={() => navigateTo('help')}
            className="px-3.5 py-2 rounded-lg bg-tertiary text-on-tertiary font-label-md text-label-md font-bold shrink-0 hover:bg-tertiary-container transition-colors shadow-xs cursor-pointer"
          >
            Help
          </button>
        </div>
      </div>
    </div>
  );
};
