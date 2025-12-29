// src/app/types/review.ts
// ═══════════════════════════════════════════════════════════════════════════
// ⭐ REVIEW TYPES - Customer Reviews
// ═══════════════════════════════════════════════════════════════════════════

export interface Review {
  id: string;
  billId: string;
  agentId: string;
  storeUsername: string;
  
  // Reviewer
  customerName?: string;
  customerContact: string;    // masked: 081-xxx-xxxx
  
  // Review Content
  rating: number;             // 1-5
  comment?: string;
  
  // Service Info
  serviceId: number;
  serviceName: string;
  
  // Agent Reply
  agentReply?: string;
  agentReplyAt?: string;
  
  // Status
  isVisible: boolean;
  
  createdAt: string;
}

export interface StoreRating {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewInput {
  billId: string;
  rating: number;
  comment?: string;
  customerName?: string;
}

export interface ReplyReviewInput {
  reviewId: string;
  reply: string;
}

