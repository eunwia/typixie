import React from 'react';
import { useTypixie } from '../context/TypixieContext';
import { TypingTestBox } from '../components/TypingTestBox';
import { NavTab } from '../components/Navbar';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface TypingTestPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({ onNavigate }) => {
  const { isFocusTyping } = useTypixie();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fade-in space-y-4">
      {/* Main Typing Area */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-card border border-fairy-pink-light/80">
        <TypingTestBox showCompanionBanner={true} />
      </div>
    </div>
  );
};
