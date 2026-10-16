import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SATTHI_LOGO_URL } from '../data/mockData';

export const ProviderLogin: React.FC = () => {
  const { navigateTo, setRole, showToast } = useApp();

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('satthi123');
  const [otp, setOtp] = useState('1234');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = () => {
    if (!identifier || identifier.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setIsOtpSent(true);
    showToast('Demo OTP sent: 1234', 'info', 'sms');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMode === 'otp' && !isOtpSent) {
      handleSendOtp();
      return;
    }

    if (authMode === 'otp' && otp !== '1234' && otp.length !== 4) {
      setErrorMessage('Invalid OTP code. Please enter demo OTP 1234.');
      return;
    }

    if (authMode === 'password' && !password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setRole('provider');
      navigateTo('provider-dashboard');
      showToast('Welcome back, Rahul! Partner cockpit active.', 'success', 'login');
    }, 700);
  };

  const handleQuickDemoLogin = (profile: 'electrician' | 'plumber') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRole('provider');
      navigateTo('provider-dashboard');
      showToast(
        profile === 'electrician'
          ? 'Logged in as Rahul Kumar (Master Electrician)'
          : 'Logged in as Suresh M. (Senior Plumber)',
        'success',
        'badge'
      );
    }, 500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-margin py-8 pb-32">
      {/* Brand & Heading */}
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <img src={SATTHI_LOGO_URL} alt="SATTHI" className="h-10 w-auto object-contain" />
        <div className="flex items-center gap-1.5 mt-1">
          <span className="font-headline-sm text-lg font-extrabold text-on-surface">
            Partner Access Portal
          </span>
          <span className="font-label-sm text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-bold uppercase">
            PRO
          </span>
        </div>
        <p className="font-body-sm text-xs text-secondary max-w-xs">
          Sign in to manage your daily availability, receive dispatches, and check direct settlements.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-4">
        {/* Auth Method Tabs */}
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setAuthMode('otp');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              authMode === 'otp'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Mobile OTP (Instant)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              authMode === 'password'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Password Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          <div>
            <label className="font-label-sm text-xs font-bold text-on-surface block mb-1">
              Registered Mobile Number / Partner ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 material-symbols-outlined text-[18px] text-secondary">
                phone_iphone
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          {authMode === 'password' ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-xs font-bold text-on-surface">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Demo Password is: satthi123', 'info', 'lock')}
                  className="text-[11px] text-primary hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 material-symbols-outlined text-[18px] text-secondary">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>
          ) : (
            isOtpSent && (
              <div className="animate-in fade-in">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label-sm text-xs font-bold text-on-surface">Enter 4-Digit OTP</label>
                  <span className="text-[11px] text-secondary">Demo code: <strong>1234</strong></span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 material-symbols-outlined text-[18px] text-secondary">
                    pin
                  </span>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container-low border border-surface-container text-xs font-mono font-bold text-on-surface tracking-widest focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )
          )}

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-error-container/40 text-error text-xs font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-secondary">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span>Remember session</span>
            </label>
            <span className="text-secondary text-[11px]">Secure Prototype Auth</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-1 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:bg-primary-container transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{authMode === 'otp' && !isOtpSent ? 'Send Login OTP' : 'Sign In to Cockpit'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Persona Shortcuts */}
        <div className="pt-3 border-t border-surface-container/60">
          <span className="font-label-sm text-[11px] text-secondary font-bold block mb-2 text-center uppercase tracking-wider">
            Quick 1-Click Sandbox Logins
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('electrician')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left border border-surface-container cursor-pointer transition-colors"
            >
              <span className="text-xs font-bold text-on-surface block truncate">Rahul Kumar</span>
              <span className="text-[10px] text-primary font-medium block">⚡ Master Electrician</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('plumber')}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-left border border-surface-container cursor-pointer transition-colors"
            >
              <span className="text-xs font-bold text-on-surface block truncate">Suresh M.</span>
              <span className="text-[10px] text-primary font-medium block">🔧 Senior Plumber</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switch to Registration */}
      <div className="mt-4 text-center">
        <span className="text-xs text-secondary">New to SATTHI? </span>
        <button
          onClick={() => navigateTo('provider-register')}
          className="text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          Register as an Independent Pro
        </button>
      </div>

      {/* Demo Boundary Notice */}
      <div className="mt-6 p-3 rounded-xl bg-surface-container-low border border-surface-container text-center text-[11px] text-secondary leading-relaxed">
        <strong>Demo Simulation Boundary:</strong> Authentication is simulated for rapid prototype testing without requiring active cellular SMS gateways.
      </div>
    </div>
  );
};
