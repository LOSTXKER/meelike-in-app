// ===== MeeLike Seller - TypeScript Types =====

// ===== USER & AUTH =====
export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'seller' | 'worker' | 'admin';
  createdAt: string;
}

// ===== SELLER =====
export interface Seller {
  id: string;
  userId: string;
  
  // Profile
  displayName: string;
  storeName: string;
  storeSlug: string;
  avatar?: string;
  bio?: string;
  
  // Contact
  lineId?: string;
  phone?: string;
  email?: string;
  
  // Subscription
  plan: 'free' | 'starter' | 'pro' | 'business';
  planExpiresAt?: string;
  
  // Wallet
  balance: number;
  
  // Stats
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  ratingCount: number;
  
  // Store Theme
  storeTheme: StoreTheme;
  customTheme?: StoreThemeConfig;
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== WORKER =====
export interface Worker {
  id: string;
  userId: string;
  
  // Profile
  displayName: string;
  avatar?: string;
  bio?: string;
  
  // Contact
  lineId?: string;
  phone?: string;
  
  // Bank Info
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  promptPayId?: string;
  
  // Stats
  totalJobs: number;
  totalEarned: number;
  completionRate: number;
  
  // Rating & Level
  rating: number;
  ratingCount: number;
  level: WorkerLevel;
  totalJobsCompleted: number;
  
  // Balance
  pendingBalance: number;
  availableBalance: number;
  
  // Status
  isActive: boolean;
  isBanned: boolean;
  
  // Teams
  teamIds: string[];
  
  // Gamification
  dailyStreak: number;
  monthlyJobsTarget: number;
  monthlyJobsCompleted: number;
  
  // Timestamps
  createdAt: string;
  lastActiveAt: string;
}

export type WorkerLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';

// ===== TEAM =====
export interface Team {
  id: string;
  sellerId: string;
  
  // Team Info
  name: string;
  description?: string;
  avatar?: string;
  
  // Rules
  rules?: string[];
  
  // Invite Settings
  inviteCode: string;
  inviteLinkExpiry?: string;
  requireApproval: boolean;
  
  // Visibility
  isPublic: boolean;
  isRecruiting: boolean;
  recruitingMessage?: string;
  
  // Stats
  memberCount: number;
  activeJobCount: number;
  totalJobsCompleted: number;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== TEAM MEMBER =====
export interface TeamMember {
  id: string;
  teamId: string;
  workerId: string;
  
  // Status
  status: 'pending' | 'active' | 'inactive' | 'banned';
  role: 'member' | 'admin';
  
  // Stats (within team)
  jobsCompleted: number;
  totalEarned: number;
  rating: number;
  ratingCount: number;
  
  // Timestamps
  joinedAt: string;
  lastActiveAt: string;
  invitedBy?: string;
}

// ===== TEAM JOIN REQUEST =====
export interface TeamJoinRequest {
  id: string;
  teamId: string;
  workerId: string;
  
  // Request Info
  message?: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  
  // Timestamps
  createdAt: string;
}

// ===== STORE & SERVICES =====
export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';
export type ServiceActionType = 'like' | 'comment' | 'follow' | 'share' | 'view';
export type ServiceType = 'bot' | 'human';

export interface StoreService {
  id: string;
  sellerId: string;
  
  // Service Info
  name: string;
  description?: string;
  category: Platform;
  type: ServiceActionType;
  serviceType: ServiceType;
  
  // Pricing
  costPrice: number;
  sellPrice: number;
  minQuantity: number;
  maxQuantity: number;
  
  // Bot Config
  meelikeServiceId?: string;
  
  // Human Config
  estimatedTime?: string;
  
  // Status
  isActive: boolean;
  
  // Stats
  orderCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== STORE THEME =====
export type StoreTheme = 
  | 'meelike' | 'ocean' | 'purple' | 'dark' | 'sakura'
  | 'red' | 'green' | 'orange' | 'minimal' | 'custom';

export interface StoreThemeConfig {
  theme: StoreTheme;
  customPrimary?: string;
  customSecondary?: string;
  customAccent?: string;
  customBackground?: string;
}

// ===== ORDERS =====
export type ContactType = 'line' | 'facebook' | 'phone' | 'email';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
export type OrderItemStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface OrderCustomer {
  name: string;
  contactType: ContactType;
  contactValue: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  
  // Seller
  sellerId: string;
  
  // Customer Info
  customer: OrderCustomer;
  
  // Order Items
  items: OrderItem[];
  
  // Pricing Summary
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentProof?: string;
  paidAt?: string;
  
  // Status (overall)
  status: OrderStatus;
  progress: number;
  
  // Notes
  sellerNote?: string;
  
  // Tracking
  trackingUrl: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  
  // Service Info
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  platform: Platform;
  type: ServiceActionType;
  
  // Target
  targetUrl: string;
  quantity: number;
  
  // For Comment
  commentTemplates?: string[];
  
  // Pricing
  unitPrice: number;
  subtotal: number;
  
  // Cost (for seller)
  costPerUnit: number;
  totalCost: number;
  profit: number;
  profitPercent: number;
  
  // Progress
  status: OrderItemStatus;
  progress: number;
  completedQuantity: number;
  
  // Execution
  meelikeOrderId?: string;
  jobId?: string;
  
  // Timestamps
  startedAt?: string;
  completedAt?: string;
}

export type OrderTimelineEvent = 
  | 'created' 
  | 'paid' 
  | 'confirmed' 
  | 'bot_started' 
  | 'bot_completed'
  | 'job_created'
  | 'job_progress'
  | 'job_completed'
  | 'completed'
  | 'cancelled';

export interface OrderTimeline {
  id: string;
  orderId: string;
  
  // Event
  event: OrderTimelineEvent;
  
  // Details
  itemId?: string;
  message: string;
  
  // Timestamp
  createdAt: string;
}

// ===== JOBS (Worker Tasks) =====
export type JobVisibility = 'all_members' | 'level_required' | 'selected';
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type JobClaimStatus = 'claimed' | 'submitted' | 'approved' | 'rejected' | 'cancelled';

export interface Job {
  id: string;
  sellerId: string;
  orderId?: string;
  orderItemId?: string;
  
  // Job Info
  title?: string;
  type: ServiceActionType;
  platform: Platform;
  
  // Target
  targetUrl: string;
  targetQuantity: number;
  
  // Pricing
  pricePerUnit: number;
  
  // Requirements
  requirements?: string;
  commentTemplates?: string[];
  
  // Schedule
  endsAt?: string;
  
  // Access Control (Team Only)
  teamId: string;
  visibility: JobVisibility;
  allowedWorkerIds?: string[];
  minLevelRequired?: WorkerLevel;
  
  // Worker Requirements
  minWorkerLevel?: WorkerLevel;
  minWorkerRating?: number;
  minWorkerFollowers?: number;
  requireProfilePicture?: boolean;
  
  // Progress
  status: JobStatus;
  claimedQuantity: number;
  completedQuantity: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface JobClaim {
  id: string;
  jobId: string;
  workerId: string;
  workerAccountId: string;
  
  // Claim Details
  quantity: number;
  earnAmount: number;
  
  // Status
  status: JobClaimStatus;
  
  // Submission
  submittedAt?: string;
  proofUrls?: string[];
  actualQuantity?: number;
  workerNote?: string;
  
  // Review (by Seller)
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  
  // Rating (after approval)
  sellerRating?: number;
  sellerReview?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== WORKER ACCOUNT =====
export type VerificationStatus = 'pending' | 'ai_review' | 'manual_review' | 'verified' | 'rejected';

export interface WorkerAccount {
  id: string;
  workerId: string;
  
  // Account Info
  platform: Platform;
  username: string;
  profileUrl: string;
  
  // Verification
  screenshotUrl: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: 'ai' | 'admin';
  
  // AI Result
  aiResult?: {
    passed: boolean;
    confidence: number;
    hasProfilePicture: boolean;
    detectedFollowers?: number;
    usernameMatch: boolean;
    notes: string;
  };
  
  // Rejection
  rejectionReason?: string;
  
  // Stats
  followers?: number;
  profilePictureExists: boolean;
  accountAge?: string;
  
  // Usage
  isActive: boolean;
  lastUsedAt?: string;
  jobsCompleted: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== PAYOUT =====
export type PayoutMethod = 'promptpay' | 'bank_transfer';
export type PayoutStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'failed';

export interface Payout {
  id: string;
  workerId: string;
  
  // Amount
  requestedAmount: number;
  feeAmount: number;
  feePercent: number;
  netAmount: number;
  
  // Method
  method: PayoutMethod;
  promptpayNumber?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  
  // Status
  status: PayoutStatus;
  
  // Review
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  
  // Transfer
  transferredAt?: string;
  bankRefNumber?: string;
  errorMessage?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface WorkerBankAccount {
  id: string;
  workerId: string;
  
  // Bank Info
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  
  // PromptPay
  promptpayNumber?: string;
  
  // Status
  isDefault: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: string;
}

// ===== NOTIFICATION =====
export type NotificationType = 
  | 'order_new'
  | 'order_paid'
  | 'order_completed'
  | 'job_new'
  | 'job_approved'
  | 'job_rejected'
  | 'payout_completed'
  | 'team_join_request'
  | 'team_joined';

export interface Notification {
  id: string;
  userId: string;
  
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  
  isRead: boolean;
  
  createdAt: string;
}

