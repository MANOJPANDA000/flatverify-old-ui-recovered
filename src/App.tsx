import React, { useState, useEffect } from 'react';
import { SessionProvider, useSession } from './context/SessionContext';
import { Header, NavTab } from './components/Header';
import { HomeView } from './views/HomeView';
import { CalculatorView } from './views/CalculatorView';
import { ScannerView } from './views/ScannerView';
import { AuditsView } from './views/AuditsView';
import { AccountSettingsView } from './views/AccountSettingsView';
import { WelcomeView } from './views/WelcomeView';
import { CreateAccountView } from './views/CreateAccountView';
import { SignInView } from './views/SignInView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { BiometricUnlockView } from './views/BiometricUnlockView';
import { PropertyDetailsView } from './views/PropertyDetailsView';
import { BuilderAreaView } from './views/BuilderAreaView';
import { YourMeasurementsView } from './views/YourMeasurementsView';
import { ComparisonView } from './views/ComparisonView';

export const AppContent: React.FC = () => {
  const { user, isInitializing, isLocked } = useSession();
  const [activeTab, setActiveTab] = useState<NavTab>('create_account');

  // Handle Initial State & Redirects
  useEffect(() => {
    if (isInitializing) return;

    if (user.isGuest) {
      // If we are currently in a "protected" view but user is guest, go to welcome
      const protectedTabs: NavTab[] = ['home', 'calculator', 'scanner', 'audits', 'account', 'property_details', 'builder_area', 'your_measurements', 'comparison'];
      if (protectedTabs.includes(activeTab)) {
        setActiveTab('welcome');
      }
    } else {
      // If user is authenticated and on an auth tab, go to home
      const authTabs: NavTab[] = ['welcome', 'create_account', 'sign_in', 'forgot_password'];
      if (authTabs.includes(activeTab)) {
        setActiveTab('home');
      }
    }
  }, [user.isGuest, isInitializing, activeTab]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Handle Biometric Lock State
  if (!user.isGuest && isLocked) {
    return <BiometricUnlockView />;
  }

  const isAuthFlow = activeTab === 'welcome' || activeTab === 'create_account' || activeTab === 'sign_in' || activeTab === 'forgot_password';
  const isWorkflow = activeTab === 'property_details' || activeTab === 'builder_area' || activeTab === 'your_measurements' || activeTab === 'comparison';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-[#0F172A]">
      {/* Navigation Header - Only shown if NOT in auth flow and NOT in multi-step workflow */}
      {!isAuthFlow && !isWorkflow && <Header activeTab={activeTab} onTabChange={setActiveTab} />}

      {/* Main View Container */}
      <main className={`${!isAuthFlow ? 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6' : 'flex-1'}`}>
        {activeTab === 'welcome' && (
          <WelcomeView 
            onGetStarted={() => setActiveTab('create_account')}
            onSignIn={() => setActiveTab('sign_in')}
          />
        )}
        {activeTab === 'create_account' && (
          <CreateAccountView 
            onBack={() => setActiveTab('welcome')} 
            onSignIn={() => setActiveTab('sign_in')}
          />
        )}
        {activeTab === 'sign_in' && (
          <SignInView 
            onBack={() => setActiveTab('welcome')} 
            onCreateAccount={() => setActiveTab('create_account')}
            onForgotPassword={() => setActiveTab('forgot_password')}
          />
        )}
        {activeTab === 'forgot_password' && (
          <ForgotPasswordView 
            onBack={() => setActiveTab('sign_in')} 
            onSignIn={() => setActiveTab('sign_in')}
          />
        )}
        
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
        {activeTab === 'calculator' && <CalculatorView />}
        {activeTab === 'scanner' && <ScannerView />}
        {activeTab === 'audits' && <AuditsView onNavigate={setActiveTab} />}
        {activeTab === 'account' && <AccountSettingsView />}

        {activeTab === 'property_details' && (
          <PropertyDetailsView 
            onBack={() => setActiveTab('home')}
            onContinue={() => setActiveTab('builder_area')}
          />
        )}

        {activeTab === 'builder_area' && (
          <BuilderAreaView 
            onBack={() => setActiveTab('property_details')}
            onContinue={() => setActiveTab('your_measurements')}
          />
        )}

        {activeTab === 'your_measurements' && (
          <YourMeasurementsView 
            onBack={() => setActiveTab('builder_area')}
            onContinue={() => setActiveTab('comparison')}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonView 
            onBack={() => setActiveTab('your_measurements')}
            onContinue={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Simplified Minimal Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 mt-auto w-full">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0F172A]">Flatverify.ai</span>
            <span className="text-[#E2E8F0]">•</span>
            <span className="font-medium">Understand your property</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-blue-600 transition-colors cursor-pointer">Privacy</button>
            <span className="text-[#E2E8F0]">•</span>
            <button className="hover:text-blue-600 transition-colors cursor-pointer">Terms</button>
            <span className="text-[#E2E8F0]">•</span>
            <button className="hover:text-blue-600 transition-colors cursor-pointer">Help</button>
          </div>

          <div className="font-medium">
            © 2026 Flatverify.ai
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
