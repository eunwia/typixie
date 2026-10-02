import React from 'react';
import { TypingTestBox } from '../components/TypingTestBox';
import { NavTab } from '../components/Navbar';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface TypingTestPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const TypingTestPage: React.FC<TypingTestPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fade-in space-y-4">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-fairy-bg-secondary text-xs font-bold text-fairy-text-secondary hover:text-fairy-text border border-fairy-pink-light/60 transition-all shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-fairy-pink">
          <Sparkles className="w-3.5 h-3.5 animate-sparkle" />
          <span>Distraction-Free Mode</span>
        </div>
      </div>

      {/* Main Typing Area */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-8 shadow-card border border-fairy-pink-light/80">
        <TypingTestBox showCompanionBanner={true} />
      </div>
    </div>
  );
};
