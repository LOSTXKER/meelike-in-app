// ==============================================
// STORAGE MODULE INDEX
// Re-exports all storage functions for easy importing
// ==============================================

// Base utilities
export { isBrowser, getItem, setItem, removeItem, hasItem, getRawItem, setRawItem, getFromStorage, saveToStorage, generateId } from './base';

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

// ═══════════════════════════════════════════════════════════════════════════
// AGENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

// Bills
export {
  getBills,
  getBillById,
  createBill,
  updateBillStatus,
  getBillSummary,
  deleteBill,
} from './bills';

// Clients
export {
  getClients,
  getClientById,
  createClient,
  updateClient,
  updateClientStats,
  getClientStats,
  deleteClient,
  getAllClientTags,
} from './clients';

// Stores
export {
  getStoreByAgentId,
  getStoreByUsername,
  createStore,
  updateStore,
  addStoreService,
  updateStoreService,
  removeStoreService,
  getStoreStats,
  incrementStoreServiceView,
  incrementStoreServiceOrder,
} from './stores';
