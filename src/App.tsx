import React, { useState } from 'react';
import { useTypixie } from './context/TypixieContext';
import { Navbar, NavTab } from './components/Navbar';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { TypingTestPage } from './pages/TypingTestPage';
import { MyFairies } from './pages/MyFairies';
import { FairyShop } from './pages/FairyShop';
import { Profile } from './pages/Profile';
import { LevelUpModal } from './components/LevelUpModal';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const { userData } = useTypixie();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // First time user onboarding
  if (!userData.isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen bg-fairy-bg text-fairy-text flex flex-col selection:bg-fairy-pink-light selection:text-fairy-text">
      {/* Top Navbar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && <Dashboard onNavigate={setCurrentTab} />}
        {currentTab === 'typing' && <TypingTestPage onNavigate={setCurrentTab} />}
        {currentTab === 'fairies' && <MyFairies onNavigate={setCurrentTab} />}
        {currentTab === 'shop' && <FairyShop onNavigate={setCurrentTab} />}
        {currentTab === 'profile' && <Profile onNavigate={setCurrentTab} />}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-fairy-pink-light/40 bg-white/60 text-center text-xs text-fairy-text-secondary">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
          <p className="text-xs text-fairy-text-secondary font-medium">
            © 2026 Trixette Rain Montalalna. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Level Up Celebration Modal */}
      <LevelUpModal />
    </div>
  );
};

export default App;
