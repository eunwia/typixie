import React from 'react';
import { RotateCcw, Home, Sparkles, Trophy, Coins, Target, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { Fairy } from '../data/fairies';

interface TypingResultsProps {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
  expEarned: number;
  coinsEarned: number;
  equippedFairy: Fairy;
  userFairyName: string;
  onTryAgain: () => void;
  onReturnToDashboard: () => void;
}

export const TypingResults: React.FC<TypingResultsProps> = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  totalChars,
  duration,
  expEarned,
  coinsEarned,
  equippedFairy,
  userFairyName,
  onTryAgain,
  onReturnToDashboard,
}) => {
  const isHighAccuracy = accuracy >= 95;
  const isPerfectAccuracy = accuracy >= 98;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-fairy-pink-light/80 animate-scale-in text-center">
      
      {/* Fairy Greeting & Result header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-full bg-fairy-bg-secondary p-1 border-2 border-fairy-pink flex-shrink-0 animate-float">
          <img
            src={equippedFairy.image}
            alt={equippedFairy.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-fairy-pink uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Test Completed • {duration}s Mode</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-fairy-text">
            {wpm >= 60 ? 'Marvelous Typing Magic!' : 'Wonderful Practice Session!'}
          </h2>
          <p className="text-xs sm:text-sm text-fairy-text-secondary mt-0.5">
            {userFairyName || 'Your Fairy'} recorded every keystroke in the sanctuary annals.
          </p>
        </div>
      </div>

      {/* Main Score Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        
        {/* WPM */}
        <div className="bg-fairy-bg-secondary/70 p-4 rounded-2xl border border-fairy-pink-light/60 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-fairy-pink text-xs font-bold mb-1">
            <Zap className="w-4 h-4" />
            <span>SPEED</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-fairy-text tracking-tight">
            {wpm}
          </div>
          <span className="text-[11px] font-bold text-fairy-text-secondary mt-1">
            words per minute
          </span>
        </div>

        {/* Accuracy */}
        <div className="bg-fairy-bg-secondary/70 p-4 rounded-2xl border border-fairy-pink-light/60 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold mb-1">
            <Target className="w-4 h-4" />
            <span>ACCURACY</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-fairy-text tracking-tight">
            {accuracy}%
          </div>
          <span className="text-[11px] font-bold text-fairy-text-secondary mt-1">
            {isPerfectAccuracy ? 'Pristine precision' : isHighAccuracy ? 'Focused rhythm' : 'Keep practicing'}
          </span>
        </div>

        {/* EXP Reward */}
        <div className="bg-fairy-pink-light/40 p-4 rounded-2xl border border-fairy-pink/40 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-fairy-pink text-xs font-bold mb-1">
            <Trophy className="w-4 h-4" />
            <span>EXP EARNED</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-fairy-pink tracking-tight">
            +{expEarned}
          </div>
          <span className="text-[11px] font-bold text-fairy-text-secondary mt-1">
            {isHighAccuracy ? 'Includes accuracy bonus' : 'Experience points'}
          </span>
        </div>

        {/* Coins Reward */}
        <div className="bg-fairy-yellow-light/60 p-4 rounded-2xl border border-fairy-yellow/60 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-yellow-700 text-xs font-bold mb-1">
            <Coins className="w-4 h-4" />
            <span>COINS EARNED</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-yellow-700 tracking-tight">
            +{coinsEarned}
          </div>
          <span className="text-[11px] font-bold text-fairy-text-secondary mt-1">
            Fairy coins
          </span>
        </div>

      </div>

      {/* Detailed Character Breakdown */}
      <div className="bg-fairy-bg/60 rounded-2xl p-4 sm:p-5 border border-gray-100 mb-8 max-w-xl mx-auto">
        <h4 className="text-xs font-bold text-fairy-text-secondary uppercase tracking-wider mb-3">
          Detailed Keystroke Breakdown
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-white border border-fairy-green-light shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-green-600 text-xs font-semibold mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <p className="text-lg font-black text-fairy-text">{correctChars}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-red-100 shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-red-500 text-xs font-semibold mb-0.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect</span>
            </div>
            <p className="text-lg font-black text-fairy-text">{incorrectChars}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs">
            <div className="text-fairy-text-secondary text-xs font-semibold mb-0.5">
              Total Keystrokes
            </div>
            <p className="text-lg font-black text-fairy-text">{totalChars}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onTryAgain}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fairy-pink to-pink-400 hover:from-pink-400 hover:to-fairy-pink text-white font-bold text-sm shadow-md shadow-fairy-pink/25 hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={onReturnToDashboard}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-fairy-bg-secondary hover:bg-fairy-pink-light/40 text-fairy-text font-bold text-sm border border-fairy-pink-light transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4 text-fairy-pink" />
          <span>Back to Typing</span>
        </button>
      </div>

    </div>
  );
};
