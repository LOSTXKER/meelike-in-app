// src/app/types/promotion.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🎁 PROMOTION TYPES - Coupons, Flash Sales, Loyalty
// ═══════════════════════════════════════════════════════════════════════════

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  agentId: string;
  
  code: string;
  description?: string;
  
  type: CouponType;
  value: number;              // % หรือ จำนวนเงิน
  maxDiscount?: number;       // ส่วนลดสูงสุด (สำหรับ percentage)
  minPurchase?: number;       // ยอดซื้อขั้นต่ำ
  
  usageLimit?: number;        // จำนวนครั้งที่ใช้ได้
  usageCount: number;         // ใช้ไปแล้วกี่ครั้ง
  
  validFrom: string;
  validUntil: string;
  
  isActive: boolean;
  createdAt: string;
}

export interface FlashSale {
  id: string;
  agentId: string;
  
  serviceId: number;
  serviceName: string;
  
  originalPrice: number;
  salePrice: number;
  
  quantity: number;           // จำนวนจำกัด
  soldCount: number;
  
  startAt: string;
  endAt: string;
  
  isActive: boolean;
  createdAt: string;
}

export interface LoyaltyTier {
  id: string;
  agentId: string;
  
  name: string;               // VIP Silver, Gold, Platinum
  minOrders?: number;         // จำนวนออเดอร์ขั้นต่ำ
  minSpent?: number;          // ยอดซื้อขั้นต่ำ
  discountPercent: number;
  
  color: string;
  icon: string;
  
  isActive: boolean;
}

export interface CreateCouponInput {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
}

export interface CreateFlashSaleInput {
  serviceId: number;
  serviceName: string;
  originalPrice: number;
  salePrice: number;
  quantity: number;
  startAt: string;
  endAt: string;
}

export interface ValidateCouponResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message?: string;
}

