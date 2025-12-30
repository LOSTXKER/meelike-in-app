// ==============================================
// CENTRALIZED CONSTANTS
// All shared constants used across the application
// ==============================================

import type { RankLevel } from '../types';

// ==============================================
// DAILY LOGIN CONSTANTS
// ==============================================

export const DAILY_LOGIN_REWARD = 0.5;

export const STREAK_BONUSES: Record<number, { bonus: number; badge?: { id: string; name: string } }> = {
  7: { bonus: 3 },
  14: { bonus: 5 },
  30: { bonus: 15, badge: { id: 'streak_30', name: 'นักล่ารางวัล' } },
  60: { bonus: 30, badge: { id: 'streak_60', name: 'ขยันเป็นเลิศ' } },
  100: { bonus: 50, badge: { id: 'streak_100', name: 'ตำนานหมี' } },
};

// ==============================================
// REVIEW CONSTANTS
// ==============================================

export const REVIEW_CREDIT_REWARD = 0.25;
export const MIN_REVIEW_LENGTH = 10;
export const MIN_ORDER_AMOUNT_FOR_REVIEW = 10;

// ==============================================
// LEADERBOARD CONSTANTS
// ==============================================

// Top 100 Rewards Structure (10,000฿/month)
export const TOP_100_REWARDS: Record<string, number> = {
  '1': 1500,
  '2': 1000,
  '3': 700,
  '4-5': 400,
  '6-10': 250,
  '11-20': 150,
  '21-50': 75,
  '51-100': 20,
};

// ==============================================
// RANK SYSTEM CONSTANTS
// ==============================================

export const RANK_THRESHOLDS: Record<RankLevel, number> = {
  'ลูกหมี': 0,
  'น้องหมี': 1000,
  'พี่หมี': 10000,
  'พ่อหมี': 50000,
  'เทพหมี': 100000,
};

export const RANK_DISCOUNTS: Record<RankLevel, number> = {
  'ลูกหมี': 0,
  'น้องหมี': 1,
  'พี่หมี': 2,
  'พ่อหมี': 3,
  'เทพหมี': 5,
};

export const RANK_EMOJIS: Record<RankLevel, string> = {
  'ลูกหมี': '🐻',
  'น้องหมี': '🧸',
  'พี่หมี': '🐻‍❄️',
  'พ่อหมี': '👑',
  'เทพหมี': '⭐',
};

export const RANK_COLORS: Record<RankLevel, string> = {
  'ลูกหมี': 'text-gray-500',
  'น้องหมี': 'text-green-500',
  'พี่หมี': 'text-blue-500',
  'พ่อหมี': 'text-purple-500',
  'เทพหมี': 'text-brand-secondary',
};

export const RANK_BADGE_STYLES: Record<RankLevel, { bg: string; text: string }> = {
  'ลูกหมี': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'น้องหมี': { bg: 'bg-green-100', text: 'text-green-700' },
  'พี่หมี': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'พ่อหมี': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'เทพหมี': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
};

// ==============================================
// ORDER STATUS CONSTANTS
// ==============================================

export const ORDER_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Awaiting': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'In Progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Processing': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Completed': { bg: 'bg-green-100', text: 'text-green-700' },
  'Partially Completed': { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'On Refill': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'Refilled': { bg: 'bg-teal-100', text: 'text-teal-700' },
  'Canceled': { bg: 'bg-gray-200', text: 'text-gray-600' },
  'Fail': { bg: 'bg-red-100', text: 'text-red-700' },
  'Error': { bg: 'bg-red-200', text: 'text-red-800' },
};

// ==============================================
// SURVEY CONSTANTS
// ==============================================

export const SURVEY_CREDIT_REWARD = 5;

export const SOURCE_CHANNELS = [
  'Facebook',
  'Instagram', 
  'TikTok',
  'Google',
  'เพื่อนแนะนำ',
  'อื่นๆ',
];

export const COMPETITORS = [
  'ADS4U',
  'ARSD', 
  '24social',
  'Punfollow',
  'อื่นๆ',
];

export const DEVICE_TYPES = [
  { id: 'mobile', label: 'มือถือ', icon: '📱' },
  { id: 'desktop', label: 'คอมพิวเตอร์', icon: '💻' },
  { id: 'both', label: 'ทั้งสองอย่าง', icon: '📱💻' },
];

export const USAGE_PURPOSES = [
  'ธุรกิจส่วนตัว',
  'ขายของออนไลน์',
  'สร้างตัวตน/Influencer',
  'ทำ Affiliate',
  'งานบริษัท/องค์กร',
  'อื่นๆ',
];

export const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'youtube', label: 'YouTube', icon: '🎬' },
  { id: 'twitter', label: 'X (Twitter)', icon: '🐦' },
  { id: 'line', label: 'LINE', icon: '💬' },
  { id: 'shopee', label: 'Shopee', icon: '🛒' },
  { id: 'lazada', label: 'Lazada', icon: '🏪' },
];

export const BUDGET_RANGES = [
  'ต่ำกว่า 500 บาท',
  '500 - 1,000 บาท',
  '1,000 - 5,000 บาท',
  '5,000 - 10,000 บาท',
  'มากกว่า 10,000 บาท',
];

export const PRIORITIES = [
  { id: 'price', label: 'ราคาถูก', icon: '💰' },
  { id: 'quality', label: 'คุณภาพดี', icon: '⭐' },
  { id: 'speed', label: 'ส่งเร็ว', icon: '⚡' },
  { id: 'support', label: 'ซัพพอร์ตดี', icon: '💬' },
  { id: 'variety', label: 'บริการหลากหลาย', icon: '📦' },
  { id: 'refill', label: 'มีการันตี/Refill', icon: '🔄' },
];

// ==============================================
// UI CONSTANTS
// ==============================================

export const DEFAULT_ANIMATION_DURATION = 300;

export const TOAST_DURATION = 3000;

export const PAGINATION_SIZES = [10, 25, 50, 100];

// ==============================================
// API / STORAGE KEYS
// ==============================================

export const STORAGE_KEYS = {
  SURVEY: 'meelike_survey',
  REVIEWS: 'meelike_reviews',
  CREDIT_BALANCE: 'meelike_credit_balance',
  LEADERBOARD: 'meelike_leaderboard',
  DAILY_LOGIN: 'meelike_daily_login',
  MOCK_INITIALIZED: 'mock_reviews_initialized',
} as const;






