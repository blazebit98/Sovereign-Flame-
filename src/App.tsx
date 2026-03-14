import { useState, useEffect, useCallback } from 'react';
import type { Tab, UserProfile } from './types';
import { getProfile, saveProfile, getDayNumber, updateDayNumber, resetStreak } from './store';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { EmergencyButton } from './components/EmergencyButton';
import { EmergencyScreen } from './components/EmergencyScreen';
import { TodayScreen } from './components/TodayScreen';
import { BladeModal } from './components/BladeModal';
import { RelapseScreen } from './components/RelapseScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { SettingsScreen } from './components/SettingsScreen';

function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
      <div className="text-3xl mb-3 opacity-30">🔒</div>
      <h2 className="text-lg font-semibold text-[#9A9A9A] mb-1">{title}</h2>
      <p className="text-sm text-[#666] max-w-xs">
        This section is being forged. Continue your daily practice — the tools will appear as you advance.
      </p>
    </div>
  );
}

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showBlade, setShowBlade] = useState(false);
  const [showRelapse, setShowRelapse] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Initialize — check for existing profile or trigger onboarding
  useEffect(() => {
    const p = getProfile();
    if (!p || !p.onboardingComplete) {
      // No profile or incomplete onboarding — show onboarding
      setShowOnboarding(true);
      setInitialized(true);
    } else {
      // Existing complete profile — update day number and load
      const updated = updateDayNumber(p);
      saveProfile(updated);
      setProfile(updated);
      setInitialized(true);
    }
  }, []);

  // Update day number on visibility change (user returns to app)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && profile) {
        const updated = updateDayNumber(profile);
        saveProfile(updated);
        setProfile(updated);
        setRefreshKey((k) => k + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [profile]);

  const handleOnboardingComplete = useCallback((newProfile: UserProfile) => {
    saveProfile(newProfile);
    setProfile(newProfile);
    setShowOnboarding(false);
  }, []);

  const handleRelapse = useCallback((analysis: {
    trigger: string; emotionalState: string; environment: string;
    timeOfDay: string; earliestInterventionPoint: string; patchImplemented: string;
  }) => {
    if (!profile) return;
    const updated = resetStreak(profile, analysis);
    saveProfile(updated);
    setProfile(updated);
    setShowRelapse(false);
    setShowEmergency(false);
    setActiveTab('today');
    setRefreshKey((k) => k + 1);
  }, [profile]);

  const handleProfileUpdate = useCallback((updatedProfile: UserProfile) => {
    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleResetAllData = useCallback(() => {
    localStorage.clear();
    setProfile(null);
    setShowSettings(false);
    setShowOnboarding(true);
    setActiveTab('today');
    setRefreshKey((k) => k + 1);
  }, []);

  // Loading state
  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#D4A017] text-lg font-semibold animate-pulse">
          Igniting...
        </div>
      </div>
    );
  }

  // Onboarding flow — full screen, no other UI
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Should not happen, but safety guard
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#D4A017] text-lg font-semibold animate-pulse">
          Igniting...
        </div>
      </div>
    );
  }

  const dayNumber = getDayNumber(profile);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E8E8] flex flex-col">
      <Header
        dayNumber={dayNumber}
        onBladeOpen={() => setShowBlade(true)}
        onSettingsOpen={() => setShowSettings(true)}
      />

      <main className="flex-1 overflow-y-auto pb-28">
        {activeTab === 'today' && (
          <TodayScreen
            key={refreshKey}
            dayNumber={dayNumber}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        {activeTab === 'protocol' && <PlaceholderTab title="Protocol Reference" />}
        {activeTab === 'track' && <PlaceholderTab title="Tracking & Visualization" />}
        {activeTab === 'map' && <PlaceholderTab title="Journey Map" />}
        {activeTab === 'depth' && <PlaceholderTab title="Depth Knowledge" />}
      </main>

      {/* Emergency Button — always visible */}
      {!showEmergency && !showBlade && !showRelapse && !showSettings && (
        <EmergencyButton onClick={() => setShowEmergency(true)} />
      )}

      {/* Tab Bar — always at bottom */}
      {!showEmergency && !showBlade && !showRelapse && !showSettings && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Emergency Protocol Overlay */}
      {showEmergency && (
        <EmergencyScreen
          onClose={() => setShowEmergency(false)}
          onRelapse={() => {
            setShowEmergency(false);
            setShowRelapse(true);
          }}
          partnerName={profile.accountabilityPartnerName}
          partnerPhone={profile.accountabilityPartnerPhone}
        />
      )}

      {/* Blade Modal */}
      {showBlade && (
        <BladeModal onClose={() => setShowBlade(false)} />
      )}

      {/* Relapse Recovery */}
      {showRelapse && (
        <RelapseScreen
          profile={profile}
          dayNumber={dayNumber}
          onComplete={handleRelapse}
          onCancel={() => setShowRelapse(false)}
        />
      )}

      {/* Settings */}
      {showSettings && (
        <SettingsScreen
          profile={profile}
          onClose={() => setShowSettings(false)}
          onProfileUpdate={handleProfileUpdate}
          onResetAllData={handleResetAllData}
        />
      )}
    </div>
  );
}
