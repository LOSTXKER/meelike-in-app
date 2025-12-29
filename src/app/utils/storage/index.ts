// ==============================================
// STORAGE MODULE INDEX
// Re-exports all storage functions for easy importing
// ==============================================

// Base utilities
export { isBrowser, getItem, setItem, removeItem, hasItem, getRawItem, setRawItem } from './base';

// Survey
export { saveSurvey, getSurvey, hasSurvey, clearSurvey } from './survey';

// Reviews (Service Reviews)
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

// ==============================================
// AGENT SYSTEM STORAGE
// ==============================================

// Agent
export {
  getAgent,
  getAgentByUserId,
  getAgentByUsername,
  createAgent,
  updateAgent,
  deleteAgent,
  updateSubscription,
  upgradeSubscription,
  cancelSubscription,
  checkSubscriptionStatus,
  incrementBillsUsed,
  incrementClientsUsed,
  updateRevenueStats,
  getDashboardStats,
  getAgentLimitsCheck,
  isUsernameAvailable as isAgentUsernameAvailable,
  userHasAgent,
  getAllAgents,
  getAgentCount,
  clearAgentData,
  clearAllAgents,
  resetMonthlyUsage,
} from './agent';

// Bills
export {
  getBills,
  getBillById,
  saveBill,
  updateBill,
  deleteBill,
  saveBills,
  confirmBill,
  startProcessingBill,
  completeBill,
  cancelBill,
  updateBillItemProgress,
  queryBills,
  getBillsByStatus,
  getBillsByClient,
  getRecentBills,
  getBillSummary,
  getBillCountByPeriod,
  getRevenueByPeriod,
  billIdExists,
  generateUniqueBillId,
  clearBills,
  clearAllBills,
  exportBillsToJson,
  importBillsFromJson,
} from './bills';

// Clients
export {
  getClients,
  getClientById,
  getClientByContact,
  createClient,
  updateClient,
  deleteClient,
  getOrCreateClient,
  updateClientOrderStats,
  recalculateAllSegments,
  addClientTag,
  removeClientTag,
  getAllClientTags,
  queryClients,
  getClientsBySegment,
  getClientsByLoyaltyTier,
  searchClients,
  getClientSummary,
  getTopClients,
  getSegmentDistribution,
  contactExists,
  getClientCount,
  clearClients,
  clearAllClients,
  exportClientsToJson,
  importClientsFromJson,
} from './clients';

// Stores
export {
  getStoreSettings,
  getStoreByUsername,
  createStoreSettings,
  updateStoreSettings,
  updateStoreLevel,
  deleteStore,
  getStoreServices,
  getActiveStoreServices,
  getStoreServiceById,
  addStoreService,
  updateStoreService,
  removeStoreService,
  reorderStoreServices,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
  incrementStoreViews,
  updateStoreOrderStats,
  updateStoreRating,
  updateServiceSoldCount,
  getBasicAnalytics,
  isUsernameAvailable as isStoreUsernameAvailable,
  storeExists,
  getStoreCount,
  getAllStores,
  clearStore,
  clearAllStores,
} from './stores';

// Promotions
export {
  getCoupons,
  getCouponById,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  applyCoupon,
  recordCouponUsage,
  getFlashSales,
  getActiveFlashSales,
  getFlashSaleById,
  getFlashSaleByServiceId,
  createFlashSale,
  updateFlashSaleSold,
  toggleFlashSaleActive,
  deleteFlashSale,
  getLoyaltyTierSettings,
  updateLoyaltyTierSettings,
  getPromotionSummary,
  couponCodeExists,
  getCouponCount,
  getActiveCouponCount,
  clearPromotions,
  clearAllPromotions,
} from './promotions';

// Agent Reviews
export {
  getAgentReviews,
  getReviewById as getAgentReviewById,
  getReviewByBillId,
  billHasReview,
  createAgentReview,
  updateAgentReview,
  replyToReview,
  toggleReviewVisibility,
  deleteReview as deleteAgentReview,
  queryReviews as queryAgentReviews,
  getVisibleReviews,
  getUnrepliedReviews,
  getReviewsByRating,
  getRecentReviews as getRecentAgentReviews,
  getStoreRatingSummary,
  getReviewCount as getAgentReviewCount,
  getVisibleReviewCount,
  getUnrepliedReviewCount,
  getAverageRating,
  getReviewsByService,
  clearAgentReviews,
  clearAllAgentReviews,
  exportReviewsToJson as exportAgentReviewsToJson,
} from './agentReviews';

// Templates
export {
  getBillTemplates,
  getBillTemplateById,
  getActiveBillTemplates,
  createBillTemplate,
  updateBillTemplate,
  incrementBillTemplateUsage,
  deleteBillTemplate,
  toggleBillTemplateActive,
  getQuickReplies,
  getQuickReplyById,
  getQuickReplyByShortcut,
  getActiveQuickReplies,
  getQuickRepliesByCategory,
  createQuickReply,
  updateQuickReply,
  incrementQuickReplyUsage,
  deleteQuickReply,
  toggleQuickReplyActive,
  initializeDefaultQuickReplies,
  getTemplateSummary,
  getMostUsedBillTemplates,
  getMostUsedQuickReplies,
  getBillTemplateCount,
  getQuickReplyCount,
  shortcutExists,
  clearTemplates,
  clearAllTemplates,
} from './templates';

// Notifications
export {
  getNotifications,
  getNotificationById,
  getUnreadNotifications,
  getUnreadCount,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications,
  queryNotifications,
  getNotificationsByType,
  getRecentNotifications,
  getTodayNotifications,
  getNotificationSettings,
  updateNotificationSettings,
  connectLineNotification,
  disconnectLineNotification,
  setNotificationEmail,
  verifyNotificationEmail,
  getNotificationSummary,
  clearNotifications,
  clearNotificationSettings,
  clearAllNotificationData,
  clearAllNotifications,
  clearAllNotificationSettings,
} from './notifications';


