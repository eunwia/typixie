export interface LevelThreshold {
  level: number;
  totalExpRequired: number;
}

// Level requirements starting at Level 1 (0 EXP)
// Level 2: 100, Level 3: 250, Level 4: 450, Level 5: 700, etc.
export const LEVEL_TABLE: LevelThreshold[] = [
  { level: 1, totalExpRequired: 0 },
  { level: 2, totalExpRequired: 100 },
  { level: 3, totalExpRequired: 250 },
  { level: 4, totalExpRequired: 450 },
  { level: 5, totalExpRequired: 700 },
  { level: 6, totalExpRequired: 1000 },
  { level: 7, totalExpRequired: 1350 },
  { level: 8, totalExpRequired: 1750 },
  { level: 9, totalExpRequired: 2200 },
  { level: 10, totalExpRequired: 2700 },
  { level: 11, totalExpRequired: 3300 },
  { level: 12, totalExpRequired: 4000 },
  { level: 13, totalExpRequired: 4800 },
  { level: 14, totalExpRequired: 5700 },
  { level: 15, totalExpRequired: 6700 },
  { level: 16, totalExpRequired: 7800 },
  { level: 17, totalExpRequired: 9000 },
  { level: 18, totalExpRequired: 10300 },
  { level: 19, totalExpRequired: 11700 },
  { level: 20, totalExpRequired: 13200 },
];

export function getLevelFromExp(exp: number): number {
  if (exp < 0) return 1;
  for (let i = LEVEL_TABLE.length - 1; i >= 0; i--) {
    if (exp >= LEVEL_TABLE[i].totalExpRequired) {
      return LEVEL_TABLE[i].level;
    }
  }
  return 1;
}

export function getLevelExpDetails(exp: number): {
  currentLevel: number;
  currentLevelBaseExp: number;
  nextLevelExp: number;
  expIntoCurrentLevel: number;
  expNeededForNextLevel: number;
  progressPercentage: number;
} {
  const currentLevel = getLevelFromExp(exp);
  const currentLevelObj = LEVEL_TABLE.find(l => l.level === currentLevel) || LEVEL_TABLE[0];
  const nextLevelObj = LEVEL_TABLE.find(l => l.level === currentLevel + 1);

  if (!nextLevelObj) {
    // Max level reached
    return {
      currentLevel,
      currentLevelBaseExp: currentLevelObj.totalExpRequired,
      nextLevelExp: currentLevelObj.totalExpRequired,
      expIntoCurrentLevel: exp - currentLevelObj.totalExpRequired,
      expNeededForNextLevel: 0,
      progressPercentage: 100,
    };
  }

  const currentLevelBaseExp = currentLevelObj.totalExpRequired;
  const nextLevelExp = nextLevelObj.totalExpRequired;
  const expNeededForNextLevel = nextLevelExp - currentLevelBaseExp;
  const expIntoCurrentLevel = Math.max(0, exp - currentLevelBaseExp);
  const progressPercentage = Math.min(100, Math.floor((expIntoCurrentLevel / expNeededForNextLevel) * 100));

  return {
    currentLevel,
    currentLevelBaseExp,
    nextLevelExp,
    expIntoCurrentLevel,
    expNeededForNextLevel,
    progressPercentage,
  };
}

export function calculateTestRewards(duration: number, accuracy: number): {
  baseExp: number;
  accuracyBonusExp: number;
  totalExp: number;
  coinsEarned: number;
} {
  // Base EXP by duration
  let baseExp = 10;
  if (duration === 15) baseExp = 10;
  else if (duration === 30) baseExp = 20;
  else if (duration === 60) baseExp = 40;
  else if (duration === 120) baseExp = 80;
  else baseExp = Math.max(5, Math.round(duration * 0.66));

  // Accuracy bonus: highest applicable only
  let accuracyBonusExp = 0;
  if (accuracy >= 98) {
    accuracyBonusExp = 15;
  } else if (accuracy >= 95) {
    accuracyBonusExp = 10;
  }

  const totalExp = baseExp + accuracyBonusExp;

  // Coins by duration
  let coinsEarned = 5;
  if (duration === 15) coinsEarned = 5;
  else if (duration === 30) coinsEarned = 10;
  else if (duration === 60) coinsEarned = 20;
  else if (duration === 120) coinsEarned = 40;
  else coinsEarned = Math.max(3, Math.round(duration * 0.33));

  return {
    baseExp,
    accuracyBonusExp,
    totalExp,
    coinsEarned,
  };
}
