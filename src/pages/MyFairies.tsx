import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { FairyCard } from '../components/FairyCard';
import { ProgressBar } from '../components/ProgressBar';
import { NavTab } from '../components/Navbar';
import { Sparkles, Heart, Store, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface MyFairiesProps {
  onNavigate: (tab: NavTab) => void;
}

export const MyFairies: React.FC<MyFairiesProps> = ({ onNavigate }) => {
  const { allFairies, userData, equippedFairy, currentLevel, equipFairy } = useTypixie();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [revealLocked, setRevealLocked] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const unlockedCount = userData.unlockedFairyIds.length;
  const totalCount = allFairies.length;
  const collectionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const handleEquip = (fairyId: string) => {
    const success = equipFairy(fairyId);
    if (success) {
      const fairy = allFairies.find(f => f.id === fairyId);
      setFeedbackMessage(`${fairy?.name || 'Fairy'} is now your companion!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const filteredFairies = allFairies.filter((fairy) => {
    const isUnlocked = userData.unlockedFairyIds.includes(fairy.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      
      {/* Background Sanctuary Layer with 15% opacity and soft cover positioning */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-15 sm:opacity-20 transition-opacity duration-700"
        style={{ backgroundImage: `url('/fairy-sanctuary.png')` }}
        aria-hidden="true"
      />
      {/* Soft gradient wash to guarantee maximum readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#FFFBFC]/60 via-[#FFFBFC]/40 to-[#FFFBFC]/80 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main Content (Fully Opaque) */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
        
        {/* Toast feedback */}
        {feedbackMessage && (
          <div className="fixed top-24 right-6 z-50 bg-white/95 backdrop-blur-md border-2 border-fairy-pink px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-scale-in text-fairy-text font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Header Sanctuary Banner */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-card border border-fairy-pink-light/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-fairy-pink-light/30 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fairy-pink-light text-fairy-pink text-xs font-bold mb-2">
                <Heart className="w-3.5 h-3.5 fill-fairy-pink" />
                <span>Sanctuary Collection</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-fairy-text tracking-tight">
                My Fairies
              </h1>
              <p className="text-sm font-semibold text-fairy-pink mt-0.5">
                Your magical collection is growing!
              </p>
            </div>

            {/* Collection Progress Box */}
            <div className="bg-fairy-bg-secondary/90 p-4 sm:p-5 rounded-2xl border border-fairy-pink-light/60 min-w-[240px]">
              <div className="flex justify-between items-center text-xs font-bold text-fairy-text mb-2">
                <span>Sanctuary Progress</span>
                <span className="text-fairy-pink font-extrabold">{unlockedCount} of {totalCount} Fairies</span>
              </div>
              <ProgressBar progress={collectionPercentage} color="pink" height="md" />
              <div className="flex justify-between items-center text-[11px] text-fairy-text-secondary mt-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-fairy-yellow" />
                  <span>Level {currentLevel} Sanctuary</span>
                </span>
                <span className="font-bold text-fairy-pink">{collectionPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Filter Controls, Reveal Toggle & Shop Link */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-fairy-pink-light/40">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-fairy-bg-secondary p-1 rounded-2xl border border-fairy-pink-light/40 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filter === 'all'
                      ? 'bg-white text-fairy-pink shadow-xs'
                      : 'text-fairy-text-secondary hover:text-fairy-text'
                  }`}
                >
                  All ({allFairies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unlocked')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filter === 'unlocked'
                      ? 'bg-white text-fairy-pink shadow-xs'
                      : 'text-fairy-text-secondary hover:text-fairy-text'
                  }`}
                >
                  Unlocked ({unlockedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('locked')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    filter === 'locked'
                      ? 'bg-white text-fairy-pink shadow-xs'
                      : 'text-fairy-text-secondary hover:text-fairy-text'
                  }`}
                >
                  Locked ({totalCount - unlockedCount})
                </button>
              </div>

              {/* Reveal/Hide Locked Fairies Preview Toggle */}
              <button
                type="button"
                onClick={() => setRevealLocked(prev => !prev)}
                className={`px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer ${
                  revealLocked
                    ? 'bg-fairy-pink text-white border-fairy-pink shadow-xs'
                    : 'bg-white hover:bg-fairy-bg-secondary text-fairy-text border-fairy-pink-light/70'
                }`}
                title="Toggle reveal locked fairies preview"
              >
                {revealLocked ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hide Locked Fairies</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-fairy-pink" />
                    <span>Reveal Locked Fairies</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('shop')}
              className="px-4 py-2 rounded-2xl bg-fairy-yellow-light/80 hover:bg-fairy-yellow-light text-fairy-text border border-fairy-yellow/50 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs cursor-pointer"
            >
              <Store className="w-4 h-4 text-yellow-600" />
              <span>Visit Fairy Shop</span>
            </button>
          </div>
        </div>

        {/* Fairy Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFairies.map((fairy) => {
            const isUnlocked = userData.unlockedFairyIds.includes(fairy.id);
            const isEquipped = equippedFairy.id === fairy.id;

            return (
              <FairyCard
                key={fairy.id}
                fairy={fairy}
                isUnlocked={isUnlocked}
                isEquipped={isEquipped}
                userCoins={userData.coins}
                currentLevel={currentLevel}
                userFairyCustomName={userData.userFairyName}
                revealLocked={revealLocked}
                onEquip={handleEquip}
                onNavigateToShop={() => onNavigate('shop')}
                mode="collection"
              />
            );
          })}
        </div>

      </div>

    </div>
  );
};
