import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BEFORE_FAULT_PHOTO } from '../data/mockData';

export const RequestForm: React.FC = () => {
  const {
    createServiceRequest,
    selectedCategory,
    selectedProviderId,
    providers,
    currentLocation,
    navigateTo,
    showToast,
    cityConfig,
  } = useApp();

  const assignedPro = providers.find((p) => p.id === selectedProviderId) || providers[0];

  // Dynamic category details
  const getCategoryMeta = () => {
    switch (selectedCategory) {
      case 'plumber':
        return {
          title: 'Plumbing Issue & Repair',
          icon: 'plumbing',
          visitFee: 99,
          chips: [
            'Kitchen Sink Drain Clogged',
            'Water Pipe Burst / Leakage',
            'Toilet Flush Tank Malfunction',
            'Tap Dripping / Low Water Pressure',
            'Bathroom Concealed Line Repair',
            'Other Plumbing Issue',
          ],
        };
      case 'carpenter':
        return {
          title: 'Carpentry & Door Hardware',
          icon: 'carpenter',
          visitFee: 149,
          chips: [
            'Main Door Lock Jammed / Broken',
            'Wardrobe Door Hinges Loose',
            'Drill & Wall Mountings (TV/Curtains)',
            'Furniture Joint / Chair Repair',
            'Window Latch & Mesh Fitting',
            'Other Carpentry Task',
          ],
        };
      case 'appliance-ac':
        return {
          title: 'Appliance & AC Service',
          icon: 'mode_fan',
          visitFee: 199,
          chips: [
            'AC Not Cooling / Warm Air',
            'AC Jet Pump Deep Cleaning',
            'Washing Machine Drum / Water Drain',
            'Geyser Water Not Heating',
            'Microwave / Refrigerator Fault',
            'Other Appliance Repair',
          ],
        };
      default:
        return {
          title: 'Electrical Issue & Repair',
          icon: 'electric_bolt',
          visitFee: 99,
          chips: [
            'Short Circuit / Blackout',
            'MCB Repeatedly Tripping',
            'Ceiling Fan Not Working / Noise',
            'Switchboard Sparking / Burnt Odor',
            'Geyser / Heavy Appliance Power Plug',
            'Other Electrical Issue',
          ],
        };
    }
  };

  const meta = getCategoryMeta();
  const [selectedFault, setSelectedFault] = useState(meta.chips[0]);
  const [description, setDescription] = useState(
    'Living room power went out with a loud click from distribution box; switches smell faintly burnt.'
  );
  const [hasAttachment, setHasAttachment] = useState(true);
  const [urgency, setUrgency] = useState<'immediate' | 'later'>('immediate');
  const [scheduledSlot, setScheduledSlot] = useState('Today · 2:00 PM – 4:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    createServiceRequest({
      faultType: urgency === 'later' ? `${selectedFault} (${scheduledSlot})` : selectedFault,
      description,
      urgency,
      category: selectedCategory,
      providerId: selectedProviderId,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-28">
      {/* Progress Stepper Tracker */}
      <section className="px-margin pt-space-sm pb-space-md bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-surface-variant z-0"></div>

          {/* Step 1: Active */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md shadow-sm ring-4 ring-primary-fixed font-bold">
              1
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold">Diagnostics</span>
          </div>

          {/* Step 2: Next */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-label-md text-label-md font-bold">
              2
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Urgency</span>
          </div>

          {/* Step 3: Pending */}
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-secondary flex items-center justify-center font-label-md text-label-md font-bold">
              3
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-medium">Dispatch</span>
          </div>
        </div>
      </section>

      {/* Live Neighborhood Telemetry Banner */}
      <section className="px-margin py-2.5 bg-surface-container-low flex items-center justify-between gap-space-sm border-b border-surface-container">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-body-sm text-body-sm text-on-surface truncate">
            High demand in <strong>{currentLocation.name}</strong> · Average dispatch <strong>{currentLocation.avgArrivalMins} mins</strong>
          </span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">
          {meta.icon}
        </span>
      </section>

      <form onSubmit={handleSubmit} className="px-margin flex flex-col gap-space-lg mt-space-md">
        {/* Service Selection Header Card */}
        <section className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[26px]">{meta.icon}</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Service Category
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                {meta.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-label-sm text-label-sm transition-colors cursor-pointer font-medium"
          >
            Change
          </button>
        </section>

        {/* Selected Preferred Pro Callout (if chosen) */}
        {assignedPro && (
          <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={assignedPro.avatar}
                alt={assignedPro.name}
                className="w-10 h-10 rounded-full object-cover bg-surface-container"
              />
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">
                  Routing to {assignedPro.name}
                </span>
                <span className="font-body-sm text-[11px] text-secondary">
                  {assignedPro.distanceKm} km away · ~{assignedPro.etaMinutes}m arrival
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
              Preferred Pro
            </span>
          </div>
        )}

        {/* Issue Diagnostic Chips */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface font-bold">
              Select Fault Type
            </label>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Tap closest match
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {meta.chips.map((chip) => {
              const isSelected = selectedFault === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedFault(chip)}
                  className={`px-3.5 py-2 rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Issue Narrative Input */}
        <section className="flex flex-col gap-2">
          <label className="font-label-lg text-label-lg text-on-surface font-bold">
            Describe the Issue
          </label>
          <div className="relative">
            <textarea
              className="w-full min-h-[96px] p-3.5 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-secondary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-low transition-all"
              placeholder="e.g. Heard a loud pop from switchboard, living room lights went off, spark smell..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={() => showToast('Voice note mic ready (simulated audio transcription).', 'info', 'mic')}
              className="absolute right-3 bottom-3 p-1.5 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest transition-colors cursor-pointer"
              title="Voice dictation"
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>
          </div>
        </section>

        {/* Visual Inspection Upload */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="font-label-lg text-label-lg text-on-surface font-bold">
              Fault Photo (Optional)
            </label>
            <span className="font-body-sm text-[11px] text-secondary">
              Helps tech carry exact spares
            </span>
          </div>

          {hasAttachment ? (
            <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs flex items-center justify-between gap-3 border border-surface-container">
              <div className="flex items-center gap-3">
                <img
                  src={BEFORE_FAULT_PHOTO}
                  alt="Fault snapshot"
                  className="w-14 h-14 rounded-lg object-cover bg-surface-container"
                />
                <div>
                  <span className="font-label-md text-label-md font-bold text-on-surface block">
                    inspection_photo_01.jpg
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Attached for diagnostics
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasAttachment(false);
                  showToast('Photo removed', 'info', 'delete');
                }}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-error cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setHasAttachment(true);
                showToast('Sample damage inspection photo uploaded', 'success', 'add_a_photo');
              }}
              className="w-full h-24 rounded-xl border-2 border-dashed border-surface-container-high bg-surface-container-lowest hover:bg-surface-container-low flex flex-col items-center justify-center gap-1 text-secondary cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] text-primary">add_a_photo</span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                Tap to Attach Photo / Video
              </span>
              <span className="font-body-sm text-[11px]">JPG, PNG or MP4 up to 15MB</span>
            </button>
          )}
        </section>

        {/* Urgency Selection */}
        <section className="flex flex-col gap-2.5">
          <label className="font-label-lg text-label-lg text-on-surface font-bold">
            When do you need help?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setUrgency('immediate')}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                urgency === 'immediate'
                  ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary'
                  : 'bg-surface-container-lowest border-surface-container'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  Right Now
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="font-body-sm text-xs text-secondary">
                Dispatch nearest available ({currentLocation.avgArrivalMins}m)
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUrgency('later');
                showToast('Scheduled slots available for today afternoon & evening', 'info', 'event');
              }}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                urgency === 'later'
                  ? 'bg-primary-fixed/20 border-primary ring-1 ring-primary'
                  : 'bg-surface-container-lowest border-surface-container'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
                  Schedule Later
                </span>
              </div>
              <span className="font-body-sm text-xs text-secondary">
                Select 2-hour window today
              </span>
            </button>
          </div>

          {urgency === 'later' && (
            <div className="flex flex-col gap-2 mt-2 p-3 bg-surface-container-low rounded-xl border border-surface-container">
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Available Arrival Windows:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  'Today · 2:00 PM – 4:00 PM',
                  'Today · 5:00 PM – 7:00 PM',
                  'Tomorrow · 9:00 AM – 11:00 AM',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setScheduledSlot(slot)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                      scheduledSlot === slot
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Transparent Rates Card */}
        <section className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Transparent Price Lock
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-sm text-[10px] font-bold">
              Zero Hidden Charges
            </span>
          </div>

          <div className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant pt-1 border-t border-surface-container">
            <div className="flex items-center justify-between">
              <span>Standard Diagnostic / Visit Fee:</span>
              <span className="font-bold text-on-surface">{cityConfig.currencySymbol}{meta.visitFee}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-700">
              <span>Visit fee waived if repair bill exceeds {cityConfig.currencySymbol}{cityConfig.pricing.inspectionWaiveThreshold}</span>
              <span>100% Waived</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Spare Parts (if required):</span>
              <span className="font-semibold text-on-surface">Billed at Direct MSRP</span>
            </div>
          </div>
        </section>

        {/* Sticky Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
              <span>Broadcasting to Nearest Pros...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">radar</span>
              <span>Find Available Technician Near Me</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
