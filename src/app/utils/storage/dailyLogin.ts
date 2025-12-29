// ==============================================
// DAILY LOGIN STORAGE
// Functions for managing daily login data in localStorage
// ==============================================

import type { DailyLoginData, DailyLoginBadge, ClaimResult } from '../../types';
import { STORAGE_KEYS, DAILY_LOGIN_REWARD, STREAK_BONUSES } from '../../constants';
import { getItem, setItem, isBrowser } from './base';
import { updateCreditBalance } from './credits';

// Default daily login data
const getDefaultDailyLoginData = (): DailyLoginData => ({
  lastClaimDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalDaysClaimed: 0,
  totalCreditsEarned: 0,
  badges: [],
  claimHistory: [],
});

// Get today's date in YYYY-MM-DD format (Thailand timezone)
export const getTodayDate = (): string => {
  const now = new Date();
  const thailandOffset = 7 * 60; // minutes
  const localOffset = now.getTimezoneOffset(); // minutes
  const thailandTime = new Date(now.getTime() + (thailandOffset + localOffset) * 60 * 1000);
  return thailandTime.toISOString().split('T')[0];
};

// Get yesterday's date in YYYY-MM-DD format (Thailand timezone)
export const getYesterdayDate = (): string => {
  const now = new Date();
  const thailandOffset = 7 * 60;
  const localOffset = now.getTimezoneOffset();
  const thailandTime = new Date(now.getTime() + (thailandOffset + localOffset) * 60 * 1000);
  thailandTime.setDate(thailandTime.getDate() - 1);
  return thailandTime.toISOString().split('T')[0];
};

// Get Daily Login Data
export const getDailyLoginData = (): DailyLoginData => {
  if (!isBrowser()) return getDefaultDailyLoginData();
  return getItem<DailyLoginData>(STORAGE_KEYS.DAILY_LOGIN, getDefaultDailyLoginData());
};

// Save Daily Login Data
export const saveDailyLoginData = (data: DailyLoginData): void => {
  setItem(STORAGE_KEYS.DAILY_LOGIN, data);
};

// Clear Daily Login Data
export const clearDailyLoginData = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.DAILY_LOGIN);
};

// Check if user can claim today
export const canClaimToday = (): boolean => {
  if (!isBrowser()) return false;
  const data = getDailyLoginData();
  const today = getTodayDate();
  return data.lastClaimDate !== today;
};

// Check if streak is still valid
export const isStreakValid = (): boolean => {
  if (!isBrowser()) return false;
  const data = getDailyLoginData();
  if (!data.lastClaimDate) return true;
  const yesterday = getYesterdayDate();
  const today = getTodayDate();
  return data.lastClaimDate === yesterday || data.lastClaimDate === today;
};

// Calculate streak bonus for a given streak
export const getStreakBonus = (streak: number): { bonus: number; badge?: DailyLoginBadge } | null => {
  const bonusInfo = STREAK_BONUSES[streak];
  if (!bonusInfo) return null;
  
  return {
    bonus: bonusInfo.bonus,
    badge: bonusInfo.badge ? {
      id: bonusInfo.badge.id,
      name: bonusInfo.badge.name,
      earnedAt: new Date().toISOString(),
      streak: streak,
    } : undefined,
  };
};

// Get next streak milestone
export const getNextStreakMilestone = (currentStreak: number): { streak: number; bonus: number } | null => {
  const milestones = Object.keys(STREAK_BONUSES).map(Number).sort((a, b) => a - b);
  const nextMilestone = milestones.find(m => m > currentStreak);
  if (!nextMilestone) return null;
  return { streak: nextMilestone, bonus: STREAK_BONUSES[nextMilestone].bonus };
};

// Claim daily reward
export const claimDailyReward = (): ClaimResult => {
  if (!isBrowser()) {
    return { success: false, reward: 0, bonus: 0, newStreak: 0, streakReset: false };
  }

  // Check if already claimed today
  if (!canClaimToday()) {
    return { success: false, reward: 0, bonus: 0, newStreak: 0, streakReset: false };
  }

  const data = getDailyLoginData();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  // Check if streak should reset
  let newStreak: number;
  let streakReset = false;
  
  if (!data.lastClaimDate || data.lastClaimDate === yesterday) {
    newStreak = data.currentStreak + 1;
  } else {
    newStreak = 1;
    streakReset = data.currentStreak > 0;
  }

  // Calculate rewards
  const baseReward = DAILY_LOGIN_REWARD;
  const bonusInfo = getStreakBonus(newStreak);
  const bonus = bonusInfo?.bonus || 0;
  const totalReward = baseReward + bonus;

  // Update data
  const newData: DailyLoginData = {
    lastClaimDate: today,
    currentStreak: newStreak,
    longestStreak: Math.max(data.longestStreak, newStreak),
    totalDaysClaimed: data.totalDaysClaimed + 1,
    totalCreditsEarned: data.totalCreditsEarned + totalReward,
    badges: bonusInfo?.badge ? [...data.badges, bonusInfo.badge] : data.badges,
    claimHistory: [
      { date: today, reward: baseReward, bonus, streak: newStreak },
      ...data.claimHistory.slice(0, 29),
    ],
  };

  // Save data
  saveDailyLoginData(newData);

  // Update credit balance
  updateCreditBalance(totalReward);

  return {
    success: true,
    reward: baseReward,
    bonus,
    newStreak,
    newBadge: bonusInfo?.badge,
    streakReset,
  };
};

// Check if user has a specific badge
export const hasDailyLoginBadge = (badgeId: string): boolean => {
  if (!isBrowser()) return false;
  const data = getDailyLoginData();
  return data.badges.some(b => b.id === badgeId);
};



