import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { ProgressBar } from '../components/ProgressBar';
import { NavTab } from '../components/Navbar';
import { 
  User, 
  Edit3, 
  Check, 
  X, 
  Coins, 
  Sparkles, 
  Trophy, 
  Target, 
  Zap, 
  BookOpen, 
  Heart, 
  RotateCcw, 
  AlertTriangle,
  History
} from 'lucide-react';

interface ProfileProps {
  onNavigate: (tab: NavTab) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { 
    userData, 
    equippedFairy, 
    allFairies, 
    currentLevel, 
    levelDetails, 
    averageAccuracy, 
    renameFairy, 
    resetProgress 
  } = useTypixie();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userData.userFairyName);
  const [nameError, setNameError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unlockedCount = userData.unlockedFairyIds.length;
  const totalCount = allFairies.length;
  const collectionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("Please enter a valid fairy name");
      return;
    }
    if (trimmed.length > 20) {
      setNameError("Name must be 20 characters or fewer");
      return;
    }
    renameFairy(trimmed);
    setIsEditingName(false);
    setNameError('');
  };

  const handleCancelName = () => {
    setNameInput(userData.userFairyName);
    setIsEditingName(false);
    setNameError('');
  };

  const handleConfirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-fairy-pink-light/70 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-fairy-pink-light/30 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Equipped Fairy Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-fairy-bg-secondary to-fairy-pink-light/40 p-2 border-2 border-fairy-pink/60 shadow-md flex items-center justify-center animate-float flex-shrink-0">
              <img
                src={equippedFairy.image}
                alt={equippedFairy.name}
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => onNavigate('fairies')}
              className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white border border-fairy-pink-light text-fairy-pink shadow-xs hover:scale-110 transition-transform"
              title="Change Fairy"
            >
              <Heart className="w-4 h-4 fill-fairy-pink" />
            </button>
          </div>

          {/* User & Fairy Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-fairy-pink text-white">
                Fairy Keeper Profile
              </span>
              <span className="text-xs font-bold text-fairy-pink flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Level {currentLevel}
              </span>
            </div>

            {/* Editable Fairy Name */}
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="mt-2 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-fairy-pink focus:outline-none focus:ring-2 focus:ring-fairy-pink text-lg font-bold text-fairy-text"
                  autoFocus
                  maxLength={20}
                />
                <div className="flex items-center gap-1">
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-fairy-pink text-white hover:bg-pink-400 transition-colors"
                    title="Save Name"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelName}
                    className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {nameError && <p className="text-xs text-rose-500 font-bold">{nameError}</p>}
              </form>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <h1 className="text-2xl sm:text-3xl font-black text-fairy-text">
                  {userData.userFairyName || 'Your Fairy'}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 text-fairy-text-secondary hover:text-fairy-pink hover:bg-fairy-bg-secondary rounded-lg transition-colors"
                  title="Rename Fairy"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm text-fairy-text-secondary mt-1 font-medium">
              Companion Species: <span className="font-bold text-fairy-text">{equippedFairy.name}</span> ({equippedFairy.title})
            </p>

            {/* EXP Progress bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between items-center text-xs font-bold text-fairy-text-secondary mb-1">
                <span>Sanctuary Level {currentLevel}</span>
                <span>{userData.exp} Total EXP</span>
              </div>
              <ProgressBar progress={levelDetails.progressPercentage} color="pink" height="sm" />
              <p className="text-[11px] text-fairy-text-secondary mt-1">
                {levelDetails.expNeededForNextLevel > 0 
                  ? `${levelDetails.expNeededForNextLevel - levelDetails.expIntoCurrentLevel} EXP needed for Level ${currentLevel + 1}`
                  : 'Sanctuary Master!'}
              </p>
            </div>
          </div>

          {/* Coins & Fairies summary counters */}
          <div className="flex sm:flex-col gap-3 justify-center">
            <div className="p-3 bg-fairy-yellow-light/60 rounded-2xl border border-fairy-yellow/60 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-yellow-800 text-xs font-bold mb-0.5">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span>Coins</span>
              </div>
              <p className="text-2xl font-black text-fairy-text">{userData.coins}</p>
            </div>

            <div className="p-3 bg-fairy-bg-secondary rounded-2xl border border-fairy-pink-light/60 text-center min-w-[110px]">
              <div className="flex items-center justify-center gap-1 text-fairy-pink text-xs font-bold mb-0.5">
                <Heart className="w-4 h-4 fill-fairy-pink" />
                <span>Fairies</span>
              </div>
              <p className="text-2xl font-black text-fairy-text">{unlockedCount} of {totalCount}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Comprehensive Statistics Grid */}
      <div>
        <h2 className="text-lg font-extrabold text-fairy-text mb-4 flex items-center gap-2">
          <span>Typing & Sanctuary Statistics</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Best WPM */}
          <div className="bg-white p-5 rounded-2xl border border-fairy-pink-light/70 shadow-2xs text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-fairy-pink-light/50 flex items-center justify-center p-1 mb-2">
              <img
                src="/profile-icons/best-speed-icon.webp"
                alt="Best Speed"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-xs font-bold text-fairy-text-secondary uppercase">Best Speed</p>
            <p className="text-3xl font-black text-fairy-text mt-1">{userData.bestWpm}</p>
            <span className="text-[11px] text-fairy-text-secondary">WPM record</span>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white p-5 rounded-2xl border border-fairy-pink-light/70 shadow-2xs text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-fairy-green-light/50 flex items-center justify-center p-1 mb-2">
              <img
                src="/profile-icons/avg-accuracy-icon.webp"
                alt="Avg Accuracy"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-xs font-bold text-fairy-text-secondary uppercase">Avg Accuracy</p>
            <p className="text-3xl font-black text-fairy-text mt-1">{averageAccuracy}%</p>
            <span className="text-[11px] text-fairy-text-secondary">across all tests</span>
          </div>

          {/* Words Typed */}
          <div className="bg-white p-5 rounded-2xl border border-fairy-pink-light/70 shadow-2xs text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-fairy-yellow-light/50 flex items-center justify-center p-1 mb-2">
              <img
                src="/profile-icons/words-typed-icon.webp"
                alt="Words Typed"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-xs font-bold text-fairy-text-secondary uppercase">Words Typed</p>
            <p className="text-3xl font-black text-fairy-text mt-1">{userData.totalWordsTyped.toLocaleString()}</p>
            <span className="text-[11px] text-fairy-text-secondary">total completed</span>
          </div>

          {/* Tests Completed */}
          <div className="bg-white p-5 rounded-2xl border border-fairy-pink-light/70 shadow-2xs text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-fairy-bg-secondary flex items-center justify-center p-1 mb-2">
              <img
                src="/profile-icons/tests-finished-icon.webp"
                alt="Tests Finished"
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="text-xs font-bold text-fairy-text-secondary uppercase">Tests Finished</p>
            <p className="text-3xl font-black text-fairy-text mt-1">{userData.testsCompleted}</p>
            <span className="text-[11px] text-fairy-text-secondary">practice sessions</span>
          </div>

        </div>
      </div>
            <h3 className="font-extrabold text-base sm:text-lg text-fairy-text">
              Recent Practice History
            </h3>
      {/* Recent Typing History */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-fairy-pink-light/70">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold text-fairy-text-secondary">
            Showing last {Math.min(userData.testHistory.length, 10)} runs
          </span>
        </div>

        {userData.testHistory.length === 0 ? (
          <div className="py-8 text-center text-fairy-text-secondary text-sm">
            <p>No typing tests completed yet.</p>
            <button
              type="button"
              onClick={() => onNavigate('typing')}
              className="mt-3 px-4 py-2 rounded-xl bg-fairy-pink text-white font-bold text-xs shadow-sm hover:bg-pink-400 transition-colors"
            >
              Take Your First Test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-fairy-pink-light/50 text-fairy-text-secondary text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">WPM</th>
                  <th className="py-2.5 px-3">Accuracy</th>
                  <th className="py-2.5 px-3">Rewards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userData.testHistory.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="hover:bg-fairy-bg-secondary/40 transition-colors font-medium">
                    <td className="py-3 px-3 text-fairy-text-secondary">{entry.date}</td>
                    <td className="py-3 px-3">{entry.duration}s</td>
                    <td className="py-3 px-3 font-bold text-fairy-text">{entry.wpm}</td>
                    <td className="py-3 px-3 text-green-600 font-semibold">{entry.accuracy}%</td>
                    <td className="py-3 px-3">
                      <span className="text-fairy-pink font-bold">+{entry.expEarned} EXP</span>
                      <span className="text-yellow-700 font-bold ml-2">+{entry.coinsEarned} Coins</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger Zone: Reset Progress with confirmation */}
      <div className="p-6 rounded-3xl bg-rose-50/70 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Reset All Progress</span>
          </h4>
          <p className="text-xs text-rose-600/90 mt-0.5 max-w-md">
            This will permanently reset your fairy name, level, EXP, coins, unlocked fairies, and typing test records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-100 text-rose-600 border border-rose-300 font-bold text-xs transition-colors flex items-center gap-1.5 active:scale-95 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fairy-text/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-rose-200 text-center animate-scale-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-fairy-text mb-2">
              Are you completely sure?
            </h3>
            <p className="text-xs text-fairy-text-secondary mb-6 leading-relaxed">
              All your hard work, typing speeds, and beloved fairy companions will be cleared. You will start fresh at Level 1.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-fairy-text font-bold text-xs transition-colors"
              >
                Keep Progress
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
