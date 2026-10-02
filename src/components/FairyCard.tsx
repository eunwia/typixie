import React from 'react';
import { Fairy } from '../data/fairies';
import { Lock, Sparkles, Check, Coins, ArrowRight, Eye } from 'lucide-react';

interface FairyCardProps {
  fairy: Fairy;
  isUnlocked: boolean;
  isEquipped: boolean;
  userCoins: number;
  currentLevel: number;
  userFairyCustomName?: string;
  onEquip?: (fairyId: string) => void;
  onPurchase?: (fairyId: string) => void;
  onPreview?: (fairy: Fairy) => void;
  onNavigateToShop?: () => void;
  mode?: 'collection' | 'shop';
  revealLocked?: boolean;
}

export const FairyCard: React.FC<FairyCardProps> = ({
  fairy,
  isUnlocked,
  isEquipped,
  userCoins,
  currentLevel,
  userFairyCustomName,
  onEquip,
  onPurchase,
  onPreview,
  onNavigateToShop,
  mode = 'collection',
  revealLocked = false,
}) => {
  const isDefaultFairy = fairy.id === 'your-fairy';
  const displayName = isDefaultFairy && userFairyCustomName ? userFairyCustomName : fairy.name;
  const canAfford = fairy.price !== undefined && userCoins >= fairy.price;

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-5 sm:p-6 transition-all duration-300 border ${
        isEquipped
          ? 'bg-gradient-to-b from-white to-fairy-pink-light/35 border-fairy-pink shadow-md shadow-fairy-pink/15 ring-2 ring-fairy-pink/40 scale-[1.01]'
          : isUnlocked
          ? 'bg-white/95 border-fairy-pink-light/80 hover:border-fairy-pink hover:shadow-card-hover hover:-translate-y-1'
          : 'bg-white/70 border-gray-200/90'
      }`}
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Element Tag */}
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{
            backgroundColor: `${fairy.accentColor}25`,
            color: '#514A50',
          }}
        >
          {fairy.element}
        </span>

        {/* Status Badge */}
        {isEquipped ? (
          <span className="flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-fairy-pink text-white shadow-xs">
            <Check className="w-3.5 h-3.5" /> EQUIPPED
          </span>
        ) : isUnlocked ? (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-fairy-green-light text-green-800">
            Unlocked
          </span>
        ) : fairy.unlockType === 'level' ? (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-fairy-yellow-light text-yellow-800">
            <Lock className="w-3 h-3" /> Lv.{fairy.requiredLevel}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-50 text-pink-700">
            <Coins className="w-3 h-3 text-yellow-600" /> {fairy.price} Coins
          </span>
        )}
      </div>

      {/* Fairy Illustration */}
      <div className="relative w-full aspect-square max-h-48 my-2 flex items-center justify-center rounded-2xl bg-fairy-bg-secondary/70 p-2 overflow-hidden group">
        <img
          src={fairy.image}
          alt={fairy.name}
          className={`w-full h-full object-contain transition-transform duration-500 ${
            isUnlocked || revealLocked
              ? 'animate-float group-hover:scale-105'
              : 'grayscale brightness-90 contrast-75 opacity-60'
          }`}
          loading="lazy"
        />

        {/* Lock Overlay on Image */}
        {!isUnlocked && (
          revealLocked ? (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs border border-fairy-pink-light/80 flex items-center gap-1.5 text-[11px] font-bold text-fairy-text">
              <Lock className="w-3 h-3 text-fairy-pink" />
              <span>{fairy.unlockType === 'level' ? `Lv.${fairy.requiredLevel}` : `${fairy.price} Coins`}</span>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-fairy-bg/40 backdrop-blur-[1.5px] p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-white/95 shadow-md flex items-center justify-center text-fairy-text-secondary mb-2 border border-fairy-pink-light">
                <Lock className="w-5 h-5 text-fairy-pink" />
              </div>
              <p className="text-xs font-bold text-fairy-text px-2.5 py-1 rounded-lg bg-white/90 shadow-xs border border-gray-100">
                {fairy.unlockType === 'level'
                  ? `Reach Level ${fairy.requiredLevel}`
                  : `Fairy Shop: ${fairy.price} Coins`}
              </p>
            </div>
          )
        )}
      </div>

      {/* Fairy Info */}
      <div className="my-3 text-left">
        <div className="flex items-baseline justify-between gap-1">
          <h3 className="font-extrabold text-lg sm:text-xl text-fairy-text tracking-tight">
            {displayName}
          </h3>
          <span className="text-xs text-fairy-pink font-semibold">
            {fairy.title}
          </span>
        </div>
        
        <p className="text-xs text-fairy-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
          {fairy.description}
        </p>

        {/* Fairy Quote */}
        <p className="text-[11px] text-fairy-pink font-medium italic mt-2 line-clamp-1">
          "{fairy.quote}"
        </p>
      </div>

      {/* Action Area */}
      <div className="pt-3 border-t border-fairy-pink-light/50">
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              type="button"
              onClick={() => onPreview(fairy)}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-fairy-bg-secondary text-fairy-text font-bold text-xs border border-fairy-pink-light/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              title="Preview Fairy"
            >
              <Eye className="w-3.5 h-3.5 text-fairy-pink" />
              <span>Preview</span>
            </button>
          )}

          {isEquipped ? (
            <div className="flex-1 py-2.5 rounded-xl bg-fairy-bg-secondary text-fairy-text-secondary font-bold text-xs text-center border border-fairy-pink-light/60">
              Equipped
            </div>
          ) : isUnlocked ? (
            <button
              type="button"
              onClick={() => onEquip?.(fairy.id)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-fairy-pink hover:bg-fairy-pink/90 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Equip</span>
            </button>
          ) : mode === 'shop' ? (
            <button
              type="button"
              onClick={() => onPurchase?.(fairy.id)}
              disabled={!canAfford}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                canAfford
                  ? 'bg-gradient-to-r from-fairy-pink to-pink-400 hover:opacity-95 text-white active:scale-95 cursor-pointer shadow-fairy-pink/20'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{canAfford ? `Adopt (${fairy.price})` : `${fairy.price} Coins`}</span>
            </button>
          ) : fairy.unlockType === 'level' ? (
            <div className="flex-1 py-2 rounded-xl bg-fairy-bg-secondary text-fairy-text-secondary text-xs text-center font-medium border border-fairy-pink-light/40">
              Unlocks at Lv.{fairy.requiredLevel}
            </div>
          ) : (
            <button
              type="button"
              onClick={onNavigateToShop}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-fairy-bg-secondary text-fairy-text font-bold text-xs border border-fairy-pink-light/80 shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer group"
            >
              <span>Shop</span>
              <ArrowRight className="w-3.5 h-3.5 text-fairy-pink group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
