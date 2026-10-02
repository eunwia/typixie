export interface TestHistoryEntry {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  duration: number;
  expEarned: number;
  coinsEarned: number;
  wordsTyped: number;
}

export interface TypixieUserData {
  isOnboarded: boolean;
  userFairyName: string;
  equippedFairyId: string;
  exp: number;
  coins: number;
  unlockedFairyIds: string[];
  testsCompleted: number;
  totalWordsTyped: number;
  bestWpm: number;
  totalCharactersTyped: number;
  sumAccuracy: number;
  testHistory: TestHistoryEntry[];
}

const STORAGE_KEY = 'typixie_profile_v1';

export const INITIAL_USER_DATA: TypixieUserData = {
  isOnboarded: false,
  userFairyName: '',
  equippedFairyId: 'your-fairy',
  exp: 0,
  coins: 0,
  unlockedFairyIds: ['your-fairy'],
  testsCompleted: 0,
  totalWordsTyped: 0,
  bestWpm: 0,
  totalCharactersTyped: 0,
  sumAccuracy: 0,
  testHistory: [],
};

export function loadUserData(): TypixieUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_USER_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_USER_DATA,
      ...parsed,
      unlockedFairyIds: Array.isArray(parsed.unlockedFairyIds) && parsed.unlockedFairyIds.length > 0
        ? parsed.unlockedFairyIds
        : ['your-fairy'],
    };
  } catch (error) {
    console.warn('Failed to parse Typixie user data, using defaults', error);
    return { ...INITIAL_USER_DATA };
  }
}

export function saveUserData(data: TypixieUserData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save Typixie user data', error);
  }
}

export function resetUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear Typixie storage', error);
  }
}
