import React, { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { useTypixie } from '../context/TypixieContext';
import { useTypingEngine, TestDuration } from '../hooks/useTypingEngine';
import { TypingResults } from './TypingResults';
import { Timer, Zap, Target, Type, RotateCcw, Sparkles, MousePointer, Pause, Play } from 'lucide-react';

interface TypingTestBoxProps {
  onTestComplete?: () => void;
  className?: string;
  showCompanionBanner?: boolean;
}

export const TypingTestBox: React.FC<TypingTestBoxProps> = ({
  className = '',
  showCompanionBanner = true,
}) => {
  const { equippedFairy, userData, recordCompletedTest, isFocusTyping, setIsFocusTyping } = useTypixie();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);

  const {
    state,
    resetTest,
    resumeTest,
    togglePause,
    handleKeyDown,
  } = useTypingEngine(30);

  const [testResult, setTestResult] = useState<{
    wpm: number;
    accuracy: number;
    correctChars: number;
    incorrectChars: number;
    totalChars: number;
    duration: number;
    expEarned: number;
    coinsEarned: number;
  } | null>(null);

  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [caretPos, setCaretPos] = useState<{ x: number; y: number; height: number; visible: boolean }>({
    x: 0,
    y: 0,
    height: 32,
    visible: false,
  });
  const [scrollOffsetY, setScrollOffsetY] = useState<number>(0);

  const hasRecordedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input handler
  const focusInput = useCallback(() => {
    if (!state.isPaused) {
      inputRef.current?.focus();
      setIsFocused(true);
    }
  }, [state.isPaused]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Window key listener to refocus automatically on typing if not focused on another interactive element
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (state.isFinished) return;

      // ESC key toggles pause
      if (e.key === 'Escape') {
        if (state.isActive && !state.isFinished) {
          togglePause();
          return;
        }
      }

      if (state.isPaused) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ' || e.key === 'Tab') {
        focusInput();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [focusInput, state.isFinished, state.isActive, state.isPaused, togglePause]);

  // Handle caret positioning & smooth multi-line scrolling
  const updateCaret = useCallback(() => {
    if (state.isFinished || state.isPaused) {
      setCaretPos(prev => ({ ...prev, visible: false }));
      return;
    }

    const wrapper = wordsWrapperRef.current;
    if (!wrapper) return;

    const activeWordEl = wrapper.querySelector<HTMLElement>(`[data-word-idx="${state.currentWordIndex}"]`);
    if (!activeWordEl) return;

    // Check line offset for smooth scrolling
    const firstWordEl = wrapper.querySelector<HTMLElement>('[data-word-idx="0"]');
    const firstTop = firstWordEl?.offsetTop ?? 0;
    const currentWordTop = activeWordEl.offsetTop;
    const relativeLineTop = currentWordTop - firstTop;

    // If active word is on line 2 or beyond, scroll line smoothly so active line is always line 1 or 2
    if (relativeLineTop > 48) {
      setScrollOffsetY(relativeLineTop - 4);
    } else {
      setScrollOffsetY(0);
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const charElements = activeWordEl.querySelectorAll<HTMLElement>('[data-char-idx]');
    const extraCharElements = activeWordEl.querySelectorAll<HTMLElement>('[data-char-extra]');
    const typedLength = state.currentInput.length;
    const targetLength = charElements.length;

    let targetX = 0;
    let targetY = 0;
    let targetHeight = 28;

    if (typedLength < targetLength && charElements[typedLength]) {
      // Caret is directly on the current active character being typed
      const charRect = charElements[typedLength].getBoundingClientRect();
      targetX = charRect.left - wrapperRect.left;
      targetY = charRect.top - wrapperRect.top;
      targetHeight = charRect.height;
    } else if (extraCharElements.length > 0) {
      // Caret is after the last extra character typed
      const lastExtraRect = extraCharElements[extraCharElements.length - 1].getBoundingClientRect();
      targetX = lastExtraRect.right - wrapperRect.left;
      targetY = lastExtraRect.top - wrapperRect.top;
      targetHeight = lastExtraRect.height;
    } else if (charElements.length > 0) {
      // Caret is after the last character of the word (ready for Space)
      const lastCharRect = charElements[charElements.length - 1].getBoundingClientRect();
      targetX = lastCharRect.right - wrapperRect.left;
      targetY = lastCharRect.top - wrapperRect.top;
      targetHeight = lastCharRect.height;
    } else {
      const wordRect = activeWordEl.getBoundingClientRect();
      targetX = wordRect.left - wrapperRect.left;
      targetY = wordRect.top - wrapperRect.top;
      targetHeight = wordRect.height;
    }

    setCaretPos({
      x: targetX,
      y: targetY,
      height: targetHeight > 0 ? targetHeight : 28,
      visible: true,
    });
  }, [state.currentWordIndex, state.currentInput, state.isFinished, state.isPaused]);

  useLayoutEffect(() => {
    updateCaret();
  }, [updateCaret]);

  // Window resize & font ready listener
  useEffect(() => {
    const handleResize = () => updateCaret();
    window.addEventListener('resize', handleResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => updateCaret());
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCaret]);

  // Key press wrapper to handle typing activity & blinking
  const onKeyDownCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (state.isPaused) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        resumeTest();
      }
      return;
    }

    setIsTyping(true);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 450);

    // Focus Typing Mode: Activate when typing and reset idle timeout
    if (!state.isPaused && !state.isFinished && (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ')) {
      setIsFocusTyping(true);
      if (focusIdleTimerRef.current) {
        clearTimeout(focusIdleTimerRef.current);
      }
      focusIdleTimerRef.current = setTimeout(() => {
        setIsFocusTyping(false);
      }, 2500);
    }

    handleKeyDown(e);
  };

  // Restore surrounding UI when paused or finished
  useEffect(() => {
    if (state.isPaused || state.isFinished) {
      setIsFocusTyping(false);
      if (focusIdleTimerRef.current) clearTimeout(focusIdleTimerRef.current);
    }
  }, [state.isPaused, state.isFinished, setIsFocusTyping]);

  // Clean up focus typing mode on unmount
  useEffect(() => {
    return () => {
      setIsFocusTyping(false);
      if (focusIdleTimerRef.current) clearTimeout(focusIdleTimerRef.current);
    };
  }, [setIsFocusTyping]);

  // When test finishes, record rewards once
  useEffect(() => {
    if (state.isFinished && !hasRecordedRef.current) {
      hasRecordedRef.current = true;
      const rewards = recordCompletedTest({
        wpm: state.wpm,
        accuracy: state.accuracy,
        duration: state.duration,
        correctChars: state.correctCharsCount,
        incorrectChars: state.incorrectCharsCount,
        totalChars: state.totalCharsTyped,
        wordsTyped: state.currentWordIndex,
      });

      setTestResult({
        wpm: state.wpm,
        accuracy: state.accuracy,
        duration: state.duration,
        correctChars: state.correctCharsCount,
        incorrectChars: state.incorrectCharsCount,
        totalChars: state.totalCharsTyped,
        expEarned: rewards.expEarned,
        coinsEarned: rewards.coinsEarned,
      });
    }
  }, [
    state.isFinished,
    state.wpm,
    state.accuracy,
    state.duration,
    state.correctCharsCount,
    state.incorrectCharsCount,
    state.totalCharsTyped,
    state.currentWordIndex,
    recordCompletedTest,
  ]);

  const handleRestart = (newDur?: TestDuration) => {
    hasRecordedRef.current = false;
    setTestResult(null);
    setScrollOffsetY(0);
    setIsFocusTyping(false);
    if (focusIdleTimerRef.current) clearTimeout(focusIdleTimerRef.current);
    resetTest(newDur);
    setTimeout(() => {
      focusInput();
    }, 40);
  };

  const durations: TestDuration[] = [15, 30, 60, 120];

  // If finished, show the results view
  if (state.isFinished && testResult) {
    return (
      <div className={`w-full ${className}`}>
        <TypingResults
          wpm={testResult.wpm}
          accuracy={testResult.accuracy}
          correctChars={testResult.correctChars}
          incorrectChars={testResult.incorrectChars}
          totalChars={testResult.totalChars}
          duration={testResult.duration}
          expEarned={testResult.expEarned}
          coinsEarned={testResult.coinsEarned}
          equippedFairy={equippedFairy}
          userFairyName={userData.userFairyName}
          onTryAgain={() => handleRestart()}
          onReturnToDashboard={() => handleRestart()}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-full relative focus:outline-none ${className}`}
      onClick={focusInput}
    >
      {/* Hidden input to capture physical keyboard & mobile input */}
      <input
        ref={inputRef}
        type="text"
        value=""
        onKeyDown={onKeyDownCapture}
        onChange={() => {}}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Top Controls: Companion info & Duration selection */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 transition-all duration-300 ${
        isFocusTyping ? 'opacity-20 blur-[0.5px] pointer-events-none' : 'opacity-100'
      }`}>
        {/* Fairy Companion mini banner */}
        {showCompanionBanner ? (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-fairy-pink-light/70 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-fairy-bg-secondary p-0.5 border border-fairy-pink/30 flex-shrink-0 animate-float">
              <img
                src={equippedFairy.image}
                alt={equippedFairy.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-xs font-bold text-fairy-text">
                <span>{userData.userFairyName || 'Your Fairy'}</span>
                <Sparkles className="w-3 h-3 text-fairy-pink animate-sparkle" />
              </div>
              <p className="text-[11px] text-fairy-pink/90 font-medium italic line-clamp-1 max-w-[260px]">
                "{equippedFairy.quote}"
              </p>
            </div>
          </div>
        ) : <div />}

        {/* Duration Selectors & Pause Button */}
        <div className="flex items-center gap-2">
          {/* Pause / Resume button if active */}
          {state.isActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePause();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs border ${
                state.isPaused
                  ? 'bg-fairy-pink text-white border-fairy-pink animate-pulse'
                  : 'bg-white hover:bg-fairy-bg-secondary text-fairy-text border-fairy-pink-light/80'
              }`}
              title="Pause/Resume (ESC)"
            >
              {state.isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-fairy-pink" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-fairy-pink-light/70 shadow-2xs">
            <span className="text-xs font-bold text-fairy-text-secondary px-2 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-fairy-pink" />
              <span className="hidden sm:inline">Time:</span>
            </span>
            {durations.map((dur) => {
              const isSelected = state.duration === dur;
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart(dur);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-fairy-pink text-white shadow-sm shadow-fairy-pink/20 scale-105'
                      : 'text-fairy-text-secondary hover:text-fairy-text hover:bg-fairy-bg-secondary'
                  }`}
                >
                  {dur}s
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Statistics Row */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-4">
        {/* Timer */}
        <div className="bg-white/95 rounded-2xl p-2.5 sm:p-3 border border-fairy-pink-light/70 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-fairy-pink uppercase mb-0.5">
            <Timer className="w-3 h-3" />
            <span>Time</span>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black ${
              state.timeLeft <= 5 && state.isActive ? 'text-rose-500 animate-pulse' : 'text-fairy-text'
            }`}
          >
            {state.timeLeft}s
          </div>
        </div>

        {/* WPM */}
        <div className="bg-white/95 rounded-2xl p-2.5 sm:p-3 border border-fairy-pink-light/70 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-fairy-pink uppercase mb-0.5">
            <Zap className="w-3 h-3" />
            <span>WPM</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-fairy-text">
            {state.wpm}
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white/95 rounded-2xl p-2.5 sm:p-3 border border-fairy-pink-light/70 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 uppercase mb-0.5">
            <Target className="w-3 h-3" />
            <span>Accuracy</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-fairy-text">
            {state.accuracy}%
          </div>
        </div>

        {/* Typed Keystrokes */}
        <div className="bg-white/95 rounded-2xl p-2.5 sm:p-3 border border-fairy-pink-light/70 shadow-2xs text-center">
          <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold text-fairy-text-secondary uppercase mb-0.5">
            <Type className="w-3 h-3" />
            <span>Typed</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-fairy-text">
            {state.totalCharsTyped}
          </div>
        </div>
      </div>

      {/* Main Typing Words Area with Smooth 3-Line Monkeytype View */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft border-2 border-fairy-pink-light/80 hover:border-fairy-pink/60 transition-all cursor-text h-[160px] sm:h-[185px] md:h-[205px] overflow-hidden flex flex-col justify-start select-none"
      >
        {/* Soft prompt when idle */}
        {!state.isActive && state.currentInput.length === 0 && state.currentWordIndex === 0 && (
          <div className="absolute top-3.5 right-5 z-30 flex items-center gap-1.5 text-xs font-bold text-fairy-pink bg-fairy-pink-light/60 px-3 py-1 rounded-full animate-pulse-subtle pointer-events-none border border-fairy-pink/30 shadow-2xs">
            <Sparkles className="w-3 h-3" />
            <span>Type any key to start...</span>
          </div>
        )}

        {/* Focus overlay if blurred */}
        {!isFocused && !state.isPaused && (
          <div className="absolute inset-0 z-40 bg-white/70 backdrop-blur-xs flex items-center justify-center rounded-3xl cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-fairy-pink/50 shadow-md text-xs font-bold text-fairy-text animate-bounce">
              <MousePointer className="w-4 h-4 text-fairy-pink" />
              <span>Click or press any key to focus</span>
            </div>
          </div>
        )}

        {/* Pause Modal Overlay */}
        {state.isPaused && (
          <div className="absolute inset-0 z-50 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center rounded-3xl animate-fade-in p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-fairy-pink-light flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Pause className="w-6 h-6 text-fairy-pink" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-fairy-text mb-1">
              Typing Test Paused
            </h3>
            <p className="text-xs sm:text-sm text-fairy-text-secondary max-w-xs mb-4">
              Press <kbd className="px-2 py-0.5 rounded bg-gray-100 border border-gray-300 font-mono font-bold text-fairy-text">ESC</kbd> or click below to resume your typing test.
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resumeTest();
              }}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fairy-pink to-pink-400 hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-fairy-pink/25 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Test</span>
            </button>
          </div>
        )}

        {/* Scrollable Words Wrapper */}
        <div
          ref={wordsWrapperRef}
          className="relative transition-transform duration-200 ease-out will-change-transform"
          style={{ transform: `translate3d(0, -${scrollOffsetY}px, 0)` }}
        >
          {/* Smooth Gliding Monkeytype-style Caret (Positioned relative to wordsWrapperRef) */}
          {caretPos.visible && !state.isPaused && (
            <div
              className={`fairy-smooth-caret ${!isTyping ? 'blinking' : ''}`}
              style={{
                transform: `translate3d(${caretPos.x}px, ${caretPos.y}px, 0)`,
                height: `${caretPos.height}px`,
              }}
            />
          )}

          {/* Words Container */}
          <div className="flex flex-wrap gap-x-3.5 gap-y-3 font-mono text-xl sm:text-2xl md:text-[28px] leading-relaxed tracking-tight">
            {state.words.map((word, wordIdx) => {
              const isCurrent = wordIdx === state.currentWordIndex;
              const isPast = wordIdx < state.currentWordIndex;
              const typedWord = isCurrent
                ? state.currentInput
                : (state.typedHistory[wordIdx] || '');

              return (
                <span
                  key={wordIdx}
                  data-word-idx={wordIdx}
                  className={`inline-flex items-center px-1.5 py-0.5 rounded-lg transition-colors duration-150 ${
                    isCurrent ? 'bg-fairy-pink-light/35' : ''
                  }`}
                >
                  {/* Normal Word Characters */}
                  {word.split('').map((char, charIdx) => {
                    let charStyle = 'text-fairy-text-secondary/50 font-normal';

                    if (isCurrent) {
                      if (charIdx < typedWord.length) {
                        if (typedWord[charIdx] === char) {
                          // Correct character
                          charStyle = 'text-[#16A34A] font-bold';
                        } else {
                          // Incorrect character
                          charStyle = 'text-[#DC2626] bg-rose-100/90 rounded-xs font-bold';
                        }
                      }
                    } else if (isPast) {
                      if (charIdx < typedWord.length) {
                        if (typedWord[charIdx] === char) {
                          charStyle = 'text-[#16A34A] font-semibold';
                        } else {
                          charStyle = 'text-[#DC2626] bg-rose-100/80 rounded-xs font-semibold';
                        }
                      } else {
                        // Missed characters in past word
                        charStyle = 'text-[#DC2626]/80 underline decoration-rose-400 font-semibold';
                      }
                    }

                    return (
                      <span
                        key={charIdx}
                        data-char-idx={charIdx}
                        className={`inline-flex items-center leading-none transition-colors duration-75 ${charStyle}`}
                      >
                        {char}
                      </span>
                    );
                  })}

                  {/* Extra characters typed beyond target word */}
                  {typedWord.length > word.length &&
                    typedWord.slice(word.length).split('').map((extraChar, extraIdx) => (
                      <span
                        key={`extra-${extraIdx}`}
                        data-char-extra
                        className="inline-flex items-center leading-none text-[#991B1B] bg-rose-200/90 rounded-xs font-bold"
                      >
                        {extraChar}
                      </span>
                    ))}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Restart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRestart();
            }}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-fairy-bg-secondary text-fairy-text border border-fairy-pink-light/80 font-bold text-xs shadow-2xs hover:shadow-sm transition-all active:scale-95 flex items-center gap-2 group cursor-pointer"
            title="Restart Test (Tab)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-fairy-pink group-hover:-rotate-90 transition-transform duration-300" />
            <span>Restart</span>
          </button>

          {/* Pause / Resume Button */}
          {state.isActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePause();
              }}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-fairy-bg-secondary text-fairy-text border border-fairy-pink-light/80 font-bold text-xs shadow-2xs hover:shadow-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              title="Pause/Resume (ESC)"
            >
              {state.isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-fairy-pink fill-fairy-pink" />
                  <span>Resume (ESC)</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-fairy-pink" />
                  <span>Pause (ESC)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Keystroke hints */}
        <p className="text-[11px] text-fairy-text-secondary font-medium">
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono shadow-2xs font-bold text-fairy-text">Space</kbd> next word • <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono shadow-2xs font-bold text-fairy-text">Backspace</kbd> edit • <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono shadow-2xs font-bold text-fairy-text">ESC</kbd> pause • <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono shadow-2xs font-bold text-fairy-text">Tab</kbd> restart
        </p>
      </div>
    </div>
  );
};
