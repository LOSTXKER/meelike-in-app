// ==============================================
// LEADERBOARD STORAGE
// Functions for managing leaderboard data in localStorage
// ==============================================

import type { LeaderboardData, RankLevel, Countdown } from '../../types';
import { STORAGE_KEYS, RANK_EMOJIS, RANK_COLORS, RANK_BADGE_STYLES } from '../../constants';
import { getItem, setItem, isBrowser } from './base';

// Get rank level based on total spending
export const getRankLevel = (totalSpending: number): RankLevel => {
  if (totalSpending >= 100000) return 'เทพหมี';
  if (totalSpending >= 50000) return 'พ่อหมี';
  if (totalSpending >= 10000) return 'พี่หมี';
  if (totalSpending >= 1000) return 'น้องหมี';
  return 'ลูกหมี';
};

// Get rank emoji
export const getRankEmoji = (rank: RankLevel): string => {
  return RANK_EMOJIS[rank];
};

// Get rank color class
export const getRankColor = (rank: RankLevel): string => {
  return RANK_COLORS[rank];
};

// Get rank badge style
export const getRankBadgeStyle = (rank: RankLevel): { bg: string; text: string } => {
  return RANK_BADGE_STYLES[rank];
};

// Get leaderboard data
export const getLeaderboardData = (): LeaderboardData | null => {
  return getItem<LeaderboardData | null>(STORAGE_KEYS.LEADERBOARD, null);
};

// Save leaderboard data
export const saveLeaderboardData = (data: LeaderboardData): void => {
  setItem(STORAGE_KEYS.LEADERBOARD, data);
};

// Check if leaderboard is initialized
export const isLeaderboardInitialized = (): boolean => {
  if (!isBrowser()) return true;
  return localStorage.getItem(STORAGE_KEYS.LEADERBOARD) !== null;
};

// Clear leaderboard data
export const clearLeaderboardData = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
};

// Calculate remaining time until month end
export const getMonthEndCountdown = (): Countdown => {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diff = endOfMonth.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `฿${(amount / 1000).toFixed(1)}K`;
  }
  return `฿${amount.toFixed(0)}`;
};

// Get Top 100 reward amount
export const getTop100Reward = (rank: number): number => {
  if (rank === 1) return 1500;
  if (rank === 2) return 1000;
  if (rank === 3) return 700;
  if (rank >= 4 && rank <= 5) return 400;
  if (rank >= 6 && rank <= 10) return 250;
  if (rank >= 11 && rank <= 20) return 150;
  if (rank >= 21 && rank <= 50) return 75;
  if (rank >= 51 && rank <= 100) return 20;
  return 0;
};

// Get reward tier label
export const getRewardTier = (rank: number): string => {
  if (rank === 1) return '🥇 อันดับ 1';
  if (rank === 2) return '🥈 อันดับ 2';
  if (rank === 3) return '🥉 อันดับ 3';
  if (rank >= 4 && rank <= 5) return '🏅 4-5';
  if (rank >= 6 && rank <= 10) return '🎖️ 6-10';
  if (rank >= 11 && rank <= 20) return '⭐ 11-20';
  if (rank >= 21 && rank <= 50) return '✨ 21-50';
  if (rank >= 51 && rank <= 100) return '🎁 51-100';
  return '';
};



