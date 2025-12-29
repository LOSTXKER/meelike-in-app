// ==============================================
// AGENT REVIEWS STORAGE
// LocalStorage utilities for Agent Store Reviews
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  AgentStoreReview,
  StoreRatingSummary,
  AgentReviewFilter,
  AgentReviewSort,
  CreateAgentReviewInput,
  AgentReplyInput,
} from '@/app/types/agentReview';
import {
  generateReviewId,
  calculateStoreRatingSummary,
  maskContact,
} from '@/app/types/agentReview';
import { updateStoreRating } from './stores';

const STORAGE_KEY = 'meelike_agent_reviews';

// ==============================================
// CRUD Operations
// ==============================================

/**
 * Get all reviews for an agent's store
 */
export function getAgentReviews(agentId: string): AgentStoreReview[] {
  const allReviews = getItem<Record<string, AgentStoreReview[]>>(STORAGE_KEY, {});
  return allReviews[agentId] || [];
}

/**
 * Get review by ID
 */
export function getReviewById(agentId: string, reviewId: string): AgentStoreReview | null {
  const reviews = getAgentReviews(agentId);
  return reviews.find(r => r.id === reviewId) || null;
}

/**
 * Get review by bill ID
 */
export function getReviewByBillId(agentId: string, billId: string): AgentStoreReview | null {
  const reviews = getAgentReviews(agentId);
  return reviews.find(r => r.billId === billId) || null;
}

/**
 * Check if bill has review
 */
export function billHasReview(agentId: string, billId: string): boolean {
  return getReviewByBillId(agentId, billId) !== null;
}

/**
 * Create a new review
 */
export function createAgentReview(
  agentId: string,
  storeUsername: string,
  billId: string,
  clientId: string | undefined,
  clientName: string | undefined,
  clientContact: string,
  serviceId: number,
  serviceName: string,
  input: CreateAgentReviewInput
): AgentStoreReview {
  const allReviews = getItem<Record<string, AgentStoreReview[]>>(STORAGE_KEY, {});
  
  if (!allReviews[agentId]) {
    allReviews[agentId] = [];
  }
  
  const now = new Date().toISOString();
  const review: AgentStoreReview = {
    id: generateReviewId(),
    billId: input.billId,
    agentId,
    storeUsername,
    clientId,
    clientName,
    clientContact: maskContact(clientContact),
    rating: input.rating,
    comment: input.comment,
    serviceId,
    serviceName,
    isVisible: true,
    createdAt: now,
    updatedAt: now,
  };
  
  allReviews[agentId].unshift(review); // Add to beginning (newest first)
  setItem(STORAGE_KEY, allReviews);
  
  // Update store rating
  const summary = calculateStoreRatingSummary(allReviews[agentId]);
  updateStoreRating(agentId, summary.averageRating, summary.totalReviews);
  
  return review;
}

/**
 * Update review (agent reply, visibility)
 */
export function updateAgentReview(
  agentId: string,
  reviewId: string,
  updates: Partial<AgentStoreReview>
): AgentStoreReview | null {
  const allReviews = getItem<Record<string, AgentStoreReview[]>>(STORAGE_KEY, {});
  const reviews = allReviews[agentId] || [];
  
  const index = reviews.findIndex(r => r.id === reviewId);
  if (index === -1) return null;
  
  reviews[index] = {
    ...reviews[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  allReviews[agentId] = reviews;
  setItem(STORAGE_KEY, allReviews);
  
  return reviews[index];
}

/**
 * Add agent reply to review
 */
export function replyToReview(agentId: string, input: AgentReplyInput): AgentStoreReview | null {
  return updateAgentReview(agentId, input.reviewId, {
    agentReply: input.reply,
    agentReplyAt: new Date().toISOString(),
  });
}

/**
 * Toggle review visibility
 */
export function toggleReviewVisibility(agentId: string, reviewId: string): AgentStoreReview | null {
  const review = getReviewById(agentId, reviewId);
  if (!review) return null;
  
  const updated = updateAgentReview(agentId, reviewId, { isVisible: !review.isVisible });
  
  // Recalculate store rating
  if (updated) {
    const reviews = getAgentReviews(agentId);
    const summary = calculateStoreRatingSummary(reviews);
    updateStoreRating(agentId, summary.averageRating, summary.totalReviews);
  }
  
  return updated;
}

/**
 * Delete review (admin only)
 */
export function deleteReview(agentId: string, reviewId: string): boolean {
  const allReviews = getItem<Record<string, AgentStoreReview[]>>(STORAGE_KEY, {});
  const reviews = allReviews[agentId] || [];
  
  const index = reviews.findIndex(r => r.id === reviewId);
  if (index === -1) return false;
  
  reviews.splice(index, 1);
  allReviews[agentId] = reviews;
  setItem(STORAGE_KEY, allReviews);
  
  // Recalculate store rating
  const summary = calculateStoreRatingSummary(reviews);
  updateStoreRating(agentId, summary.averageRating, summary.totalReviews);
  
  return true;
}

// ==============================================
// Queries
// ==============================================

/**
 * Filter and sort reviews
 */
export function queryReviews(
  agentId: string,
  filter?: AgentReviewFilter,
  sort?: AgentReviewSort
): AgentStoreReview[] {
  let reviews = getAgentReviews(agentId);
  
  // Apply filters
  if (filter) {
    if (filter.rating) {
      reviews = reviews.filter(r => Math.round(r.rating) === filter.rating);
    }
    
    if (filter.hasReply !== undefined) {
      reviews = reviews.filter(r => 
        filter.hasReply ? !!r.agentReply : !r.agentReply
      );
    }
    
    if (filter.serviceId) {
      reviews = reviews.filter(r => r.serviceId === filter.serviceId);
    }
    
    if (filter.isVisible !== undefined) {
      reviews = reviews.filter(r => r.isVisible === filter.isVisible);
    }
    
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      reviews = reviews.filter(r => new Date(r.createdAt) >= fromDate);
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      reviews = reviews.filter(r => new Date(r.createdAt) <= toDate);
    }
  }
  
  // Apply sort
  if (sort) {
    reviews.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sort.order === 'desc' ? -comparison : comparison;
    });
  } else {
    // Default: newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return reviews;
}

/**
 * Get visible reviews (for public store)
 */
export function getVisibleReviews(agentId: string): AgentStoreReview[] {
  return queryReviews(agentId, { isVisible: true });
}

/**
 * Get reviews without reply
 */
export function getUnrepliedReviews(agentId: string): AgentStoreReview[] {
  return queryReviews(agentId, { hasReply: false });
}

/**
 * Get reviews by rating
 */
export function getReviewsByRating(agentId: string, rating: 1 | 2 | 3 | 4 | 5): AgentStoreReview[] {
  return queryReviews(agentId, { rating });
}

/**
 * Get recent reviews
 */
export function getRecentReviews(agentId: string, limit: number = 10): AgentStoreReview[] {
  return queryReviews(agentId).slice(0, limit);
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get store rating summary
 */
export function getStoreRatingSummary(agentId: string): StoreRatingSummary {
  const reviews = getAgentReviews(agentId);
  return calculateStoreRatingSummary(reviews);
}

/**
 * Get review count
 */
export function getReviewCount(agentId: string): number {
  return getAgentReviews(agentId).length;
}

/**
 * Get visible review count
 */
export function getVisibleReviewCount(agentId: string): number {
  return getVisibleReviews(agentId).length;
}

/**
 * Get unreplied review count
 */
export function getUnrepliedReviewCount(agentId: string): number {
  return getUnrepliedReviews(agentId).length;
}

/**
 * Get average rating
 */
export function getAverageRating(agentId: string): number {
  const summary = getStoreRatingSummary(agentId);
  return summary.averageRating;
}

/**
 * Get reviews by service
 */
export function getReviewsByService(agentId: string): Record<number, { count: number; avgRating: number }> {
  const reviews = getVisibleReviews(agentId);
  const serviceStats: Record<number, { total: number; count: number }> = {};
  
  reviews.forEach(review => {
    if (!serviceStats[review.serviceId]) {
      serviceStats[review.serviceId] = { total: 0, count: 0 };
    }
    serviceStats[review.serviceId].total += review.rating;
    serviceStats[review.serviceId].count++;
  });
  
  const result: Record<number, { count: number; avgRating: number }> = {};
  
  Object.entries(serviceStats).forEach(([serviceId, stats]) => {
    result[parseInt(serviceId)] = {
      count: stats.count,
      avgRating: Math.round((stats.total / stats.count) * 10) / 10,
    };
  });
  
  return result;
}

// ==============================================
// Utilities
// ==============================================

/**
 * Clear all reviews for an agent
 */
export function clearAgentReviews(agentId: string): void {
  const allReviews = getItem<Record<string, AgentStoreReview[]>>(STORAGE_KEY, {});
  delete allReviews[agentId];
  setItem(STORAGE_KEY, allReviews);
  
  // Reset store rating
  updateStoreRating(agentId, 0, 0);
}

/**
 * Clear all reviews (admin)
 */
export function clearAllAgentReviews(): void {
  removeItem(STORAGE_KEY);
}

/**
 * Export reviews to JSON
 */
export function exportReviewsToJson(agentId: string): string {
  const reviews = getAgentReviews(agentId);
  return JSON.stringify(reviews, null, 2);
}

