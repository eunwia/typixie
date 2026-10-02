import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useTypixie } from '../context/TypixieContext';
import { Sparkles, Trophy, ArrowRight, Check } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

export const LevelUpModal: React.FC = () => {
  const { levelUpCelebration, dismissLevelUpCelebration, levelDetails, equipFairy, equippedFairy } = useTypixie();

  useEffect(() => {
    if (levelUpCelebration) {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F4A6B7', '#FADCE3', '#F9E7A7', '#B9D5A4', '#FFFFFF'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [levelUpCelebration]);

  if (!levelUpCelebration) return null;

  const { newLevel, newFairiesUnlocked } = levelUpCelebration;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fairy-text/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-fairy-pink-light/80 text-center animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft decorative background circles */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-fairy-pink-light/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-fairy-yellow-light/40 rounded-full blur-2xl pointer-events-none" />

        {/* Floating Sparkle Elements */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-fairy-pink animate-sparkle" />
          <span className="text-xs uppercase tracking-widest font-extrabold text-fairy-pink">
            Sanctuary Level Achieved
          </span>
          <Sparkles className="w-5 h-5 text-fairy-yellow animate-sparkle" />
        </div>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-fairy-text tracking-tight mb-2">
          LEVEL UP!
        </h2>
        
        <p className="text-fairy-text-secondary text-xs sm:text-sm mb-6">
          Your keystrokes have awakened deeper magic in the fairy sanctuary!
        </p>

        {/* Level badge */}
        <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-fairy-pink-light/60 via-fairy-yellow-light/60 to-fairy-green-light/60 rounded-2xl border border-fairy-pink-light mb-6 shadow-xs">
          <Trophy className="w-6 h-6 text-yellow-600 fill-yellow-400" />
          <span className="text-2xl font-black text-fairy-text">
            Level {newLevel}
          </span>
        </div>

        {/* EXP Progress preview */}
        <div className="bg-fairy-bg-secondary p-4 rounded-2xl border border-fairy-pink-light/40 mb-6 text-left">
          <div className="flex justify-between items-center text-xs font-bold text-fairy-text mb-2">
            <span>Next Goal: Level {newLevel + 1}</span>
            <span className="text-fairy-text-secondary">
              {levelDetails.expIntoCurrentLevel} of {levelDetails.expNeededForNextLevel} EXP
            </span>
          </div>
          <ProgressBar progress={levelDetails.progressPercentage} color="pink" height="sm" />
        </div>

        {/* Newly Unlocked Fairies */}
        {newFairiesUnlocked.length > 0 && (
          <div className="mb-6 p-4 bg-fairy-green-light/30 rounded-2xl border border-fairy-green-light text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Fairy Companion Unlocked!</span>
            </div>
            {newFairiesUnlocked.map((fairy) => {
              const isEquipped = equippedFairy.id === fairy.id;
              return (
                <div key={fairy.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-fairy-green/30 shadow-2xs mt-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={fairy.image}
                      alt={fairy.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                    <div>
                      <p className="font-bold text-sm text-fairy-text">{fairy.name}</p>
                      <p className="text-xs text-fairy-text-secondary">{fairy.title}</p>
                    </div>
                  </div>
                  {isEquipped ? (
                    <span className="text-xs font-bold text-fairy-pink flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Equipped
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => equipFairy(fairy.id)}
                      className="px-3 py-1.5 bg-fairy-pink hover:bg-pink-400 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
                    >
                      Equip Now
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={dismissLevelUpCelebration}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fairy-pink to-pink-400 hover:from-pink-400 hover:to-fairy-pink text-white font-bold text-base shadow-md shadow-fairy-pink/25 hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
