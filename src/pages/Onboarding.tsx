import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { Sparkles, Wand2, Heart } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useTypixie();
  const [fairyName, setFairyName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fairyName.trim();
    if (!trimmed) {
      setError("Please choose a sweet name for your fairy companion.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Fairy names are best kept under 20 characters.");
      return;
    }
    completeOnboarding(trimmed);
  };

  return (
    <div className="min-h-screen bg-fairy-bg flex items-center justify-center p-4 relative overflow-hidden fairy-bg-pattern">
      
      {/* Background Fairy Sanctuary Layer with clearly visible moderate opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-35 sm:opacity-40 transition-opacity duration-700"
        style={{ backgroundImage: `url('/fairy-sanctuary.png')` }}
        aria-hidden="true"
      />
      {/* Soft welcoming atmospheric wash overlay for guaranteed readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/60 via-[#FFFBFC]/40 to-white/70 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Decorative blurred background orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-fairy-pink-light/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-fairy-green-light/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fairy-yellow-light/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Onboarding Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-soft border border-fairy-pink-light/90 text-center animate-scale-in">
        
        {/* Typixie Logo */}
        <div className="inline-block relative mb-4">
          <img
            src="/text-logo.png"
            alt="Typixie Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain drop-shadow-xs"
          />
        </div>

        {/* Welcome Messages */}
        <h1 className="text-3xl sm:text-4xl font-black text-fairy-text tracking-tight mb-2">
          Welcome <span className="bg-gradient-to-r from-fairy-pink to-pink-500 text-transparent bg-clip-text">Fairy!</span>
        </h1>
        
        <p className="text-sm sm:text-base text-fairy-text font-medium mb-1">
          Every keystroke brings a little magic.
        </p>

        <p className="text-xs sm:text-sm text-fairy-text-secondary mb-6 italic">
          "Every fairy has a name. What shall we call yours?"
        </p>

        {/* Default Fairy Presentation */}
        <div className="relative my-6 p-6 rounded-2xl bg-gradient-to-b from-fairy-bg-secondary to-white border border-fairy-pink-light/60 max-w-xs mx-auto">
          <div className="w-40 h-40 mx-auto animate-float">
            <img
              src="/fairies/your-fairy.png"
              alt="Your Default Fairy"
              className="w-full h-full object-contain drop-shadow-sm"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-fairy-pink">
            <Heart className="w-3.5 h-3.5 fill-fairy-pink text-fairy-pink" />
            <span>Your First Companion</span>
          </div>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
          <div>
            <div className="relative">
              <input
                type="text"
                value={fairyName}
                onChange={(e) => {
                  setFairyName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your fairy's name..."
                maxLength={20}
                className="w-full px-5 py-3.5 rounded-2xl bg-fairy-bg-secondary/60 border border-fairy-pink-light/80 text-fairy-text placeholder-fairy-text-secondary/60 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-fairy-pink focus:bg-white transition-all text-center"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs font-semibold text-rose-500 mt-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-fairy-pink via-pink-400 to-fairy-pink hover:opacity-95 text-white font-extrabold text-base shadow-md shadow-fairy-pink/30 hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Bring My Fairy to Life</span>
            <Sparkles className="w-4 h-4 animate-sparkle" />
          </button>
        </form>

        <p className="text-[11px] text-fairy-text-secondary/80 mt-6">
          Your progress, fairy collection, and high scores will be saved safely.
        </p>

      </div>
    </div>
  );
};
