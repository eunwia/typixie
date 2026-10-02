import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { FairyCard } from '../components/FairyCard';
import { Fairy } from '../data/fairies';
import { NavTab } from '../components/Navbar';
import { Store, Coins, Sparkles, CheckCircle2, AlertCircle, Keyboard, Heart, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FairyShopProps {
  onNavigate: (tab: NavTab) => void;
}

export const FairyShop: React.FC<FairyShopProps> = ({ onNavigate }) => {
  const { allFairies, userData, equippedFairy, currentLevel, purchaseFairy, equipFairy } = useTypixie();
  
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [previewFairy, setPreviewFairy] = useState<Fairy | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handlePurchase = (fairyId: string) => {
    const result = purchaseFairy(fairyId);
    if (result.success) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#F9E7A7', '#F4A6B7', '#B9D5A4', '#FFF6D9'],
          disableForReducedMotion: true,
        });
      } catch (e) {
        console.error(e);
      }
      showToast('success', result.message);
    } else {
      showToast('error', result.message);
    }
  };

  const handleEquip = (fairyId: string) => {
    equipFairy(fairyId);
    const f = allFairies.find(item => item.id === fairyId);
    showToast('success', `${f?.name || 'Fairy'} is now your companion!`);
  };

  // Fairies available in the shop
  const shopFairies = allFairies.filter((f) => f.unlockType === 'shop');
  
  // Fairies unlocked by leveling
  const levelFairies = allFairies.filter((f) => f.unlockType === 'level');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-lg border-2 flex items-center gap-2.5 animate-scale-in max-w-sm ${
            toast.type === 'success'
              ? 'bg-white border-fairy-pink text-fairy-text shadow-fairy-pink/20'
              : 'bg-rose-50 border-rose-300 text-rose-800 shadow-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-fairy-pink flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold leading-snug">{toast.message}</span>
        </div>
      )}

      {/* Top Header: User coins & Magical Garden Boutique directly at top */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-fairy-pink-light/50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fairy-yellow-light text-yellow-800 text-xs font-bold mb-1.5 border border-fairy-yellow/60">
            <Store className="w-3.5 h-3.5 text-yellow-600" />
            <span>Fairy Shop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-fairy-text tracking-tight">
            Magical Garden Boutique
          </h1>
        </div>

        {/* User Coins Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/95 border-2 border-fairy-yellow/80 shadow-2xs">
            <Coins className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <div>
              <span className="text-[10px] font-bold text-fairy-text-secondary block leading-none uppercase tracking-wider">Your Coins</span>
              <span className="text-xl font-black text-fairy-text leading-none">{userData.coins}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('typing')}
            className="px-4 py-2.5 rounded-2xl bg-fairy-yellow-light hover:bg-fairy-yellow text-yellow-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Earn Coins</span>
          </button>
        </div>
      </div>

      {/* Adoptable Shop Fairies Section */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold text-fairy-text-secondary">
            {shopFairies.filter(f => userData.unlockedFairyIds.includes(f.id)).length} of {shopFairies.length} Adopted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shopFairies.map((fairy) => {
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
                onEquip={handleEquip}
                onPurchase={handlePurchase}
                onPreview={(f) => setPreviewFairy(f)}
                mode="shop"
              />
            );
          })}
        </div>
      </div>

      {/* Level-Unlockable Fairies Info Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-fairy-pink-light/70">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-fairy-text flex items-center gap-2">
              <Heart className="w-4 h-4 text-fairy-pink fill-fairy-pink" />
              <span>Level-Up Sanctuary Fairies</span>
            </h3>
            <p className="text-xs text-fairy-text-secondary mt-0.5">
              These fairies cannot be bought with coins — they awaken naturally as you level up your typing!
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('fairies')}
            className="text-xs font-bold text-fairy-pink hover:underline hidden sm:block cursor-pointer"
          >
            View in Collection →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {levelFairies.map((fairy) => {
            const isUnlocked = userData.unlockedFairyIds.includes(fairy.id);
            return (
              <div
                key={fairy.id}
                onClick={() => setPreviewFairy(fairy)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer hover:shadow-xs hover:-translate-y-0.5 ${
                  isUnlocked
                    ? 'bg-fairy-green-light/30 border-fairy-green/40'
                    : 'bg-fairy-bg-secondary/40 border-gray-200 opacity-75'
                }`}
                title="Click to preview"
              >
                <div className="w-14 h-14 mx-auto mb-1">
                  <img
                    src={fairy.image}
                    alt={fairy.name}
                    className={`w-full h-full object-contain ${!isUnlocked ? 'grayscale opacity-60' : ''}`}
                  />
                </div>
                <p className="text-xs font-bold text-fairy-text truncate">{fairy.name}</p>
                <span className="text-[10px] font-semibold text-fairy-text-secondary flex items-center justify-center gap-1 mt-0.5">
                  {isUnlocked ? (
                    <>
                      <Check className="w-3 h-3 text-green-600" />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <span>Req. Level {fairy.requiredLevel}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fairy Preview Modal */}
      {previewFairy && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewFairy(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-fairy-pink-light/80 text-center relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewFairy(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-fairy-text-secondary hover:text-fairy-text hover:bg-fairy-bg-secondary transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2"
              style={{
                backgroundColor: `${previewFairy.accentColor}25`,
                color: '#514A50',
              }}
            >
              {previewFairy.element} Element
            </span>

            <div className="w-48 h-48 mx-auto my-2 rounded-2xl bg-fairy-bg-secondary/70 p-4 flex items-center justify-center">
              <img
                src={previewFairy.image}
                alt={previewFairy.name}
                className="w-full h-full object-contain animate-float drop-shadow-md"
              />
            </div>

            <h3 className="text-2xl font-black text-fairy-text mt-2">{previewFairy.name}</h3>
            <p className="text-xs font-semibold text-fairy-pink">{previewFairy.title}</p>
            <p className="text-xs text-fairy-text-secondary mt-2 leading-relaxed px-2">{previewFairy.description}</p>
            <p className="text-xs text-fairy-pink font-medium italic mt-2">"{previewFairy.quote}"</p>

            <div className="mt-6 pt-4 border-t border-fairy-pink-light/50 flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewFairy(null)}
                className="flex-1 py-2.5 rounded-xl border border-fairy-pink-light/80 text-xs font-bold text-fairy-text hover:bg-fairy-bg-secondary transition-all cursor-pointer"
              >
                Close
              </button>
              {userData.unlockedFairyIds.includes(previewFairy.id) ? (
                <button
                  type="button"
                  onClick={() => {
                    handleEquip(previewFairy.id);
                    setPreviewFairy(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-fairy-pink text-white text-xs font-bold shadow-xs hover:bg-fairy-pink/90 transition-all cursor-pointer"
                >
                  Equip Fairy
                </button>
              ) : previewFairy.unlockType === 'shop' ? (
                <button
                  type="button"
                  onClick={() => {
                    handlePurchase(previewFairy.id);
                    setPreviewFairy(null);
                  }}
                  disabled={previewFairy.price !== undefined && userData.coins < previewFairy.price}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                    previewFairy.price !== undefined && userData.coins >= previewFairy.price
                      ? 'bg-gradient-to-r from-fairy-pink to-pink-400 text-white cursor-pointer shadow-fairy-pink/20'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{previewFairy.price !== undefined && userData.coins >= previewFairy.price ? `Adopt (${previewFairy.price} Coins)` : `Need ${previewFairy.price} Coins`}</span>
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-xl bg-fairy-bg-secondary text-fairy-text-secondary text-xs font-medium flex items-center justify-center">
                  Unlocks at Lv.{previewFairy.requiredLevel}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
