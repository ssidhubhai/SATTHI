import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RoleSwitcher } from './components/RoleSwitcher';
import { ToastContainer } from './components/ToastContainer';
import { CustomerHome } from './components/CustomerHome';
import { CategoryDetails } from './components/CategoryDetails';
import { ProviderProfile } from './components/ProviderProfile';
import { RequestForm } from './components/RequestForm';
import { MatchingRadar } from './components/MatchingRadar';
import { LiveTracking } from './components/LiveTracking';
import { ServiceInvoice } from './components/ServiceInvoice';
import { ActivityHistory } from './components/ActivityHistory';
import { HelpSupportModal } from './components/HelpSupportModal';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ProviderJobsBroadcast } from './components/ProviderJobsBroadcast';
import { ProviderActiveJob } from './components/ProviderActiveJob';
import { ProviderEarningsView } from './components/ProviderEarningsView';
import { ProviderProfileView } from './components/ProviderProfileView';

const MainContent: React.FC = () => {
  const { currentScreen, role, navigateTo } = useApp();

  const getHeaderProps = () => {
    if (role === 'provider') {
      switch (currentScreen) {
        case 'provider-dashboard':
          return { title: undefined, showBack: false };
        case 'provider-jobs':
          return {
            title: 'Jobs Broadcast Radar',
            showBack: true,
            onBack: () => navigateTo('provider-dashboard'),
          };
        case 'provider-active-job':
          return {
            title: 'Live Job Navigation & PIN',
            showBack: true,
            onBack: () => navigateTo('provider-dashboard'),
          };
        case 'provider-earnings':
          return {
            title: 'Earnings & Cashouts',
            showBack: true,
            onBack: () => navigateTo('provider-dashboard'),
          };
        case 'provider-profile':
          return {
            title: 'Pro Credentials & Settings',
            showBack: true,
            onBack: () => navigateTo('provider-dashboard'),
          };
        default:
          return { title: undefined, showBack: false };
      }
    }

    // Customer Mode Header Properties
    switch (currentScreen) {
      case 'home':
        return { title: undefined, showBack: false };
      case 'category-details':
        return { title: 'Service Category Details', showBack: true, onBack: () => navigateTo('home') };
      case 'provider-profile':
        return {
          title: 'Provider Profile & Rates',
          showBack: true,
          onBack: () => navigateTo('category-details'),
        };
      case 'request-form':
        return {
          title: 'Service Request & Diagnostics',
          showBack: true,
          onBack: () => navigateTo('category-details'),
        };
      case 'matching-radar':
        return {
          title: 'Real Time Matching Radar',
          showBack: true,
          onBack: () => navigateTo('request-form'),
        };
      case 'live-tracking':
        return {
          title: 'Live Tracking & Active Order',
          showBack: true,
          onBack: () => navigateTo('home'),
        };
      case 'service-invoice':
        return {
          title: 'Completed Service & Invoice',
          showBack: true,
          onBack: () => navigateTo('activity-history'),
        };
      case 'activity-history':
        return { title: undefined, showBack: false };
      case 'help':
        return { title: 'Help & Support Desk', showBack: true, onBack: () => navigateTo('home') };
      default:
        return { title: undefined, showBack: false };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md select-none overflow-x-hidden">
      <Header {...headerProps} />

      <main className="flex-1 w-full pt-16 bg-surface min-h-screen overflow-x-hidden">
        {/* Customer Screen Routing */}
        {role === 'customer' && (
          <>
            {currentScreen === 'home' && <CustomerHome />}
            {currentScreen === 'category-details' && <CategoryDetails />}
            {currentScreen === 'provider-profile' && <ProviderProfile />}
            {currentScreen === 'request-form' && <RequestForm />}
            {currentScreen === 'matching-radar' && <MatchingRadar />}
            {currentScreen === 'live-tracking' && <LiveTracking />}
            {currentScreen === 'service-invoice' && <ServiceInvoice />}
            {currentScreen === 'activity-history' && <ActivityHistory />}
            {currentScreen === 'help' && <HelpSupportModal />}
          </>
        )}

        {/* Provider Screen Routing */}
        {role === 'provider' && (
          <>
            {currentScreen === 'provider-dashboard' && <ProviderDashboard />}
            {currentScreen === 'provider-jobs' && <ProviderJobsBroadcast />}
            {currentScreen === 'provider-active-job' && <ProviderActiveJob />}
            {currentScreen === 'provider-earnings' && <ProviderEarningsView />}
            {currentScreen === 'provider-profile' && <ProviderProfileView />}
          </>
        )}
      </main>

      <BottomNav />
      <RoleSwitcher />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
