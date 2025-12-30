// ==============================================
// REVIEWS STORAGE
// Functions for managing review data in localStorage
// ==============================================

import type { ReviewData, ReviewStats } from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { getItem, setItem, isBrowser } from './base';

// Get all reviews
export const getReviews = (): ReviewData[] => {
  return getItem<ReviewData[]>(STORAGE_KEYS.REVIEWS, []);
};

// Save a new review
export const saveReview = (review: ReviewData): void => {
  if (!isBrowser()) return;
  const reviews = getReviews();
  reviews.push(review);
  setItem(STORAGE_KEYS.REVIEWS, reviews);
};

// Save all reviews (replace existing)
export const saveAllReviews = (reviews: ReviewData[]): void => {
  setItem(STORAGE_KEYS.REVIEWS, reviews);
};

// Get review by order ID
export const getReviewByOrderId = (orderId: string): ReviewData | null => {
  if (!isBrowser()) return null;
  const reviews = getReviews();
  return reviews.find(r => r.orderId === orderId) || null;
};

// Check if order has review
export const hasReviewForOrder = (orderId: string): boolean => {
  if (!isBrowser()) return false;
  return getReviewByOrderId(orderId) !== null;
};

// Get reviews by service ID
export const getReviewsByServiceId = (serviceId: string): ReviewData[] => {
  if (!isBrowser()) return [];
  const reviews = getReviews();
  return reviews.filter(r => r.serviceId === serviceId && !r.isFlagged);
};

// Get service review statistics
export const getServiceReviewStats = (serviceId: string): ReviewStats | null => {
  if (!isBrowser()) return null;
  const reviews = getReviewsByServiceId(serviceId);
  
  if (reviews.length === 0) {
    return null;
  }

  const avgQuality = reviews.reduce((sum, r) => sum + r.qualityRating, 0) / reviews.length;
  const avgSpeed = reviews.reduce((sum, r) => sum + r.speedRating, 0) / reviews.length;
  const avgValue = reviews.reduce((sum, r) => sum + r.valueRating, 0) / reviews.length;
  const avgOverall = (avgQuality + avgSpeed + avgValue) / 3;

  return {
    count: reviews.length,
    avgQuality: Number(avgQuality.toFixed(1)),
    avgSpeed: Number(avgSpeed.toFixed(1)),
    avgValue: Number(avgValue.toFixed(1)),
    avgOverall: Number(avgOverall.toFixed(1))
  };
};

// Get display reviews (filtered for good ratings)
export const getDisplayReviews = (serviceId: string, limit: number = 5): ReviewData[] => {
  if (!isBrowser()) return [];
  const reviews = getReviewsByServiceId(serviceId);
  const avgRating = (r: ReviewData) => (r.qualityRating + r.speedRating + r.valueRating) / 3;
  
  return reviews
    .filter(r => avgRating(r) >= 4) // Only show 4-5 star reviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

// Clear all reviews
export const clearReviews = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEYS.REVIEWS);
};




