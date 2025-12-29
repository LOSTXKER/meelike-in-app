// ==============================================
// AGENT STORE REVIEW TYPES
// Customer reviews for Agent Store (different from service reviews)
// ==============================================

/**
 * Agent Store Review - รีวิวจากลูกค้าสำหรับร้าน Agent
 */
export interface AgentStoreReview {
  id: string;
  billId: string;           // บิลที่รีวิว
  agentId: string;
  storeUsername: string;
  
  // Reviewer Info
  clientId?: string;
  clientName?: string;      // ถ้าไม่ใส่จะใช้ "ลูกค้า"
  clientContact: string;    // masked: 081-xxx-xxxx
  
  // Review Content
  rating: number;           // 1-5 stars
  comment?: string;
  
  // Service Info (จากบิล)
  serviceId: number;
  serviceName: string;
  
  // Agent Reply
  agentReply?: string;
  agentReplyAt?: string;
  
  // Status
  isVisible: boolean;       // Agent สามารถซ่อนได้
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Store Rating Summary - สรุป rating ของร้าน
 */
export interface StoreRatingSummary {
  averageRating: number;    // 0-5
  totalReviews: number;
  
  // Distribution
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  
  // Recent positive reviews
  positiveReviewsPercent: number; // % ของ 4-5 stars
}

/**
 * Review Filter Options
 */
export interface AgentReviewFilter {
  rating?: 1 | 2 | 3 | 4 | 5;
  hasReply?: boolean;
  serviceId?: number;
  isVisible?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Review Sort Options
 */
export type AgentReviewSortField = 'createdAt' | 'rating';
export type AgentReviewSortOrder = 'asc' | 'desc';

export interface AgentReviewSort {
  field: AgentReviewSortField;
  order: AgentReviewSortOrder;
}

/**
 * Create Review Input (from customer)
 */
export interface CreateAgentReviewInput {
  billId: string;
  rating: number;
  comment?: string;
}

/**
 * Agent Reply Input
 */
export interface AgentReplyInput {
  reviewId: string;
  reply: string;
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Review ID
 */
export function generateReviewId(): string {
  return `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Mask contact for display
 */
export function maskContact(contact: string): string {
  if (!contact) return 'ลูกค้า';
  
  // Phone number: 081-234-5678 → 081-xxx-5678
  if (/^\d{3}-?\d{3}-?\d{4}$/.test(contact.replace(/-/g, ''))) {
    const digits = contact.replace(/\D/g, '');
    return `${digits.slice(0, 3)}-xxx-${digits.slice(-4)}`;
  }
  
  // LINE ID or other: show first 3 chars
  if (contact.length > 6) {
    return `${contact.slice(0, 3)}***`;
  }
  
  return 'ลูกค้า';
}

/**
 * Get Rating Label
 */
export function getRatingLabel(rating: number): string {
  const labels: Record<number, string> = {
    5: 'ยอดเยี่ยม',
    4: 'ดีมาก',
    3: 'พอใช้',
    2: 'ต้องปรับปรุง',
    1: 'แย่',
  };
  return labels[Math.round(rating)] || '';
}

/**
 * Get Rating Color
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
  if (rating >= 4) return 'text-green-500 dark:text-green-500';
  if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
  if (rating >= 2) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Calculate Rating Distribution
 */
export function calculateRatingDistribution(
  reviews: AgentStoreReview[]
): StoreRatingSummary['distribution'] {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  
  return distribution;
}

/**
 * Calculate Store Rating Summary
 */
export function calculateStoreRatingSummary(
  reviews: AgentStoreReview[]
): StoreRatingSummary {
  const visibleReviews = reviews.filter(r => r.isVisible);
  
  if (visibleReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      positiveReviewsPercent: 0,
    };
  }
  
  const total = visibleReviews.reduce((sum, r) => sum + r.rating, 0);
  const average = total / visibleReviews.length;
  const distribution = calculateRatingDistribution(visibleReviews);
  const positiveCount = distribution[5] + distribution[4];
  
  return {
    averageRating: Math.round(average * 10) / 10,
    totalReviews: visibleReviews.length,
    distribution,
    positiveReviewsPercent: Math.round((positiveCount / visibleReviews.length) * 100),
  };
}

/**
 * Format time ago
 */
export function formatReviewTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  
  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 30) return `${days} วันที่แล้ว`;
  if (months < 12) return `${months} เดือนที่แล้ว`;
  
  return date.toLocaleDateString('th-TH');
}

/**
 * Check if review can be replied
 */
export function canReplyToReview(review: AgentStoreReview): boolean {
  return !review.agentReply;
}

/**
 * Check if review can be hidden
 */
export function canHideReview(review: AgentStoreReview): boolean {
  // Can't hide positive reviews (anti-manipulation)
  // But we allow hiding if it's spam or inappropriate
  return true;
}

/**
 * Generate stars display
 */
export function generateStarsDisplay(rating: number, maxStars: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

