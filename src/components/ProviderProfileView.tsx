import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProviderProfileView: React.FC = () => {
  const { providerProfile, updateProviderProfile, setRole, navigateTo, resetDemoState, cityConfig, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState(providerProfile.description || providerProfile.bio || '');
  const [editRadius, setEditRadius] = useState(providerProfile.serviceRadiusKm || 3.5);
  const [editVisitFee, setEditVisitFee] = useState(providerProfile.pricing?.visitInspectionFee ?? providerProfile.visitFee ?? 99);
  const [editLaborFee, setEditLaborFee] = useState(providerProfile.pricing?.startingLaborRate ?? 220);

  const handleSaveProfile = () => {
    updateProviderProfile({
      description: editBio,
      bio: editBio,
      serviceRadiusKm: editRadius,
      visitFee: editVisitFee,
      pricing: {
        visitInspectionFee: editVisitFee,
        startingLaborRate: editLaborFee,
        emergencyAvailable: providerProfile.pricing?.emergencyAvailable ?? true,
      },
    });
    setIsEditing(false);
    showToast('Provider profile updated successfully!', 'success', 'check_circle');
  };

  const getVerificationBadge = () => {
    switch (providerProfile.verificationStatus) {
      case 'VERIFIED':
        return {
          label: 'VERIFIED PRO',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: 'verified',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'UNDER REVIEW (SANDBOX APPROVED)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: 'pending',
        };
      case 'NEEDS_ACTION':
        return {
          label: 'NEEDS ACTION',
          bg: 'bg-error-container text-error border-error/30',
          icon: 'warning',
        };
      default:
        return {
          label: 'DEMO PRO',
          bg: 'bg-primary/10 text-primary border-primary/20',
          icon: 'badge',
        };
    }
  };

  const badge = getVerificationBadge();

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      <div className="px-margin pt-space-md flex flex-col gap-space-md">
        {/* Profile Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-space-md">
          <div className="flex items-start gap-space-md">
            <div className="relative shrink-0">
              <img
                className="w-16 h-16 rounded-2xl object-cover bg-surface-container ring-1 ring-surface-container-high"
                alt={providerProfile.fullName}
                src={providerProfile.avatarUrl}
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] shadow-xs">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-headline-sm text-base font-bold text-on-surface truncate">
                  {providerProfile.fullName}
                </h1>
                <span className={`font-label-sm text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 ${badge.bg}`}>
                  <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                  <span>{badge.label}</span>
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant capitalize mt-0.5">
                {providerProfile.tradeCategory} · {providerProfile.yearsExperience} yrs experience
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary">
                <span className="flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">near_me</span>
                  <span>{providerProfile.primaryLocality} ({providerProfile.serviceRadiusKm} km coverage)</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer shrink-0 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* Prototype Honest Disclaimer */}
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-950 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <span className="material-symbols-outlined text-[16px] text-amber-700">info</span>
              <span>Demo Screening Sandbox Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Provider credentials, licenses, and background checks shown here are simulated prototype records. They do not constitute official government (UIDAI) or police database certifications.
            </p>
          </div>

          {/* Performance Stats Strip */}
          <div className="grid grid-cols-3 gap-2 bg-surface-container-low rounded-xl p-3 text-center border border-surface-container">
            <div className="flex flex-col">
              <span className="font-data-metric text-base font-bold text-on-surface">
                {(providerProfile.stats?.rating ?? providerProfile.rating ?? 4.95).toFixed(2)}
              </span>
              <span className="font-label-sm text-[11px] text-secondary">
                Rating ({providerProfile.stats?.reviewCount ?? providerProfile.reviewCount ?? 184})
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-data-metric text-base font-bold text-emerald-700">
                {providerProfile.stats?.onTimeRate ?? '100%'}
              </span>
              <span className="font-label-sm text-[11px] text-secondary">On-Time</span>
            </div>
            <div className="flex flex-col">
              <span className="font-data-metric text-base font-bold text-primary">₹0 Cut</span>
              <span className="font-label-sm text-[11px] text-secondary">Direct Pay</span>
            </div>
          </div>
        </div>

        {/* Editable Profile & Tariff Settings */}
        {isEditing ? (
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-4 animate-in fade-in">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">Edit Profile &amp; Pricing</h2>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Professional Bio
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                  Visit Charge (₹)
                </label>
                <input
                  type="number"
                  value={editVisitFee}
                  onChange={(e) => setEditVisitFee(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface"
                />
              </div>

              <div>
                <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                  Starting Labor (₹)
                </label>
                <input
                  type="number"
                  value={editLaborFee}
                  onChange={(e) => setEditLaborFee(parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-xs font-bold text-on-surface">
                  Service Radius ({editRadius} km)
                </label>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                value={editRadius}
                onChange={(e) => setEditRadius(parseInt(e.target.value) || 2)}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs cursor-pointer hover:bg-primary-container transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        ) : (
          /* Profile Details View */
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">About Professional</h2>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              "{providerProfile.description || providerProfile.bio || 'Verified Professional'}"
            </p>

            <div className="pt-2 border-t border-surface-container flex flex-wrap gap-1.5">
              {(providerProfile.selectedSkills || providerProfile.skills || []).map((sk) => (
                <span key={sk} className="px-2.5 py-1 rounded-lg text-xs bg-surface-container font-medium text-on-surface">
                  {sk}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-surface-container grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary text-[11px] block">Doorstep Inspection</span>
                <span className="font-mono font-bold text-on-surface text-sm">
                  ₹{providerProfile.pricing?.visitInspectionFee ?? providerProfile.visitFee ?? 99}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary text-[11px] block">Starting Labor Tariff</span>
                <span className="font-mono font-bold text-on-surface text-sm">
                  ₹{providerProfile.pricing?.startingLaborRate ?? 220}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Verification & Screening Checklist */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs border border-surface-container/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-sm font-bold text-on-surface">
              Screening Checklist &amp; Licensing (Demo)
            </h2>
            <span className="font-label-sm text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-semibold">
              Simulated Checks
            </span>
          </div>

          <div className="space-y-2.5">
            {(providerProfile.documents || []).map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
                <span className="material-symbols-outlined text-[20px] text-emerald-700 shrink-0 mt-0.5">
                  verified
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-label-md text-xs font-bold text-on-surface block">
                    {doc.type}
                  </span>
                  <span className="font-body-sm text-[11px] text-secondary">
                    Status: {doc.status} · Submitted on {doc.submittedAt}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  PASS
                </span>
              </div>
            ))}

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">
                electric_bolt
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-label-md text-xs font-bold text-on-surface block">
                  {cityConfig.localUtilityProvider.name} Wireman Safety Standard
                </span>
                <span className="font-body-sm text-[11px] text-secondary">
                  Compliant with domestic distribution boards &amp; earth leakage testing
                </span>
              </div>
              <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                STANDARD
              </span>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-container-low border border-surface-container">
              <span className="material-symbols-outlined text-[20px] text-tertiary shrink-0 mt-0.5">
                two_wheeler
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-label-md text-xs font-bold text-on-surface block">
                  Transit Vehicle: {providerProfile.vehicle?.model || 'Honda Activa 6G'}
                </span>
                <span className="font-body-sm text-[11px] text-secondary">
                  Fast response vehicle for {providerProfile.primaryLocality || providerProfile.serviceArea} corridor
                </span>
              </div>
              <span className="text-[10px] text-tertiary font-bold bg-tertiary/10 px-2 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Demo Controls & Role Actions */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5">
          <span className="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">
            Demo Environment Controls
          </span>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setRole('customer')}
              className="flex-1 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              <span>Switch to Resident View (Priya)</span>
            </button>
            <button
              onClick={resetDemoState}
              className="flex-1 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">restart_alt</span>
              <span>Reset Entire Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
