import { useState, useEffect, useRef, useCallback } from 'react';
import { generateRandomWords } from '../data/words';

export type TestDuration = 15 | 30 | 60 | 120;

export interface TypingEngineState {
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  typedHistory: string[];
  duration: TestDuration;
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  correctCharsCount: number;
  incorrectCharsCount: number;
  totalCharsTyped: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
}

export function useTypingEngine(initialDuration: TestDuration = 30) {
  const [duration, setDuration] = useState<TestDuration>(initialDuration);
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [words, setWords] = useState<string[]>(() => generateRandomWords(100));
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [typedHistory, setTypedHistory] = useState<string[]>([]);

  const [correctCharsCount, setCorrectCharsCount] = useState<number>(0);
  const [incorrectCharsCount, setIncorrectCharsCount] = useState<number>(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  // Synchronous state reference for immediate, zero-latency keystroke processing
  const syncRef = useRef({
    words: [] as string[],
    currentWordIndex: 0,
    currentInput: '',
    typedHistory: [] as string[],
    isActive: false,
    isPaused: false,
    pausedAt: null as number | null,
    isFinished: false,
    duration: initialDuration,
    startTime: null as number | null,
  });

  // Keep syncRef in sync with latest words / duration / pause
  syncRef.current.words = words;
  syncRef.current.currentWordIndex = currentWordIndex;
  syncRef.current.currentInput = currentInput;
  syncRef.current.typedHistory = typedHistory;
  syncRef.current.isActive = isActive;
  syncRef.current.isPaused = isPaused;
  syncRef.current.isFinished = isFinished;
  syncRef.current.duration = duration;

  // Accurate deterministic Monkeytype-standard stats calculator
  const calculateMetrics = useCallback((
    wordsList: string[],
    history: string[],
    currIndex: number,
    currInput: string,
    startTime: number | null,
    dur: number,
    _remainingTime: number,
    active: boolean
  ) => {
    let correctWordChars = 0;
    let allCorrectChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let totalTypedChars = 0;

    // Past completed words: only fully correct words count toward standard WPM
    for (let i = 0; i < currIndex; i++) {
      const target = wordsList[i] || '';
      const typed = history[i] || '';
      const isWordCorrect = typed === target;

      if (isWordCorrect) {
        correctWordChars += target.length + 1; // Word characters + trailing space
      }

      const minLen = Math.min(target.length, typed.length);
      for (let c = 0; c < minLen; c++) {
        if (typed[c] === target[c]) {
          allCorrectChars++;
        } else {
          incorrectChars++;
        }
      }

      if (typed.length > target.length) {
        extraChars += typed.length - target.length;
      }

      if (isWordCorrect) {
        allCorrectChars++; // correct space keypress
      } else {
        extraChars++; // space on incorrect word
      }

      totalTypedChars += typed.length + 1;
    }

    // Current word: count prefix if matching
    const currentTarget = wordsList[currIndex] || '';
    if (currInput.length > 0) {
      if (currentTarget.startsWith(currInput)) {
        correctWordChars += currInput.length;
      }

      const currentMinLen = Math.min(currentTarget.length, currInput.length);
      for (let c = 0; c < currentMinLen; c++) {
        if (currInput[c] === currentTarget[c]) {
          allCorrectChars++;
        } else {
          incorrectChars++;
        }
      }

      if (currInput.length > currentTarget.length) {
        extraChars += currInput.length - currentTarget.length;
      }

      totalTypedChars += currInput.length;
    }

    // Standard Monkeytype elapsed time:
    // When active, use actual elapsed seconds; do not display burst spikes before 1s.
    // When finished, use exact test duration.
    let elapsedSeconds = 0;
    if (active && startTime) {
      elapsedSeconds = Math.max(0, (Date.now() - startTime) / 1000);
    } else if (!active && startTime) {
      elapsedSeconds = dur;
    }

    let calculatedWpm = 0;
    let calculatedRawWpm = 0;

    if (elapsedSeconds >= 1) {
      const elapsedMinutes = elapsedSeconds / 60;
      calculatedWpm = Math.round((correctWordChars / 5) / elapsedMinutes);
      calculatedRawWpm = Math.round((totalTypedChars / 5) / elapsedMinutes);
    }

    const totalKeypresses = allCorrectChars + incorrectChars + extraChars;
    const calculatedAccuracy = totalKeypresses > 0
      ? Math.min(100, Math.max(0, Math.round((allCorrectChars / totalKeypresses) * 100)))
      : 100;

    return {
      correct: allCorrectChars,
      incorrect: incorrectChars + extraChars,
      totalTyped: totalTypedChars,
      wpm: calculatedWpm,
      rawWpm: calculatedRawWpm,
      accuracy: calculatedAccuracy,
    };
  }, []);

  // Update React states for metrics
  const updateMetrics = useCallback(() => {
    const s = syncRef.current;
    const metrics = calculateMetrics(
      s.words,
      s.typedHistory,
      s.currentWordIndex,
      s.currentInput,
      s.startTime,
      s.duration,
      0,
      s.isActive
    );

    setCorrectCharsCount(metrics.correct);
    setIncorrectCharsCount(metrics.incorrect);
    setTotalCharsTyped(metrics.totalTyped);
    setWpm(metrics.wpm);
    setRawWpm(metrics.rawWpm);
    setAccuracy(metrics.accuracy);
  }, [calculateMetrics]);

  // Pause and Resume functions
  const pauseTest = useCallback(() => {
    if (!syncRef.current.isActive || syncRef.current.isFinished || syncRef.current.isPaused) return;
    syncRef.current.isPaused = true;
    syncRef.current.pausedAt = Date.now();
    setIsPaused(true);
  }, []);

  const resumeTest = useCallback(() => {
    if (!syncRef.current.isPaused) return;
    if (syncRef.current.pausedAt && syncRef.current.startTime) {
      const pauseDuration = Date.now() - syncRef.current.pausedAt;
      syncRef.current.startTime += pauseDuration;
    }
    syncRef.current.isPaused = false;
    syncRef.current.pausedAt = null;
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    if (syncRef.current.isPaused) {
      resumeTest();
    } else if (syncRef.current.isActive && !syncRef.current.isFinished) {
      pauseTest();
    }
  }, [pauseTest, resumeTest]);

  // Finish test
  const finishTest = useCallback(() => {
    syncRef.current.isActive = false;
    syncRef.current.isPaused = false;
    syncRef.current.isFinished = true;
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(true);
    setTimeLeft(0);

    // Final metric computation
    const s = syncRef.current;
    const metrics = calculateMetrics(
      s.words,
      s.typedHistory,
      s.currentWordIndex,
      s.currentInput,
      s.startTime,
      s.duration,
      0,
      false
    );
    setCorrectCharsCount(metrics.correct);
    setIncorrectCharsCount(metrics.incorrect);
    setTotalCharsTyped(metrics.totalTyped);
    setWpm(metrics.wpm);
    setRawWpm(metrics.rawWpm);
    setAccuracy(metrics.accuracy);
  }, [calculateMetrics]);

  // Reset test
  const resetTest = useCallback((newDuration?: TestDuration) => {
    const targetDur = newDuration ?? syncRef.current.duration;
    const newWords = generateRandomWords(100);

    syncRef.current = {
      words: newWords,
      currentWordIndex: 0,
      currentInput: '',
      typedHistory: [],
      isActive: false,
      isPaused: false,
      pausedAt: null,
      isFinished: false,
      duration: targetDur,
      startTime: null,
    };

    if (newDuration) {
      setDuration(newDuration);
    }
    setTimeLeft(targetDur);
    setIsActive(false);
    setIsPaused(false);
    setIsFinished(false);
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setCorrectCharsCount(0);
    setIncorrectCharsCount(0);
    setTotalCharsTyped(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
  }, []);

  // Timer: accurate tick linked to wall clock (stops when paused)
  useEffect(() => {
    if (!isActive || isFinished || isPaused) return;

    const interval = setInterval(() => {
      if (!syncRef.current.startTime) return;
      const elapsed = Math.floor((Date.now() - syncRef.current.startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      // Periodically update live stats
      updateMetrics();

      if (remaining <= 0) {
        clearInterval(interval);
        finishTest();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isActive, isFinished, isPaused, duration, finishTest, updateMetrics]);

  // Fast KeyDown Handler with synchronous ref handling
  const handleKeyDown = useCallback((e: React.KeyboardEvent | KeyboardEvent) => {
    if (syncRef.current.isFinished) return;

    // ESC Key: Pause / Resume test
    if (e.key === 'Escape') {
      e.preventDefault();
      if (syncRef.current.isActive && !syncRef.current.isFinished) {
        togglePause();
      }
      return;
    }

    // When paused, typing is frozen; Space or Enter can resume
    if (syncRef.current.isPaused) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        resumeTest();
      }
      return;
    }

    // Quick Restart with Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Space Key: Submit current word and advance
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      const s = syncRef.current;
      // Prevent advancing if nothing typed
      if (s.currentInput.length === 0) return;

      const newHistory = [...s.typedHistory, s.currentInput];
      const nextIndex = s.currentWordIndex + 1;
      s.typedHistory = newHistory;
      s.currentWordIndex = nextIndex;
      s.currentInput = '';

      // Check if more words need to be appended
      if (nextIndex >= s.words.length - 20) {
        const extraWords = generateRandomWords(50);
        s.words = [...s.words, ...extraWords];
        setWords(s.words);
      }

      setTypedHistory(newHistory);
      setCurrentWordIndex(nextIndex);
      setCurrentInput('');
      updateMetrics();
      return;
    }

    // Backspace Key: edit current word or navigate to previous word
    if (e.key === 'Backspace') {
      e.preventDefault();
      const s = syncRef.current;

      if (s.currentInput.length > 0) {
        // Delete last character in current word
        const updatedInput = s.currentInput.slice(0, -1);
        s.currentInput = updatedInput;
        setCurrentInput(updatedInput);
        updateMetrics();
      } else if (s.currentInput.length === 0 && s.currentWordIndex > 0) {
        // Go back to previous word so mistakes can be corrected smoothly
        const prevIndex = s.currentWordIndex - 1;
        const prevTyped = s.typedHistory[prevIndex] || '';
        const updatedHistory = s.typedHistory.slice(0, prevIndex);

        s.currentWordIndex = prevIndex;
        s.currentInput = prevTyped;
        s.typedHistory = updatedHistory;

        setTypedHistory(updatedHistory);
        setCurrentWordIndex(prevIndex);
        setCurrentInput(prevTyped);
        updateMetrics();
      }
      return;
    }

    // Printable Characters
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const s = syncRef.current;

      // Start timer on first printable character
      if (!s.isActive && !s.isFinished) {
        s.isActive = true;
        s.startTime = Date.now();
        setIsActive(true);
      }

      const targetWord = s.words[s.currentWordIndex] || '';
      // Limit extra characters to prevent runaway typing
      if (s.currentInput.length >= targetWord.length + 8) return;

      const updatedInput = s.currentInput + e.key;
      s.currentInput = updatedInput;
      setCurrentInput(updatedInput);
      updateMetrics();
    }
  }, [resetTest, updateMetrics, togglePause, resumeTest]);

  return {
    state: {
      words,
      currentWordIndex,
      currentInput,
      typedHistory,
      duration,
      timeLeft,
      isActive,
      isPaused,
      isFinished,
      correctCharsCount,
      incorrectCharsCount,
      totalCharsTyped,
      wpm,
      rawWpm,
      accuracy,
    },
    resetTest,
    pauseTest,
    resumeTest,
    togglePause,
    changeDuration: (newDuration: TestDuration) => resetTest(newDuration),
    handleKeyDown,
    setCurrentInputDirectly: (val: string) => {
      if (syncRef.current.isPaused) return;
      syncRef.current.currentInput = val;
      setCurrentInput(val);
      updateMetrics();
    },
  };
}
