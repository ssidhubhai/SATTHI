import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProviderProfile } from '../types';

interface RegisterState {
  // Step 1: Account
  fullName: string;
  phone: string;
  email: string;
  otp: string;
  isOtpSent: boolean;
  isOtpVerified: boolean;

  // Step 2: Profession
  tradeCategory: string;

  // Step 3: Professional Details
  yearsExperience: number;
  selectedSkills: string[];
  description: string;

  // Step 4: Service Area
  primaryLocalityId: string;
  serviceRadiusKm: number;

  // Step 5: Profile
  avatarUrl: string;
  languages: string[];
  vehicleModel: string;

  // Step 6: Documents
  idDocumentType: string;
  certName: string;
  docUploaded: boolean;

  // Step 7: Pricing
  visitCharge: number;
  hourlyRate: number;
  emergencyAvailable: boolean;
}

const TRADE_OPTIONS = [
  { id: 'electrician', name: 'Electrician', icon: 'bolt', desc: 'Wiring, MCBs, lighting, switches' },
  { id: 'plumber', name: 'Plumber', icon: 'faucet', desc: 'Leaks, faucets, pipes, water meters' },
  { id: 'carpenter', name: 'Carpenter', icon: 'carpenter', desc: 'Furniture repairs, doors, locks' },
  { id: 'appliance-ac', name: 'AC & Appliance Repair', icon: 'ac_unit', desc: 'Cooling, gas charge, servicing' },
  { id: 'appliance-ro', name: 'RO & Water Purifier', icon: 'water_drop', desc: 'Filters, membrane, motor' },
  { id: 'cleaning', name: 'Home Deep Cleaning', icon: 'cleaning_services', desc: 'Kitchen, bathroom, sanitization' },
  { id: 'painter', name: 'House Painter', icon: 'format_paint', desc: 'Interior, damp touch-up, polish' },
  { id: 'other', name: 'Other General Repairs', icon: 'handyman', desc: 'Handyman & household maintenance' },
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  electrician: ['MCB Tripping Diagnosis', 'House Rewiring', 'Distribution Board', 'Ceiling Fan Installation', 'Inverter Wiring', 'Appliance Earthing'],
  plumber: ['Concealed Leak Detection', 'Tap & Mixer Replacement', 'P-Trap Clearing', 'Flush Tank Mechanism', 'Overhead Tank Float Valve', 'Water Line Piping'],
  carpenter: ['Hinges & Hydraulic Soft-Close', 'Door Lock Installation', 'Furniture Assembly', 'Wardrobe Sliding Track', 'Plywood Patch Repair', 'Modular Kitchen Repair'],
  'appliance-ac': ['Gas Leakage & Nitrogen Test', 'Compressor Diagnostic', 'PCB Inverter Repair', 'Coil Cleaning & Jet Wash', 'Drainage Overflow Fix'],
  default: ['Emergency Diagnostics', 'Preventive Maintenance', 'Safety Inspection', 'Component Replacement'],
};

export const ProviderRegister: React.FC = () => {
  const { cityConfig, registerProvider, showToast, navigateTo } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<RegisterState>({
    fullName: '',
    phone: '',
    email: '',
    otp: '',
    isOtpSent: false,
    isOtpVerified: false,
    tradeCategory: 'electrician',
    yearsExperience: 4,
    selectedSkills: ['MCB Tripping Diagnosis', 'Distribution Board', 'Ceiling Fan Installation'],
    description: 'Specialist in domestic wiring, DB panel repairs, and emergency short circuit troubleshooting.',
    primaryLocalityId: cityConfig.clusters[0]?.id || 'cluster-1',
    serviceRadiusKm: 5,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ',
    languages: ['Hindi', 'English'],
    vehicleModel: 'Hero Splendor / Scooter',
    idDocumentType: 'Government Photo ID (Aadhaar / Voter ID)',
    certName: 'ITI / Trade Certificate (Electrical / Vocational)',
    docUploaded: true,
    visitCharge: 99,
    hourlyRate: 220,
    emergencyAvailable: true,
  });

  const updateFormData = (fields: Partial<RegisterState>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleSendOtp = () => {
    if (!formData.phone || formData.phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error', 'phone');
      return;
    }
    updateFormData({ isOtpSent: true, otp: '1234' });
    showToast('Demo OTP sent: 1234', 'info', 'sms');
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '1234' || formData.otp.length === 4) {
      updateFormData({ isOtpVerified: true });
      showToast('Mobile number verified successfully!', 'success', 'check_circle');
    } else {
      showToast('Invalid OTP. Please enter 1234 for demo.', 'error', 'error');
    }
  };

  const toggleSkill = (skill: string) => {
    const exists = formData.selectedSkills.includes(skill);
    if (exists) {
      updateFormData({ selectedSkills: formData.selectedSkills.filter((s) => s !== skill) });
    } else {
      updateFormData({ selectedSkills: [...formData.selectedSkills, skill] });
    }
  };

  const toggleLanguage = (lang: string) => {
    const exists = formData.languages.includes(lang);
    if (exists) {
      updateFormData({ languages: formData.languages.filter((l) => l !== lang) });
    } else {
      updateFormData({ languages: [...formData.languages, lang] });
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        showToast('Please enter your full name', 'warning', 'person');
        return;
      }
      if (!formData.phone.trim()) {
        showToast('Please enter your mobile phone number', 'warning', 'phone');
        return;
      }
    }
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('provider-landing');
    }
  };

  const handleSubmitRegistration = () => {
    setIsSubmitting(true);

    const primaryCluster = cityConfig.clusters.find((c) => c.id === formData.primaryLocalityId) || cityConfig.clusters[0];

    const newProfile: ProviderProfile = {
      id: `prov-${Date.now()}`,
      userId: `user-prov-${Date.now()}`,
      name: formData.fullName || 'Rahul Kumar',
      fullName: formData.fullName || 'Rahul Kumar',
      phone: formData.phone || '+91 98765 43210',
      email: formData.email || 'partner@satthi.local',
      profession: `${formData.tradeCategory} Specialist`,
      category: formData.tradeCategory.toLowerCase(),
      tradeCategory: formData.tradeCategory,
      services: formData.selectedSkills,
      experienceYears: formData.yearsExperience,
      yearsExperience: formData.yearsExperience,
      skills: formData.selectedSkills,
      selectedSkills: formData.selectedSkills,
      bio: formData.description,
      description: formData.description,
      serviceArea: `${primaryCluster.name} Corridor`,
      primaryLocality: primaryCluster.name,
      primaryLocalityId: primaryCluster.id,
      serviceRadiusKm: formData.serviceRadiusKm,
      availability: 'online',
      verificationStatus: 'UNDER_REVIEW',
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      visitFee: formData.visitCharge || 99,
      laborRateRange: '₹150 – ₹350 avg fix',
      profileImage: formData.avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuALC5v_Pg92yXeMQ7zt1CR9eNPLsBl1gIAsWsig1StwYvFD19yXWcj3dBoUhNaF0_aTVckhbqRIYeA_4LIPFhDZEH3OL0bsz70beEPmamW09s2hZk8kmJ5xrr1gDb-_n5byP5mJPuRGZKDM0h7MdRfqz_mHM6rpXVenJjbnDmSGZEjP1gVDHSAUKWnBZ6_IPcFeuzo2hB83Ldd8r-4FQvDcRx1G1DVbqAp76WsAMImvcVdN7Gg8-sbJ',
      avatarUrl: formData.avatarUrl,
      languages: formData.languages,
      cityId: cityConfig.id,
      clusterId: primaryCluster.id,
      emergencyAvailable: formData.emergencyAvailable,
      vehicle: {
        type: 'Two-Wheeler',
        model: formData.vehicleModel || 'Hero Splendor+',
      },
      documents: [
        {
          type: formData.idDocumentType || 'Aadhaar Card',
          status: 'UNDER_REVIEW',
          submittedAt: new Date().toLocaleDateString('en-IN'),
        },
        {
          type: formData.certName || 'Trade Certificate',
          status: 'UNDER_REVIEW',
          submittedAt: new Date().toLocaleDateString('en-IN'),
        },
      ],
      pricing: {
        visitInspectionFee: formData.visitCharge || 99,
        startingLaborRate: formData.hourlyRate || 220,
        emergencyAvailable: formData.emergencyAvailable,
      },
      stats: {
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0,
        onTimeRate: '100%',
        repeatHires: 0,
      },
    };

    setTimeout(() => {
      registerProvider(newProfile);
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast('Registration submitted for verification! (Demo Sandbox)', 'success', 'verified');
    }, 900);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto px-margin py-8 pb-32">
        <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-label-sm text-xs uppercase tracking-wider text-emerald-700 font-bold">
              Application Submitted
            </span>
            <h2 className="font-headline-sm text-xl font-bold text-on-surface">
              Welcome to SATTHI, {formData.fullName || 'Partner'}!
            </h2>
            <p className="font-body-sm text-xs text-secondary max-w-md mx-auto mt-1">
              Your profile has been submitted and is currently in demo review status. In this sandbox environment, your account is pre-approved for live testing.
            </p>
          </div>

          <div className="w-full p-3.5 rounded-xl bg-surface-container-low border border-surface-container text-left flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
            <div className="text-xs text-on-surface-variant">
              <strong className="text-on-surface block font-semibold mb-0.5">Demo Prototype Active:</strong>
              Your profile, pricing, and service radius are now stored locally in your browser. You can go online, receive broadcasts, and complete jobs immediately.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
            <button
              onClick={() => navigateTo('provider-dashboard')}
              className="flex-1 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:bg-primary-container"
            >
              <span>Go to Partner Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => navigateTo('provider-profile')}
              className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer"
            >
              View My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTrade = TRADE_OPTIONS.find((t) => t.id === formData.tradeCategory) || TRADE_OPTIONS[0];
  const skillsList = SKILL_SUGGESTIONS[formData.tradeCategory] || SKILL_SUGGESTIONS.default;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-margin py-4 pb-32">
      {/* Step Progress Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-secondary hover:text-on-surface font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>{currentStep === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>
          <span className="font-bold text-primary">
            Step {currentStep} of 8
          </span>
        </div>

        {/* 8-bar indicator */}
        <div className="grid grid-cols-8 gap-1 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`h-full rounded-full transition-all ${
                s <= currentStep ? 'bg-primary' : 'bg-transparent'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* STEP 1: ACCOUNT */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 1: Your Account Details
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Enter your basic contact details to get started on SATTHI.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-3.5">
            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Full Legal Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData({ fullName: e.target.value })}
                placeholder="e.g. Rahul Kumar"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Mobile Number (for SMS dispatch alerts) <span className="text-error">*</span>
              </label>
              <div className="flex gap-2">
                <div className="h-11 px-3 rounded-lg bg-surface-container-high border border-surface-container flex items-center text-xs font-bold text-on-surface">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder="98765 43210"
                  className="flex-1 h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
                />
                {!formData.isOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3.5 h-11 rounded-lg bg-primary-fixed text-on-primary-fixed text-xs font-bold shrink-0 cursor-pointer hover:bg-primary-fixed/80"
                  >
                    {formData.isOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {formData.isOtpSent && !formData.isOtpVerified && (
              <div className="p-3 rounded-lg bg-primary-fixed/20 border border-primary/20 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">Simulated OTP Check</span>
                  <span className="text-secondary">Demo Code: <strong>1234</strong></span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.otp}
                    onChange={(e) => updateFormData({ otp: e.target.value })}
                    placeholder="Enter 4-digit OTP"
                    className="w-32 h-10 px-3 rounded bg-surface text-center font-mono font-bold text-sm border focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 h-10 rounded bg-primary text-on-primary text-xs font-bold cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            {formData.isOtpVerified && (
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span>Phone verified with demo OTP handshake.</span>
              </div>
            )}

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder="e.g. rahul.electrician@gmail.com"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PROFESSION */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 2: Choose Your Primary Trade
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Select the service category that best matches your primary skillset.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TRADE_OPTIONS.map((trade) => {
              const isSelected = formData.tradeCategory === trade.id;
              return (
                <button
                  key={trade.id}
                  type="button"
                  onClick={() => updateFormData({ tradeCategory: trade.id })}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 border-primary ring-1 ring-primary'
                      : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{trade.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-headline-sm text-xs font-bold text-on-surface block">
                      {trade.name}
                    </span>
                    <span className="font-body-sm text-[11px] text-secondary mt-0.5 block leading-snug">
                      {trade.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: PROFESSIONAL DETAILS */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 3: Professional Experience & Skills
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Help residents understand your experience level in {selectedTrade.name}.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-xs font-bold text-on-surface">
                  Years of Hands-on Experience
                </label>
                <span className="font-bold text-primary text-xs">{formData.yearsExperience} Years</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                value={formData.yearsExperience}
                onChange={(e) => updateFormData({ yearsExperience: parseInt(e.target.value) || 1 })}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-secondary mt-0.5">
                <span>1 yr</span>
                <span>5 yrs</span>
                <span>10 yrs</span>
                <span>20+ yrs</span>
              </div>
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1.5">
                Specialized Skills (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {skillsList.map((skill) => {
                  const isSelected = formData.selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Short Professional Summary
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe your background, specialty tools, and service ethos..."
                className="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SERVICE AREA */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 4: Define Your Service Territory
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Set where you want to receive dispatch opportunities in {cityConfig.name}.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Primary Neighborhood Cluster
              </label>
              <select
                value={formData.primaryLocalityId}
                onChange={(e) => updateFormData({ primaryLocalityId: e.target.value })}
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                {cityConfig.clusters.map((cluster) => (
                  <option key={cluster.id} value={cluster.id}>
                    {cluster.name} ({cluster.pincode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-xs font-bold text-on-surface">
                  Service Radius (Travel Preference)
                </label>
                <span className="font-bold text-primary text-xs">{formData.serviceRadiusKm} km radius</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                value={formData.serviceRadiusKm}
                onChange={(e) => updateFormData({ serviceRadiusKm: parseInt(e.target.value) || 3 })}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-secondary mt-0.5">
                <span>2 km (Local neighborhood)</span>
                <span>8 km</span>
                <span>15 km (Wide coverage)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">
                near_me
              </span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You will only receive broadcast radar alerts when a resident is located within your chosen <strong>{formData.serviceRadiusKm} km</strong> corridor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: PROFILE & VEHICLE */}
      {currentStep === 5 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 5: Public Profile & Transportation
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              This is what residents see when you accept their dispatch.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={formData.avatarUrl}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-2xl object-cover bg-surface-container ring-1 ring-surface-container-high"
              />
              <div className="flex flex-col gap-1">
                <span className="font-headline-sm text-xs font-bold text-on-surface">
                  Profile Photo (Sandbox Demo)
                </span>
                <span className="text-[11px] text-secondary">
                  High-trust technician photo with clean uniform.
                </span>
              </div>
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Vehicle Details (for ETA estimation)
              </label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => updateFormData({ vehicleModel: e.target.value })}
                placeholder="e.g. Honda Activa 6G / Hero Splendor"
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1.5">
                Languages You Speak with Customers
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Hindi', 'English', 'Kannada', 'Marathi', 'Tamil', 'Telugu', 'Bengali'].map((lang) => {
                  const isSelected = formData.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: VERIFICATION & DOCUMENTS */}
      {currentStep === 6 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 6: Document & Verification Sandbox
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Simulated KYC and trade qualification upload for prototype demonstration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">info</span>
              <div>
                <strong>Prototype Notice:</strong> Document uploads and KYC checks are simulated test records. No government or police database checks are performed in this demo sandbox.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <div>
                  <span className="font-label-md text-xs font-bold text-on-surface block">
                    {formData.idDocumentType}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Attached (Demo Sample ID)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                SIMULATED
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                <div>
                  <span className="font-label-md text-xs font-bold text-on-surface block">
                    {formData.certName}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Attached (Trade Diploma Certificate)
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                SIMULATED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: PRICING */}
      {currentStep === 7 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 7: Configure Transparent Tariff
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Set standard fees locked upfront for residents in {cityConfig.name}.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Standard Doorstep Visit & Inspection Charge
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-secondary">₹</span>
                <input
                  type="number"
                  value={formData.visitCharge}
                  onChange={(e) => updateFormData({ visitCharge: parseInt(e.target.value) || 99 })}
                  className="w-32 h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface"
                />
                <span className="text-[11px] text-secondary">Waived if repair work exceeds ₹300</span>
              </div>
            </div>

            <div>
              <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
                Starting Repair Labor Tariff Slab
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-secondary">₹</span>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => updateFormData({ hourlyRate: parseInt(e.target.value) || 220 })}
                  className="w-32 h-11 px-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface"
                />
                <span className="text-[11px] text-secondary">Base labor for minor repair / diagnosis</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between">
              <div>
                <span className="font-label-md text-xs font-bold text-on-surface block">
                  Accept Emergency Dispatches
                </span>
                <span className="text-[11px] text-secondary">
                  Receive priority urgent hazard broadcasts (e.g. burning smell, sparking)
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.emergencyAvailable}
                onChange={(e) => updateFormData({ emergencyAvailable: e.target.checked })}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: REVIEW PROFILE */}
      {currentStep === 8 && (
        <div className="flex flex-col gap-4 animate-in fade-in">
          <div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
              Step 8: Review Your Customer-Facing Card
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              This preview matches what residents will see before booking you.
            </p>
          </div>

          {/* Customer Preview Card */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-md flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src={formData.avatarUrl}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover bg-surface-container ring-1 ring-surface-container-high"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-sm text-sm font-bold text-on-surface truncate">
                    {formData.fullName || 'Rahul Kumar'}
                  </h3>
                  <span className="material-symbols-outlined text-primary text-[18px] fill-1">verified</span>
                </div>
                <p className="text-xs text-secondary capitalize">
                  {selectedTrade.name} · {formData.yearsExperience} yrs exp
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                  <span className="font-bold text-on-surface flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">star</span>
                    5.0 (New Pro)
                  </span>
                  <span className="text-secondary">•</span>
                  <span className="text-primary font-medium">
                    {cityConfig.clusters.find((c) => c.id === formData.primaryLocalityId)?.name || 'Local'}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed line-clamp-2">
              "{formData.description}"
            </p>

            <div className="flex flex-wrap gap-1">
              {formData.selectedSkills.slice(0, 3).map((sk) => (
                <span key={sk} className="px-2 py-0.5 rounded text-[10px] bg-surface-container font-medium text-on-surface">
                  {sk}
                </span>
              ))}
              {formData.selectedSkills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-secondary">
                  +{formData.selectedSkills.length - 3} more
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-surface-container/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span>
                <span>{formData.serviceRadiusKm} km coverage</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-on-surface">₹{formData.visitCharge}</span>
                <span className="text-[10px] text-secondary ml-1">visit fee</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons Dock */}
      <div className="mt-6 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 py-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer transition-colors"
          >
            Back
          </button>
        )}

        {currentStep < 8 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-primary-container transition-all"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitRegistration}
            disabled={isSubmitting}
            className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting Verification...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Submit for Verification (Demo)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
