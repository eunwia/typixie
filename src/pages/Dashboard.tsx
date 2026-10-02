import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { ProgressBar } from '../components/ProgressBar';
import { TypingTestBox } from '../components/TypingTestBox';
import { NavTab } from '../components/Navbar';
import { getRandomMotivation } from '../data/motivations';
import { 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Coins, 
  Heart, 
  Store, 
  User, 
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { userData, equippedFairy, currentLevel, levelDetails, averageAccuracy } = useTypixie();
  const [motivation, setMotivation] = useState(() => getRandomMotivation());

  const handleRefreshMotivation = () => {
    setMotivation(getRandomMotivation());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-fade-in">
      
      {/* Top Banner: Daily Motivation Whisper */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-fairy-pink-light/40 via-fairy-yellow-light/30 to-fairy-green-light/40 border border-fairy-pink-light/60 px-4 py-2.5 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-fairy-pink shadow-2xs flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-fairy-text">
            "{motivation}"
          </p>
        </div>
        <button
          onClick={handleRefreshMotivation}
          title="New whisper"
          className="p-1.5 rounded-lg text-fairy-text-secondary hover:text-fairy-pink hover:bg-white/60 transition-all active:rotate-180 flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CENTERPIECE: The Typing Test & Fairy Companion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Typing Interface Area (9 cols on large screen) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white/90 backdrop-blur-xs rounded-3xl p-5 sm:p-7 shadow-card border border-fairy-pink-light/80">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-fairy-pink-light/40">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-fairy-text tracking-tight flex items-center gap-2">
                <span>Sanctuary Typing Grounds</span>
                <Sparkles className="w-4 h-4 text-fairy-pink animate-sparkle" />
              </h2>
              <p className="text-xs text-fairy-text-secondary">
                Type directly to begin. Practice makes your fairy magic bloom.
              </p>
            </div>
            
            {/* Active Companion Tag */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-fairy-bg-secondary border border-fairy-pink-light/70 text-xs font-bold text-fairy-text">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>{equippedFairy.name} active</span>
            </div>
          </div>

          {/* Typing test engine component */}
          <TypingTestBox showCompanionBanner={false} />
        </div>

        {/* Companion & Quick Access Sidebar (4 cols on large screen) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          
          {/* C. Fairy Companion Card */}
          <div className="bg-white rounded-3xl p-5 shadow-card border border-fairy-pink-light/70 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-fairy-pink-light/30 rounded-bl-full pointer-events-none" />
            
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-fairy-pink-light text-fairy-pink mb-2">
              <Heart className="w-3 h-3 fill-fairy-pink" />
              <span>Equipped Fairy</span>
            </div>

            {/* Fairy Float Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto my-2 animate-float relative">
              <img
                src={equippedFairy.image}
                alt={equippedFairy.name}
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>

            <h3 className="font-black text-lg text-fairy-text">
              {userData.userFairyName || 'Your Fairy'}
            </h3>
            <p className="text-xs font-bold text-fairy-pink">
              {equippedFairy.name} • {equippedFairy.title}
            </p>
            
            <p className="text-[11px] text-fairy-text-secondary italic mt-2 px-2 leading-relaxed">
              "{equippedFairy.quote}"
            </p>

            <button
              onClick={() => onNavigate('fairies')}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-fairy-bg-secondary hover:bg-fairy-pink-light/50 text-fairy-text hover:text-fairy-pink text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-fairy-pink" />
              <span>Change Companion</span>
            </button>
          </div>

          {/* E. Quick Access Links */}
          <div className="bg-white rounded-3xl p-4 shadow-card border border-fairy-pink-light/70 space-y-2">
            <h4 className="text-xs font-bold text-fairy-text-secondary uppercase tracking-wider px-1">
              Sanctuary Portals
            </h4>
            
            <button
              onClick={() => onNavigate('fairies')}
              className="w-full p-2.5 rounded-2xl bg-fairy-bg-secondary/60 hover:bg-fairy-pink-light/40 border border-fairy-pink-light/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
                  <img
                    src="/home-icons/my-fairies-icon.png"
                    alt="My Fairies"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-fairy-text group-hover:text-fairy-pink transition-colors">
                    My Fairies
                  </p>
                  <p className="text-[10px] text-fairy-text-secondary">
                    {userData.unlockedFairyIds.length} of 10 collected
                  </p>
                </div>
              </div>
              <span className="text-xs text-fairy-text-secondary group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full p-2.5 rounded-2xl bg-fairy-yellow-light/40 hover:bg-fairy-yellow-light/70 border border-fairy-yellow/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
                  <img
                    src="/home-icons/fairy-shop-icon.png"
                    alt="Fairy Shop"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-fairy-text group-hover:text-yellow-800 transition-colors">
                    Fairy Shop
                  </p>
                  <p className="text-[10px] text-fairy-text-secondary">
                    {userData.coins} coins available
                  </p>
                </div>
              </div>
              <span className="text-xs text-fairy-text-secondary group-hover:translate-x-0.5 transition-transform">→</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className="w-full p-2.5 rounded-2xl bg-fairy-bg-secondary/60 hover:bg-fairy-pink-light/40 border border-fairy-pink-light/40 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 shadow-2xs">
                  <img
                    src="/home-icons/profile-records-icon.png"
                    alt="Profile & Records"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-fairy-text group-hover:text-fairy-pink transition-colors">
                    Profile & Records
                  </p>
                  <p className="text-[10px] text-fairy-text-secondary">
                    Best: {userData.bestWpm} WPM
                  </p>
                </div>
              </div>
              <span className="text-xs text-fairy-text-secondary group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

        </div>

      </div>

      {/* D. COMPACT PROGRESS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Level & EXP Progress */}
        <div className="col-span-2 bg-white rounded-2xl p-4 sm:p-5 border border-fairy-pink-light/70 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2 py-0.5 rounded-md bg-fairy-pink text-white">
                Lv.{currentLevel}
              </span>
              <span className="text-xs font-bold text-fairy-text">
                Sanctuary Level
              </span>
            </div>
            <span className="text-xs font-bold text-fairy-pink">
              {userData.exp} Total EXP
            </span>
          </div>
          
          <ProgressBar progress={levelDetails.progressPercentage} color="pink" height="sm" />
          
          <p className="text-[11px] text-fairy-text-secondary mt-1.5 flex justify-between">
            <span>Progress: {levelDetails.progressPercentage}%</span>
            <span>
              {levelDetails.expNeededForNextLevel > 0 
                ? `${levelDetails.expNeededForNextLevel - levelDetails.expIntoCurrentLevel} EXP to Lv.${currentLevel + 1}`
                : 'Max Level!'}
            </span>
          </p>
        </div>

        {/* Tests Completed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-fairy-pink-light/70 shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fairy-bg-secondary flex items-center justify-center p-1.5 flex-shrink-0">
            <img
              src="/home-icons/completed-tests-icon.png"
              alt="Completed Tests"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-fairy-text-secondary uppercase">
              Completed Tests
            </p>
            <p className="text-xl sm:text-2xl font-black text-fairy-text">
              {userData.testsCompleted}
            </p>
          </div>
        </div>

        {/* Total Words Typed */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-fairy-pink-light/70 shadow-card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fairy-yellow-light/60 flex items-center justify-center p-1.5 flex-shrink-0">
            <img
              src="/home-icons/words-typed-icon.png"
              alt="Words Typed"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] font-bold text-fairy-text-secondary uppercase">
              Words Typed
            </p>
            <p className="text-xl sm:text-2xl font-black text-fairy-text">
              {userData.totalWordsTyped.toLocaleString()}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
