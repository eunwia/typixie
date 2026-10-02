export const motivationalMessages: string[] = [
  "Every little keystroke counts.",
  "Your fairy believes in your steady hands.",
  "Practice a little magic every day.",
  "Breathe in calm focus, type out magic.",
  "Your fingers are learning to dance across the keys.",
  "Consistency is where true enchantment happens.",
  "A few minutes of mindful typing makes your sanctuary bloom.",
  "Speed flows naturally when accuracy leads the way.",
  "Mistakes are just gentle stepping stones on your path.",
  "Listen to the rhythmic clicks of your typing journey.",
  "One word at a time, you are building graceful mastery.",
  "The fairy realm celebrates your every achievement."
];

export function getRandomMotivation(): string {
  const index = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[index];
}
