// ==============================================
// LOCALSTORAGE UTILITIES
// This file re-exports from the new modular storage system
// for backward compatibility
// ==============================================

// Re-export everything from the new storage module
export * from './storage';

// Re-export types for backward compatibility
export type { 
  SurveyData, 
  ReviewData, 
  LeaderboardUser, 
  LeaderboardData, 
  RankLevel,
  DailyLoginData,
  DailyLoginBadge,
  ClaimRecord,
} from '../types';

// Re-export constants for backward compatibility
export { 
  DAILY_LOGIN_REWARD, 
  STREAK_BONUSES,
  STORAGE_KEYS,
} from '../constants';

// Legacy function names (deprecated, use new names)
export { isBrowser } from './storage/base';

// Mock data initialization helpers
import { isBrowser as checkBrowser, setRawItem, getRawItem } from './storage/base';

export const isMockDataInitialized = (): boolean => {
  if (!checkBrowser()) return true;
  return getRawItem('mock_reviews_initialized') === 'true';
};

export const setMockDataInitialized = (): void => {
  if (!checkBrowser()) return;
  setRawItem('mock_reviews_initialized', 'true');
};
