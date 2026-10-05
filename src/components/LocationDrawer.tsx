import React from 'react';
import { useApp } from '../context/AppContext';
import { LocationCluster } from '../types';

interface LocationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationDrawer: React.FC<LocationDrawerProps> = ({ isOpen, onClose }) => {
  const { currentLocation, setCurrentLocation, cityConfig, setCity, availableCities } = useApp();

  if (!isOpen) return null;

  const handleSelect = (cluster: LocationCluster) => {
    setCurrentLocation(cluster);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">location_city</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Choose Service Locality
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Close location selector"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* City Selector Tabs */}
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl">
          <span className="text-xs font-semibold text-secondary px-2">City:</span>
          <div className="flex items-center gap-1 flex-1">
            {availableCities.map((city) => (
              <button
                key={city.id}
                onClick={() => setCity(city.id)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cityConfig.id === city.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Independent verified pros operating in <strong>{cityConfig.name}</strong> neighborhood hubs with instant dispatch:
        </p>

        <div className="space-y-2.5">
          {cityConfig.clusters.map((cluster) => {
            const isSelected = currentLocation.id === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => handleSelect(cluster)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-fixed/20 border-primary shadow-xs ring-1 ring-primary'
                    : 'bg-surface-container-low border-surface-container hover:bg-surface-container'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">near_me</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        {cluster.name}
                      </span>
                      {cluster.surgeActive && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          Surge Active
                        </span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">
                      {cluster.area}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold font-label-sm text-label-sm justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{cluster.activeProsCount} online</span>
                  </div>
                  <span className="font-body-sm text-[11px] text-secondary">
                    ~{cluster.avgArrivalMins}m arrival
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low flex items-center gap-2.5 text-on-surface-variant font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-primary text-[18px]">gps_fixed</span>
          <span>Automatic GPS pinpoint will recalibrate when dispatching nearby tech in {cityConfig.name}.</span>
        </div>
      </div>
    </div>
  );
};
