import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  TypixieUserData,
  loadUserData,
  saveUserData,
  resetUserData,
  TestHistoryEntry,
  INITIAL_USER_DATA
} from '../utils/storage';
import { fairies, Fairy, DEFAULT_FAIRY_ID } from '../data/fairies';
import { getLevelFromExp, getLevelExpDetails, calculateTestRewards } from '../utils/progression';

export interface TestResultPayload {
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  wordsTyped: number;
}

export interface LevelUpCelebrationData {
  previousLevel: number;
  newLevel: number;
  newFairiesUnlocked: Fairy[];
}

interface TypixieContextType {
  userData: TypixieUserData;
  equippedFairy: Fairy;
  allFairies: Fairy[];
  currentLevel: number;
  levelDetails: ReturnType<typeof getLevelExpDetails>;
  averageAccuracy: number;
  levelUpCelebration: LevelUpCelebrationData | null;
  dismissLevelUpCelebration: () => void;
  completeOnboarding: (fairyName: string) => void;
  recordCompletedTest: (result: TestResultPayload) => {
    expEarned: number;
    coinsEarned: number;
    leveledUp: boolean;
    newLevel: number;
    unlockedFairies: Fairy[];
  };
  equipFairy: (fairyId: string) => boolean;
  purchaseFairy: (fairyId: string) => { success: boolean; message: string };
  renameFairy: (name: string) => boolean;
  resetProgress: () => void;
}

const TypixieContext = createContext<TypixieContextType | undefined>(undefined);

export const TypixieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<TypixieUserData>(() => loadUserData());
  const [levelUpCelebration, setLevelUpCelebration] = useState<LevelUpCelebrationData | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const currentLevel = useMemo(() => getLevelFromExp(userData.exp), [userData.exp]);
  const levelDetails = useMemo(() => getLevelExpDetails(userData.exp), [userData.exp]);

  // Ensure default fairy is always unlocked
  useEffect(() => {
    if (!userData.unlockedFairyIds.includes(DEFAULT_FAIRY_ID)) {
      setUserData(prev => ({
        ...prev,
        unlockedFairyIds: [DEFAULT_FAIRY_ID, ...prev.unlockedFairyIds],
      }));
    }
  }, [userData.unlockedFairyIds]);

  // Auto-check and unlock level-based fairies
  useEffect(() => {
    const newlyAvailable = fairies.filter(f => 
      f.unlockType === 'level' && 
      f.requiredLevel !== undefined && 
      currentLevel >= f.requiredLevel && 
      !userData.unlockedFairyIds.includes(f.id)
    );

    if (newlyAvailable.length > 0) {
      setUserData(prev => ({
        ...prev,
        unlockedFairyIds: Array.from(new Set([...prev.unlockedFairyIds, ...newlyAvailable.map(f => f.id)])),
      }));
    }
  }, [currentLevel, userData.unlockedFairyIds]);

  const equippedFairy = useMemo(() => {
    const found = fairies.find(f => f.id === userData.equippedFairyId);
    return found || fairies[0];
  }, [userData.equippedFairyId]);

  const averageAccuracy = useMemo(() => {
    if (userData.testsCompleted === 0) return 0;
    return Math.round(userData.sumAccuracy / userData.testsCompleted);
  }, [userData.sumAccuracy, userData.testsCompleted]);

  const completeOnboarding = useCallback((fairyName: string) => {
    const trimmed = fairyName.trim();
    if (!trimmed) return;
    setUserData(prev => ({
      ...prev,
      isOnboarded: true,
      userFairyName: trimmed,
      equippedFairyId: DEFAULT_FAIRY_ID,
      unlockedFairyIds: [DEFAULT_FAIRY_ID],
      exp: 0,
      coins: 0,
    }));
  }, []);

  const recordCompletedTest = useCallback((result: TestResultPayload) => {
    const oldLevel = getLevelFromExp(userData.exp);
    const rewards = calculateTestRewards(result.duration, result.accuracy);
    const newExp = userData.exp + rewards.totalExp;
    const newLevel = getLevelFromExp(newExp);
    const leveledUp = newLevel > oldLevel;

    // Check newly unlocked fairies via leveling
    const newlyUnlockedFairies = fairies.filter(f =>
      f.unlockType === 'level' &&
      f.requiredLevel !== undefined &&
      newLevel >= f.requiredLevel &&
      !userData.unlockedFairyIds.includes(f.id)
    );

    const updatedUnlockedIds = Array.from(new Set([
      ...userData.unlockedFairyIds,
      ...newlyUnlockedFairies.map(f => f.id)
    ]));

    const newHistoryEntry: TestHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      wpm: result.wpm,
      accuracy: result.accuracy,
      duration: result.duration,
      expEarned: rewards.totalExp,
      coinsEarned: rewards.coinsEarned,
      wordsTyped: result.wordsTyped,
    };

    setUserData(prev => ({
      ...prev,
      exp: newExp,
      coins: prev.coins + rewards.coinsEarned,
      testsCompleted: prev.testsCompleted + 1,
      totalWordsTyped: prev.totalWordsTyped + result.wordsTyped,
      bestWpm: Math.max(prev.bestWpm, result.wpm),
      totalCharactersTyped: prev.totalCharactersTyped + result.totalChars,
      sumAccuracy: prev.sumAccuracy + result.accuracy,
      unlockedFairyIds: updatedUnlockedIds,
      testHistory: [newHistoryEntry, ...prev.testHistory].slice(0, 30),
    }));

    if (leveledUp) {
      setLevelUpCelebration({
        previousLevel: oldLevel,
        newLevel,
        newFairiesUnlocked: newlyUnlockedFairies,
      });
    }

    return {
      expEarned: rewards.totalExp,
      coinsEarned: rewards.coinsEarned,
      leveledUp,
      newLevel,
      unlockedFairies: newlyUnlockedFairies,
    };
  }, [userData.exp, userData.unlockedFairyIds]);

  const equipFairy = useCallback((fairyId: string): boolean => {
    if (userData.unlockedFairyIds.includes(fairyId)) {
      setUserData(prev => ({ ...prev, equippedFairyId: fairyId }));
      return true;
    }
    return false;
  }, [userData.unlockedFairyIds]);

  const purchaseFairy = useCallback((fairyId: string): { success: boolean; message: string } => {
    const fairy = fairies.find(f => f.id === fairyId);
    if (!fairy) {
      return { success: false, message: "This fairy could not be found." };
    }
    if (userData.unlockedFairyIds.includes(fairyId)) {
      return { success: false, message: `You already have ${fairy.name} in your sanctuary!` };
    }
    if (fairy.unlockType !== 'shop' || fairy.price === undefined) {
      return { success: false, message: "This fairy is not available in the shop." };
    }
    if (userData.coins < fairy.price) {
      return { 
        success: false, 
        message: `Oh no! You need ${fairy.price - userData.coins} more fairy coins to welcome ${fairy.name}.` 
      };
    }

    // Deduct coins and unlock
    setUserData(prev => ({
      ...prev,
      coins: prev.coins - fairy.price!,
      unlockedFairyIds: [...prev.unlockedFairyIds, fairy.id],
    }));

    return { 
      success: true, 
      message: `Yay! ${fairy.name} has joined your fairy sanctuary!` 
    };
  }, [userData.coins, userData.unlockedFairyIds]);

  const renameFairy = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setUserData(prev => ({ ...prev, userFairyName: trimmed }));
    return true;
  }, []);

  const resetProgress = useCallback(() => {
    resetUserData();
    setUserData({ ...INITIAL_USER_DATA });
  }, []);

  const dismissLevelUpCelebration = useCallback(() => {
    setLevelUpCelebration(null);
  }, []);

  return (
    <TypixieContext.Provider
      value={{
        userData,
        equippedFairy,
        allFairies: fairies,
        currentLevel,
        levelDetails,
        averageAccuracy,
        levelUpCelebration,
        dismissLevelUpCelebration,
        completeOnboarding,
        recordCompletedTest,
        equipFairy,
        purchaseFairy,
        renameFairy,
        resetProgress,
      }}
    >
      {children}
    </TypixieContext.Provider>
  );
};

export function useTypixie() {
  const context = useContext(TypixieContext);
  if (!context) {
    throw new Error('useTypixie must be used within a TypixieProvider');
  }
  return context;
}
