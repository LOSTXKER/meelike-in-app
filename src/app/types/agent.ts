// ==============================================
// AGENT TYPES
// Core agent data and subscription info
// ==============================================

import type { StoreLevel } from './store';

/**
 * Subscription Plan
 */
export type SubscriptionPlan = 'free' | 'boost' | 'boost_plus';

/**
 * Subscription Status
 */
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled';

/**
 * Agent - ข้อมูล Agent หลัก
 */
export interface Agent {
  id: string;
  userId: string;           // User ID ที่เป็น Agent
  username: string;         // Store URL username
  
  // Profile
  displayName: string;
  email?: string;
  phone?: string;
  lineId?: string;
  
  // Subscription
  subscription: AgentSubscription;
  
  // Stats
  totalBills: number;
  totalRevenue: number;
  totalProfit: number;
  totalClients: number;
  
  // Store
  storeId?: string;
  hasStore: boolean;
  
  // Status
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Agent Subscription - แพ็คเกจปัจจุบัน
 */
export interface AgentSubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  
  // Trial (if applicable)
  isTrial: boolean;
  trialEndsAt?: string;
  
  // Billing
  billingCycle: 'monthly' | 'yearly';
  price: number;
  nextBillingDate?: string;
  
  // Dates
  startedAt: string;
  expiresAt?: string;
  cancelledAt?: string;
  
  // Usage this period
  billsUsed: number;
  billsLimit: number;
  clientsUsed: number;
  clientsLimit: number;
}

/**
 * Subscription Plan Details
 */
export interface SubscriptionPlanDetails {
  id: SubscriptionPlan;
  name: string;
  nameEn: string;
  
  // Pricing
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;   // % saved
  
  // Store
  storeLevel: StoreLevel;
  
  // Limits
  billsPerMonth: number;    // -1 = unlimited
  clientsLimit: number;     // -1 = unlimited
  servicesLimit: number;    // Store services limit
  billHistoryDays: number;  // -1 = unlimited
  billTemplates: number;    // -1 = unlimited
  quickReplies: number;     // -1 = unlimited
  clientTags: number;       // -1 = unlimited
  coupons: number;          // -1 = unlimited
  
  // Features
  features: {
    bulkCreate: boolean;
    bulkCreateLimit: number;   // per batch
    importCsv: boolean;
    customerSegments: boolean;
    exportCsv: boolean;
    exportExcel: boolean;
    customBranding: boolean;
    hideMeeLikeBranding: boolean;
    flashSale: boolean;
    loyaltyTiers: boolean;
    lineNotification: boolean;
    emailNotification: boolean;
    autoReply: boolean;
    bulkMessages: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    analytics: 'basic' | 'advanced' | 'pro';
  };
  
  // Bonuses
  referralBonus: number;    // %
  dailyLoginMultiplier: number;
  agentDiscount: number;    // % ส่วนลดต้นทุน
  
  // Trial
  trialDays: number;
  
  // Display
  badge?: string;
  color: string;
  recommended?: boolean;
}

/**
 * Agent Dashboard Stats
 */
export interface AgentDashboardStats {
  // Today
  today: {
    bills: number;
    revenue: number;
    profit: number;
    newClients: number;
  };
  
  // This month
  thisMonth: {
    bills: number;
    revenue: number;
    profit: number;
    newClients: number;
    avgOrderValue: number;
  };
  
  // All time
  allTime: {
    bills: number;
    revenue: number;
    profit: number;
    totalClients: number;
  };
  
  // Pending actions
  pending: {
    pendingBills: number;      // รอยืนยัน
    processingBills: number;   // กำลังทำ
    unreadNotifications: number;
    unrepliedReviews: number;
  };
  
  // Recent
  recentBills: Array<{
    id: string;
    clientName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

/**
 * Agent Usage Limits Check
 */
export interface AgentLimitsCheck {
  canCreateBill: boolean;
  remainingBills: number;     // -1 = unlimited
  
  canAddClient: boolean;
  remainingClients: number;
  
  canAddService: boolean;
  remainingServices: number;
  
  canCreateCoupon: boolean;
  remainingCoupons: number;
  
  canCreateTemplate: boolean;
  remainingTemplates: number;
  
  needsUpgrade: boolean;
  suggestedPlan?: SubscriptionPlan;
}

// ==============================================
// CONSTANTS
// ==============================================

/**
 * All Subscription Plans
 */
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, SubscriptionPlanDetails> = {
  free: {
    id: 'free',
    name: 'Free',
    nameEn: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyDiscount: 0,
    storeLevel: 'starter',
    billsPerMonth: 50,
    clientsLimit: 20,
    servicesLimit: 5,
    billHistoryDays: 30,
    billTemplates: 0,
    quickReplies: 0,
    clientTags: 3,
    coupons: 0,
    features: {
      bulkCreate: false,
      bulkCreateLimit: 0,
      importCsv: false,
      customerSegments: false,
      exportCsv: false,
      exportExcel: false,
      customBranding: false,
      hideMeeLikeBranding: false,
      flashSale: false,
      loyaltyTiers: false,
      lineNotification: false,
      emailNotification: false,
      autoReply: false,
      bulkMessages: false,
      apiAccess: false,
      prioritySupport: false,
      analytics: 'basic',
    },
    referralBonus: 5,
    dailyLoginMultiplier: 1,
    agentDiscount: 0,
    trialDays: 0,
    color: 'gray',
  },
  boost: {
    id: 'boost',
    name: 'Boost',
    nameEn: 'Boost',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    yearlyDiscount: 17,
    storeLevel: 'pro',
    billsPerMonth: 300,
    clientsLimit: 100,
    servicesLimit: 20,
    billHistoryDays: 90,
    billTemplates: 5,
    quickReplies: 5,
    clientTags: 10,
    coupons: 3,
    features: {
      bulkCreate: true,
      bulkCreateLimit: 10,
      importCsv: false,
      customerSegments: true,
      exportCsv: true,
      exportExcel: false,
      customBranding: false,
      hideMeeLikeBranding: false,
      flashSale: false,
      loyaltyTiers: false,
      lineNotification: true,
      emailNotification: false,
      autoReply: false,
      bulkMessages: false,
      apiAccess: false,
      prioritySupport: false,
      analytics: 'advanced',
    },
    referralBonus: 7,
    dailyLoginMultiplier: 1.25,
    agentDiscount: 3,
    trialDays: 7,
    badge: 'Boost',
    color: 'amber',
    recommended: true,
  },
  boost_plus: {
    id: 'boost_plus',
    name: 'Boost+',
    nameEn: 'Boost Plus',
    monthlyPrice: 399,
    yearlyPrice: 3990,
    yearlyDiscount: 17,
    storeLevel: 'business',
    billsPerMonth: -1, // Unlimited
    clientsLimit: -1,
    servicesLimit: -1,
    billHistoryDays: -1,
    billTemplates: -1,
    quickReplies: -1,
    clientTags: -1,
    coupons: -1,
    features: {
      bulkCreate: true,
      bulkCreateLimit: -1, // Unlimited
      importCsv: true,
      customerSegments: true,
      exportCsv: true,
      exportExcel: true,
      customBranding: true,
      hideMeeLikeBranding: true,
      flashSale: true,
      loyaltyTiers: true,
      lineNotification: true,
      emailNotification: true,
      autoReply: true,
      bulkMessages: true,
      apiAccess: true,
      prioritySupport: true,
      analytics: 'pro',
    },
    referralBonus: 10,
    dailyLoginMultiplier: 1.5,
    agentDiscount: 5,
    trialDays: 7,
    badge: 'Boost+',
    color: 'purple',
  },
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Agent ID
 */
export function generateAgentId(): string {
  return `agent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get Plan Details
 */
export function getPlanDetails(plan: SubscriptionPlan): SubscriptionPlanDetails {
  return SUBSCRIPTION_PLANS[plan];
}

/**
 * Get Plan Label
 */
export function getPlanLabel(plan: SubscriptionPlan): string {
  return SUBSCRIPTION_PLANS[plan].name;
}

/**
 * Get Plan Badge Color
 */
export function getPlanBadgeColor(plan: SubscriptionPlan): string {
  const colors: Record<SubscriptionPlan, string> = {
    free: 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
    boost: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30',
    boost_plus: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30',
  };
  return colors[plan];
}

/**
 * Get Subscription Status Label
 */
export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'ใช้งาน',
    trial: 'ทดลองใช้',
    expired: 'หมดอายุ',
    cancelled: 'ยกเลิก',
  };
  return labels[status];
}

/**
 * Get Subscription Status Color
 */
export function getSubscriptionStatusColor(status: SubscriptionStatus): string {
  const colors: Record<SubscriptionStatus, string> = {
    active: 'text-success-emphasis bg-success-subtle',
    trial: 'text-info-emphasis bg-info-subtle',
    expired: 'text-error-emphasis bg-error-subtle',
    cancelled: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700',
  };
  return colors[status];
}

/**
 * Check if plan has feature
 */
export function planHasFeature(
  plan: SubscriptionPlan,
  feature: keyof SubscriptionPlanDetails['features']
): boolean {
  const details = SUBSCRIPTION_PLANS[plan];
  const value = details.features[feature];
  return typeof value === 'boolean' ? value : true;
}

/**
 * Get limit for plan
 */
export function getPlanLimit(
  plan: SubscriptionPlan,
  limit: 'billsPerMonth' | 'clientsLimit' | 'servicesLimit' | 'billTemplates' | 'coupons'
): number {
  return SUBSCRIPTION_PLANS[plan][limit];
}

/**
 * Check if limit is unlimited
 */
export function isUnlimited(value: number): boolean {
  return value === -1;
}

/**
 * Format limit display
 */
export function formatLimitDisplay(value: number): string {
  return isUnlimited(value) ? 'ไม่จำกัด' : value.toString();
}

/**
 * Calculate days until expiry
 */
export function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false;
  return getDaysUntilExpiry(expiresAt) <= 7;
}

/**
 * Check agent limits
 */
export function checkAgentLimits(
  subscription: AgentSubscription,
  currentCounts: {
    services: number;
    coupons: number;
    templates: number;
  }
): AgentLimitsCheck {
  const plan = getPlanDetails(subscription.plan);
  
  const remainingBills = isUnlimited(plan.billsPerMonth) 
    ? -1 
    : plan.billsPerMonth - subscription.billsUsed;
  
  const remainingClients = isUnlimited(plan.clientsLimit)
    ? -1
    : plan.clientsLimit - subscription.clientsUsed;
  
  const remainingServices = isUnlimited(plan.servicesLimit)
    ? -1
    : plan.servicesLimit - currentCounts.services;
  
  const remainingCoupons = isUnlimited(plan.coupons)
    ? -1
    : plan.coupons - currentCounts.coupons;
  
  const remainingTemplates = isUnlimited(plan.billTemplates)
    ? -1
    : plan.billTemplates - currentCounts.templates;
  
  const canCreateBill = remainingBills !== 0;
  const canAddClient = remainingClients !== 0;
  const canAddService = remainingServices !== 0;
  const canCreateCoupon = remainingCoupons !== 0;
  const canCreateTemplate = remainingTemplates !== 0;
  
  const needsUpgrade = !canCreateBill || !canAddClient || !canAddService;
  
  let suggestedPlan: SubscriptionPlan | undefined;
  if (needsUpgrade) {
    if (subscription.plan === 'free') suggestedPlan = 'boost';
    else if (subscription.plan === 'boost') suggestedPlan = 'boost_plus';
  }
  
  return {
    canCreateBill,
    remainingBills,
    canAddClient,
    remainingClients,
    canAddService,
    remainingServices,
    canCreateCoupon,
    remainingCoupons,
    canCreateTemplate,
    remainingTemplates,
    needsUpgrade,
    suggestedPlan,
  };
}

