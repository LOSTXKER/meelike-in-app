// ==============================================
// CENTRALIZED TYPE DEFINITIONS
// All shared types and interfaces used across the application
// ==============================================

// ==============================================
// SURVEY TYPES
// ==============================================

export interface SurveyData {
  userId: string;
  sourceChannel: string;
  sourceOther?: string;
  usedCompetitor: boolean;
  competitorName?: string;
  deviceType: string;
  usagePurpose?: string;
  platforms?: string;
  budget?: string;
  priorities?: string;
  suggestions?: string;
  creditGiven: number;
  createdAt: string;
}

// ==============================================
// REVIEW TYPES
// ==============================================

export interface ReviewData {
  id: string;
  orderId: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  qualityRating: number;
  speedRating: number;
  valueRating: number;
  reviewText: string;
  reviewLength: number;
  isAnonymous: boolean;
  creditGiven: number;
  createdAt: string;
  isFlagged: boolean;
}

export interface ReviewStats {
  count: number;
  avgQuality: number;
  avgSpeed: number;
  avgValue: number;
  avgOverall: number;
}

// ==============================================
// LEADERBOARD TYPES
// ==============================================

export type RankLevel = 'ลูกหมี' | 'น้องหมี' | 'พี่หมี' | 'พ่อหมี' | 'เทพหมี';

export interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  rankLevel: RankLevel;
  monthlySpending: number;
  allTimeSpending: number;
  monthlyRank?: number;
  allTimeRank?: number;
}

export interface LeaderboardData {
  monthlyLeaderboard: LeaderboardUser[];
  allTimeLeaderboard: LeaderboardUser[];
  currentUser: LeaderboardUser;
  monthEndDate: string;
}

// ==============================================
// DAILY LOGIN TYPES
// ==============================================

export interface DailyLoginBadge {
  id: string;
  name: string;
  earnedAt: string;
  streak: number;
}

export interface ClaimRecord {
  date: string;
  reward: number;
  bonus: number;
  streak: number;
}

export interface DailyLoginData {
  lastClaimDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalDaysClaimed: number;
  totalCreditsEarned: number;
  badges: DailyLoginBadge[];
  claimHistory: ClaimRecord[];
}

export interface ClaimResult {
  success: boolean;
  reward: number;
  bonus: number;
  newStreak: number;
  newBadge?: DailyLoginBadge;
  streakReset: boolean;
}

// ==============================================
// ORDER TYPES
// ==============================================

export type OrderStatus = 
  | 'Awaiting'
  | 'Pending'
  | 'In Progress'
  | 'Processing'
  | 'Completed'
  | 'Partially Completed'
  | 'On Refill'
  | 'Refilled'
  | 'Canceled'
  | 'Fail'
  | 'Error';

export interface Order {
  id: string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  startCount: number;
  remains: number;
  date: string;
  serviceId: string;
  category?: string;
}

// ==============================================
// SERVICE TYPES
// ==============================================

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  min: number;
  max: number;
  speed?: string;
  avgTime?: string;
  refill?: string;
  unit?: string;
}

// ==============================================
// TICKET TYPES
// ==============================================

export type TicketStatus = 'open' | 'answered' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'admin';
  content: string;
  timestamp: string;
  attachment?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

// ==============================================
// UI TYPES
// ==============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface TableHeader {
  label: string;
  align: 'left' | 'center' | 'right';
  width?: string;
}

// ==============================================
// COUNTDOWN TYPES
// ==============================================

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}



