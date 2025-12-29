// ==============================================
// STORAGE MODULE INDEX
// Re-exports all storage functions for easy importing
// ==============================================

// Base utilities
export { isBrowser, getItem, setItem, removeItem, hasItem, getRawItem, setRawItem } from './base';

// Survey
export { saveSurvey, getSurvey, hasSurvey, clearSurvey } from './survey';

// Reviews
export {
  getReviews,
  saveReview,
  saveAllReviews,
  getReviewByOrderId,
  hasReviewForOrder,
  getReviewsByServiceId,
  getServiceReviewStats,
  getDisplayReviews,
  clearReviews,
} from './reviews';

// Credits
export {
  getCreditBalance,
  updateCreditBalance,
  setCreditBalance,
  resetCreditBalance,
} from './credits';

// Leaderboard
export {
  getRankLevel,
  getRankEmoji,
  getRankColor,
  getRankBadgeStyle,
  getLeaderboardData,
  saveLeaderboardData,
  isLeaderboardInitialized,
  clearLeaderboardData,
  getMonthEndCountdown,
  formatCurrency,
  getTop100Reward,
  getRewardTier,
} from './leaderboard';

// Daily Login
export {
  getTodayDate,
  getYesterdayDate,
  getDailyLoginData,
  saveDailyLoginData,
  clearDailyLoginData,
  canClaimToday,
  isStreakValid,
  getStreakBonus,
  getNextStreakMilestone,
  claimDailyReward,
  hasDailyLoginBadge,
} from './dailyLogin';


