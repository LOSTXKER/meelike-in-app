// ==============================================
// PROMOTION TYPES
// Coupons, Flash Sales, Loyalty for Agent Store
// ==============================================

/**
 * Coupon Type - ประเภทคูปอง
 */
export type CouponType = 'percentage' | 'fixed';

/**
 * Coupon Status
 */
export type CouponStatus = 'active' | 'expired' | 'depleted' | 'disabled';

/**
 * Coupon - คูปองส่วนลด
 */
export interface Coupon {
  id: string;
  agentId: string;
  
  // Basic
  code: string;              // รหัสคูปอง (unique per agent)
  description?: string;
  
  // Discount
  type: CouponType;
  value: number;             // % หรือ จำนวนเงิน
  maxDiscount?: number;      // ส่วนลดสูงสุด (สำหรับ percentage)
  minPurchase?: number;      // ยอดซื้อขั้นต่ำ
  
  // Usage Limits
  usageLimit?: number;       // จำนวนครั้งที่ใช้ได้ทั้งหมด
  usageLimitPerUser?: number; // จำนวนครั้งต่อคน
  usageCount: number;        // ใช้ไปแล้ว
  
  // Validity
  validFrom: string;
  validUntil: string;
  
  // Restrictions
  applicableServices?: number[]; // Service IDs ที่ใช้ได้ (ถ้าไม่ระบุ = ทุกบริการ)
  applicableClientTiers?: string[]; // Loyalty tiers ที่ใช้ได้
  
  // Status
  isActive: boolean;
  status: CouponStatus;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Coupon Usage Record
 */
export interface CouponUsage {
  id: string;
  couponId: string;
  billId: string;
  clientId?: string;
  clientContact: string;
  discountAmount: number;
  usedAt: string;
}

/**
 * Flash Sale - โปรโมชั่นแฟลชเซลล์ (Boost+ only)
 */
export interface FlashSale {
  id: string;
  agentId: string;
  
  // Service
  serviceId: number;
  serviceName: string;
  
  // Pricing
  originalPrice: number;
  salePrice: number;
  discountPercent: number;   // % ส่วนลด
  
  // Quantity Limits
  totalQuantity: number;     // จำนวนจำกัด
  soldQuantity: number;      // ขายไปแล้ว
  remainingQuantity: number; // เหลือ
  
  // Time
  startAt: string;
  endAt: string;
  
  // Status
  isActive: boolean;
  
  createdAt: string;
}

/**
 * Loyalty Tier Settings - ตั้งค่าระดับลูกค้า (Boost+ only)
 */
export interface LoyaltyTierSettings {
  id: string;
  agentId: string;
  
  // Tier Info
  name: string;              // e.g., "VIP Silver", "Gold", "Platinum"
  tier: 'silver' | 'gold' | 'platinum';
  
  // Requirements (อย่างใดอย่างหนึ่งหรือทั้งสอง)
  minOrders?: number;        // จำนวนออเดอร์ขั้นต่ำ
  minSpent?: number;         // ยอดซื้อขั้นต่ำ
  
  // Benefits
  discountPercent: number;   // % ส่วนลดอัตโนมัติ
  
  // Display
  color: string;
  icon: string;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Promotion Summary for Dashboard
 */
export interface PromotionSummary {
  activeCoupons: number;
  totalCouponUsage: number;
  totalCouponDiscount: number;
  
  activeFlashSales: number;
  flashSalesSold: number;
  flashSalesRevenue: number;
  
  loyaltyCustomers: {
    silver: number;
    gold: number;
    platinum: number;
  };
}

/**
 * Create Coupon Input
 */
export interface CreateCouponInput {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  minPurchase?: number;
  usageLimit?: number;
  usageLimitPerUser?: number;
  validFrom: string;
  validUntil: string;
  applicableServices?: number[];
  applicableClientTiers?: string[];
}

/**
 * Create Flash Sale Input
 */
export interface CreateFlashSaleInput {
  serviceId: number;
  serviceName: string;
  originalPrice: number;
  salePrice: number;
  totalQuantity: number;
  startAt: string;
  endAt: string;
}

/**
 * Apply Coupon Result
 */
export interface ApplyCouponResult {
  valid: boolean;
  error?: string;
  coupon?: Coupon;
  discountAmount?: number;
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Coupon ID
 */
export function generateCouponId(): string {
  return `cpn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate Flash Sale ID
 */
export function generateFlashSaleId(): string {
  return `flash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Get Coupon Type Label
 */
export function getCouponTypeLabel(type: CouponType): string {
  return type === 'percentage' ? 'เปอร์เซ็นต์' : 'จำนวนเงิน';
}

/**
 * Get Coupon Status Label
 */
export function getCouponStatusLabel(status: CouponStatus): string {
  const labels: Record<CouponStatus, string> = {
    active: 'ใช้งานได้',
    expired: 'หมดอายุ',
    depleted: 'ใช้หมดแล้ว',
    disabled: 'ปิดใช้งาน',
  };
  return labels[status];
}

/**
 * Get Coupon Status Color
 */
export function getCouponStatusColor(status: CouponStatus): string {
  const colors: Record<CouponStatus, string> = {
    active: 'text-success-emphasis bg-success-subtle',
    expired: 'text-error-emphasis bg-error-subtle',
    depleted: 'text-warning-emphasis bg-warning-subtle',
    disabled: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700',
  };
  return colors[status];
}

/**
 * Calculate Coupon Status
 */
export function calculateCouponStatus(coupon: Coupon): CouponStatus {
  if (!coupon.isActive) return 'disabled';
  
  const now = new Date();
  const validUntil = new Date(coupon.validUntil);
  
  if (now > validUntil) return 'expired';
  
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return 'depleted';
  }
  
  return 'active';
}

/**
 * Calculate Coupon Discount Amount
 */
export function calculateCouponDiscount(
  coupon: Coupon,
  orderTotal: number
): number {
  if (coupon.minPurchase && orderTotal < coupon.minPurchase) {
    return 0;
  }
  
  let discount: number;
  
  if (coupon.type === 'percentage') {
    discount = orderTotal * (coupon.value / 100);
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.value;
  }
  
  // Can't discount more than order total
  return Math.min(discount, orderTotal);
}

/**
 * Format Coupon Display
 */
export function formatCouponDisplay(coupon: Coupon): string {
  if (coupon.type === 'percentage') {
    let text = `ส่วนลด ${coupon.value}%`;
    if (coupon.maxDiscount) {
      text += ` (สูงสุด ฿${coupon.maxDiscount})`;
    }
    return text;
  }
  return `ส่วนลด ฿${coupon.value}`;
}

/**
 * Check if Flash Sale is active
 */
export function isFlashSaleActive(flashSale: FlashSale): boolean {
  if (!flashSale.isActive) return false;
  
  const now = new Date();
  const start = new Date(flashSale.startAt);
  const end = new Date(flashSale.endAt);
  
  return now >= start && now <= end && flashSale.remainingQuantity > 0;
}

/**
 * Calculate Flash Sale Time Remaining
 */
export function getFlashSaleTimeRemaining(flashSale: FlashSale): {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
} {
  const now = new Date().getTime();
  const end = new Date(flashSale.endAt).getTime();
  const diff = end - now;
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

/**
 * Generate Coupon Code
 */
export function generateCouponCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

