import React, { useState } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { ProgressBar } from './ProgressBar';
import { Sparkles, Coins, Keyboard, Heart, Store, User as UserIcon, Home, Menu, X } from 'lucide-react';

export type NavTab = 'home' | 'typing' | 'fairies' | 'shop' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { userData, equippedFairy, currentLevel, levelDetails, isFocusTyping } = useTypixie();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'typing', label: 'Typing Test', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'fairies', label: 'My Fairies', icon: <Heart className="w-4 h-4" /> },
    { id: 'shop', label: 'Fairy Shop', icon: <Store className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-fairy-pink-light/60 shadow-xs transition-all duration-300 ${
      isFocusTyping ? 'opacity-20 blur-[0.5px] pointer-events-none' : 'opacity-100'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo with text-logo.png */}
          <button
            type="button"
            onClick={() => handleTabClick('home')}
            className="flex items-center group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-fairy-pink rounded-xl p-1 -ml-1 transition-transform active:scale-95"
            aria-label="Typixie Home"
          >
            <img
              src="/text-logo.png"
              alt="Typixie"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain drop-shadow-xs group-hover:opacity-90 transition-opacity"
            />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-fairy-bg-secondary/70 p-1.5 rounded-2xl border border-fairy-pink-light/40">
            {navLinks.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-fairy-pink shadow-xs scale-[1.02]'
                      : 'text-fairy-text-secondary hover:text-fairy-text hover:bg-white/50'
                  }`}
                >
                  <span className={isActive ? 'text-fairy-pink' : 'text-fairy-text-secondary'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Progress Header Stats */}
          <div className="flex items-center gap-3">
            
            {/* Coins Badge */}
            <div
              onClick={() => handleTabClick('shop')}
              title="Fairy Coins - Click to visit shop"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fairy-yellow-light/80 border border-fairy-yellow/50 text-fairy-text shadow-2xs cursor-pointer hover:bg-fairy-yellow-light hover:scale-105 transition-all active:scale-95"
            >
              <Coins className="w-4 h-4 text-yellow-600 fill-yellow-400" />
              <span className="font-bold text-xs sm:text-sm tracking-wide">
                {userData.coins}
              </span>
            </div>

            {/* Level & EXP Badge */}
            <div
              onClick={() => handleTabClick('profile')}
              title={`Level ${currentLevel} (${levelDetails.expIntoCurrentLevel} / ${levelDetails.expNeededForNextLevel} EXP)`}
              className="hidden sm:flex flex-col items-end cursor-pointer group bg-fairy-bg-secondary/80 hover:bg-fairy-pink-light/40 px-3 py-1.5 rounded-2xl border border-fairy-pink-light/50 transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-fairy-text">
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-fairy-pink text-white font-extrabold shadow-2xs">
                  Lv.{currentLevel}
                </span>
                <span className="text-fairy-text-secondary group-hover:text-fairy-pink transition-colors">
                  {userData.exp} EXP
                </span>
              </div>
              <div className="w-20 mt-1">
                <ProgressBar
                  progress={levelDetails.progressPercentage}
                  color="pink"
                  height="sm"
                />
              </div>
            </div>

            {/* Equipped Fairy Avatar Pill */}
            <button
              type="button"
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white hover:bg-fairy-bg-secondary border border-fairy-pink-light/70 shadow-2xs transition-all hover:scale-105 active:scale-95"
              title={`${userData.userFairyName || 'Your Fairy'} (${equippedFairy.name})`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-fairy-pink-light/40 flex items-center justify-center border border-fairy-pink/30">
                <img
                  src={equippedFairy.image}
                  alt={equippedFairy.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-fairy-text leading-none truncate max-w-[90px]">
                  {userData.userFairyName || 'Your Fairy'}
                </p>
                <p className="text-[10px] text-fairy-pink font-medium leading-tight">
                  {equippedFairy.title}
                </p>
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-fairy-text-secondary hover:text-fairy-pink hover:bg-fairy-bg-secondary transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-fairy-pink-light/50 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navLinks.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-fairy-pink-light text-fairy-pink font-bold shadow-2xs'
                        : 'text-fairy-text-secondary hover:bg-fairy-bg-secondary hover:text-fairy-text'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Mobile Level & EXP Bar */}
            <div className="p-3 bg-fairy-bg-secondary rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-fairy-text">Level {currentLevel}</span>
              <span className="text-fairy-text-secondary">
                {levelDetails.expIntoCurrentLevel} of {levelDetails.expNeededForNextLevel} EXP
              </span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
