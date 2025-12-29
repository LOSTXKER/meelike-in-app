// ==============================================
// AGENT STORAGE
// LocalStorage utilities for Agent data
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  Agent,
  AgentSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
  AgentDashboardStats,
  AgentLimitsCheck,
} from '@/app/types/agent';
import {
  generateAgentId,
  getPlanDetails,
  checkAgentLimits,
  SUBSCRIPTION_PLANS,
} from '@/app/types/agent';
import { getBillSummary, getRevenueByPeriod, getBillCountByPeriod, getRecentBills } from './bills';
import { getClientCount, getClientSummary } from './clients';
import { getUnreadCount } from './notifications';
import { getUnrepliedReviewCount } from './agentReviews';
import { getBillTemplateCount, getQuickReplyCount } from './templates';
import { getCouponCount } from './promotions';
import { getStoreSettings } from './stores';

const STORAGE_KEY = 'meelike_agent_data';

// ==============================================
// Agent CRUD
// ==============================================

/**
 * Get agent by ID
 */
export function getAgent(agentId: string): Agent | null {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  return agents[agentId] || null;
}

/**
 * Get agent by user ID
 */
export function getAgentByUserId(userId: string): Agent | null {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  return Object.values(agents).find(a => a.userId === userId) || null;
}

/**
 * Get agent by username
 */
export function getAgentByUsername(username: string): Agent | null {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  return Object.values(agents).find(a => a.username === username) || null;
}

/**
 * Create new agent
 */
export function createAgent(
  userId: string,
  username: string,
  displayName: string,
  plan: SubscriptionPlan = 'free'
): Agent {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  const planDetails = getPlanDetails(plan);
  
  const now = new Date().toISOString();
  const agentId = generateAgentId();
  
  const subscription: AgentSubscription = {
    plan,
    status: plan === 'free' ? 'active' : 'trial',
    isTrial: plan !== 'free',
    trialEndsAt: plan !== 'free' 
      ? new Date(Date.now() + planDetails.trialDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
    billingCycle: 'monthly',
    price: planDetails.monthlyPrice,
    startedAt: now,
    billsUsed: 0,
    billsLimit: planDetails.billsPerMonth,
    clientsUsed: 0,
    clientsLimit: planDetails.clientsLimit,
  };
  
  const agent: Agent = {
    id: agentId,
    userId,
    username,
    displayName,
    subscription,
    totalBills: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalClients: 0,
    hasStore: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  
  agents[agentId] = agent;
  setItem(STORAGE_KEY, agents);
  
  return agent;
}

/**
 * Update agent
 */
export function updateAgent(agentId: string, updates: Partial<Agent>): Agent | null {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  
  if (!agents[agentId]) return null;
  
  agents[agentId] = {
    ...agents[agentId],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  setItem(STORAGE_KEY, agents);
  return agents[agentId];
}

/**
 * Delete agent
 */
export function deleteAgent(agentId: string): boolean {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  
  if (!agents[agentId]) return false;
  
  delete agents[agentId];
  setItem(STORAGE_KEY, agents);
  
  return true;
}

// ==============================================
// Subscription Management
// ==============================================

/**
 * Update subscription
 */
export function updateSubscription(
  agentId: string,
  updates: Partial<AgentSubscription>
): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  return updateAgent(agentId, {
    subscription: {
      ...agent.subscription,
      ...updates,
    },
  });
}

/**
 * Upgrade subscription
 */
export function upgradeSubscription(
  agentId: string,
  newPlan: SubscriptionPlan,
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  const planDetails = getPlanDetails(newPlan);
  const price = billingCycle === 'yearly' ? planDetails.yearlyPrice : planDetails.monthlyPrice;
  
  const now = new Date();
  const expiresAt = new Date(now);
  if (billingCycle === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }
  
  return updateSubscription(agentId, {
    plan: newPlan,
    status: 'active',
    isTrial: false,
    trialEndsAt: undefined,
    billingCycle,
    price,
    startedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    nextBillingDate: expiresAt.toISOString(),
    billsUsed: 0, // Reset for new period
    billsLimit: planDetails.billsPerMonth,
    clientsUsed: agent.subscription.clientsUsed, // Keep client count
    clientsLimit: planDetails.clientsLimit,
  });
}

/**
 * Cancel subscription
 */
export function cancelSubscription(agentId: string): Agent | null {
  return updateSubscription(agentId, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
  });
}

/**
 * Check and update subscription status
 */
export function checkSubscriptionStatus(agentId: string): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  const { subscription } = agent;
  const now = new Date();
  
  // Check trial expiry
  if (subscription.isTrial && subscription.trialEndsAt) {
    if (now > new Date(subscription.trialEndsAt)) {
      return updateSubscription(agentId, {
        status: 'expired',
        isTrial: false,
      });
    }
  }
  
  // Check subscription expiry
  if (subscription.expiresAt && now > new Date(subscription.expiresAt)) {
    return updateSubscription(agentId, {
      status: 'expired',
    });
  }
  
  return agent;
}

/**
 * Increment bills used
 */
export function incrementBillsUsed(agentId: string): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  return updateAgent(agentId, {
    subscription: {
      ...agent.subscription,
      billsUsed: agent.subscription.billsUsed + 1,
    },
    totalBills: agent.totalBills + 1,
  });
}

/**
 * Increment clients used
 */
export function incrementClientsUsed(agentId: string): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  return updateAgent(agentId, {
    subscription: {
      ...agent.subscription,
      clientsUsed: agent.subscription.clientsUsed + 1,
    },
    totalClients: agent.totalClients + 1,
  });
}

/**
 * Update revenue stats
 */
export function updateRevenueStats(
  agentId: string,
  revenue: number,
  profit: number
): Agent | null {
  const agent = getAgent(agentId);
  if (!agent) return null;
  
  return updateAgent(agentId, {
    totalRevenue: agent.totalRevenue + revenue,
    totalProfit: agent.totalProfit + profit,
  });
}

// ==============================================
// Dashboard Stats
// ==============================================

/**
 * Get dashboard stats
 */
export function getDashboardStats(agentId: string): AgentDashboardStats {
  const billSummary = getBillSummary(agentId);
  const todayRevenue = getRevenueByPeriod(agentId, 'today');
  const monthRevenue = getRevenueByPeriod(agentId, 'month');
  const allTimeRevenue = getRevenueByPeriod(agentId, 'all');
  const clientSummary = getClientSummary(agentId);
  const recentBills = getRecentBills(agentId, 5);
  
  return {
    today: {
      bills: getBillCountByPeriod(agentId, 'today'),
      revenue: todayRevenue.revenue,
      profit: todayRevenue.profit,
      newClients: 0, // Would need to track this
    },
    thisMonth: {
      bills: getBillCountByPeriod(agentId, 'month'),
      revenue: monthRevenue.revenue,
      profit: monthRevenue.profit,
      newClients: 0,
      avgOrderValue: billSummary.completed > 0 
        ? monthRevenue.revenue / getBillCountByPeriod(agentId, 'month')
        : 0,
    },
    allTime: {
      bills: billSummary.total,
      revenue: allTimeRevenue.revenue,
      profit: allTimeRevenue.profit,
      totalClients: clientSummary.total,
    },
    pending: {
      pendingBills: billSummary.pending,
      processingBills: billSummary.processing,
      unreadNotifications: getUnreadCount(agentId),
      unrepliedReviews: getUnrepliedReviewCount(agentId),
    },
    recentBills: recentBills.map(bill => ({
      id: bill.id,
      clientName: bill.clientName,
      amount: bill.totalAmount,
      status: bill.status,
      createdAt: bill.createdAt,
    })),
  };
}

/**
 * Get agent limits check
 */
export function getAgentLimitsCheck(agentId: string): AgentLimitsCheck {
  const agent = getAgent(agentId);
  if (!agent) {
    return {
      canCreateBill: false,
      remainingBills: 0,
      canAddClient: false,
      remainingClients: 0,
      canAddService: false,
      remainingServices: 0,
      canCreateCoupon: false,
      remainingCoupons: 0,
      canCreateTemplate: false,
      remainingTemplates: 0,
      needsUpgrade: true,
    };
  }
  
  const store = getStoreSettings(agentId);
  
  return checkAgentLimits(agent.subscription, {
    services: store?.services.length || 0,
    coupons: getCouponCount(agentId),
    templates: getBillTemplateCount(agentId),
  });
}

// ==============================================
// Validation
// ==============================================

/**
 * Check if username is available
 */
export function isUsernameAvailable(username: string, excludeAgentId?: string): boolean {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  return !Object.values(agents).some(
    a => a.username === username && a.id !== excludeAgentId
  );
}

/**
 * Check if user already has agent
 */
export function userHasAgent(userId: string): boolean {
  return getAgentByUserId(userId) !== null;
}

// ==============================================
// Utilities
// ==============================================

/**
 * Get all agents (admin)
 */
export function getAllAgents(): Agent[] {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  return Object.values(agents);
}

/**
 * Get agent count
 */
export function getAgentCount(): number {
  return getAllAgents().length;
}

/**
 * Clear agent data
 */
export function clearAgentData(agentId: string): void {
  deleteAgent(agentId);
}

/**
 * Clear all agents (admin)
 */
export function clearAllAgents(): void {
  removeItem(STORAGE_KEY);
}

/**
 * Reset monthly usage (for cron job)
 */
export function resetMonthlyUsage(): void {
  const agents = getItem<Record<string, Agent>>(STORAGE_KEY, {});
  
  Object.keys(agents).forEach(agentId => {
    agents[agentId].subscription.billsUsed = 0;
    agents[agentId].updatedAt = new Date().toISOString();
  });
  
  setItem(STORAGE_KEY, agents);
}

