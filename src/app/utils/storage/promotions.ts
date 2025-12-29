// ==============================================
// PROMOTIONS STORAGE
// LocalStorage utilities for Coupons, Flash Sales
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  Coupon,
  CouponUsage,
  FlashSale,
  LoyaltyTierSettings,
  CouponStatus,
  PromotionSummary,
  CreateCouponInput,
  CreateFlashSaleInput,
  ApplyCouponResult,
} from '@/app/types/promotion';
import {
  generateCouponId,
  generateFlashSaleId,
  calculateCouponStatus,
  calculateCouponDiscount,
  isFlashSaleActive,
} from '@/app/types/promotion';

const COUPONS_KEY = 'meelike_agent_coupons';
const COUPON_USAGE_KEY = 'meelike_agent_coupon_usage';
const FLASH_SALES_KEY = 'meelike_agent_flash_sales';
const LOYALTY_TIERS_KEY = 'meelike_agent_loyalty_tiers';

// ==============================================
// Coupons CRUD
// ==============================================

/**
 * Get all coupons for an agent
 */
export function getCoupons(agentId: string): Coupon[] {
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  return allCoupons[agentId] || [];
}

/**
 * Get coupon by ID
 */
export function getCouponById(agentId: string, couponId: string): Coupon | null {
  const coupons = getCoupons(agentId);
  return coupons.find(c => c.id === couponId) || null;
}

/**
 * Get coupon by code (public)
 */
export function getCouponByCode(agentId: string, code: string): Coupon | null {
  const coupons = getCoupons(agentId);
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase()) || null;
}

/**
 * Create a new coupon
 */
export function createCoupon(agentId: string, input: CreateCouponInput): Coupon {
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  
  if (!allCoupons[agentId]) {
    allCoupons[agentId] = [];
  }
  
  const now = new Date().toISOString();
  const coupon: Coupon = {
    id: generateCouponId(),
    agentId,
    code: input.code.toUpperCase(),
    description: input.description,
    type: input.type,
    value: input.value,
    maxDiscount: input.maxDiscount,
    minPurchase: input.minPurchase,
    usageLimit: input.usageLimit,
    usageLimitPerUser: input.usageLimitPerUser,
    usageCount: 0,
    validFrom: input.validFrom,
    validUntil: input.validUntil,
    applicableServices: input.applicableServices,
    applicableClientTiers: input.applicableClientTiers,
    isActive: true,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  
  allCoupons[agentId].push(coupon);
  setItem(COUPONS_KEY, allCoupons);
  
  return coupon;
}

/**
 * Update coupon
 */
export function updateCoupon(
  agentId: string,
  couponId: string,
  updates: Partial<Coupon>
): Coupon | null {
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  const coupons = allCoupons[agentId] || [];
  
  const index = coupons.findIndex(c => c.id === couponId);
  if (index === -1) return null;
  
  coupons[index] = {
    ...coupons[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Recalculate status
  coupons[index].status = calculateCouponStatus(coupons[index]);
  
  allCoupons[agentId] = coupons;
  setItem(COUPONS_KEY, allCoupons);
  
  return coupons[index];
}

/**
 * Delete coupon
 */
export function deleteCoupon(agentId: string, couponId: string): boolean {
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  const coupons = allCoupons[agentId] || [];
  
  const index = coupons.findIndex(c => c.id === couponId);
  if (index === -1) return false;
  
  coupons.splice(index, 1);
  allCoupons[agentId] = coupons;
  setItem(COUPONS_KEY, allCoupons);
  
  return true;
}

/**
 * Toggle coupon active status
 */
export function toggleCouponActive(agentId: string, couponId: string): Coupon | null {
  const coupon = getCouponById(agentId, couponId);
  if (!coupon) return null;
  
  return updateCoupon(agentId, couponId, { isActive: !coupon.isActive });
}

// ==============================================
// Coupon Validation & Application
// ==============================================

/**
 * Validate and apply coupon
 */
export function applyCoupon(
  agentId: string,
  code: string,
  orderTotal: number,
  clientContact?: string,
  serviceId?: number
): ApplyCouponResult {
  const coupon = getCouponByCode(agentId, code);
  
  if (!coupon) {
    return { valid: false, error: 'ไม่พบคูปองนี้' };
  }
  
  // Check if active
  const status = calculateCouponStatus(coupon);
  if (status !== 'active') {
    const statusMessages: Record<CouponStatus, string> = {
      active: '',
      expired: 'คูปองหมดอายุแล้ว',
      depleted: 'คูปองถูกใช้หมดแล้ว',
      disabled: 'คูปองถูกปิดใช้งาน',
    };
    return { valid: false, error: statusMessages[status] };
  }
  
  // Check validity period
  const now = new Date();
  if (now < new Date(coupon.validFrom)) {
    return { valid: false, error: 'คูปองยังไม่เริ่มใช้งาน' };
  }
  
  // Check minimum purchase
  if (coupon.minPurchase && orderTotal < coupon.minPurchase) {
    return { 
      valid: false, 
      error: `ยอดขั้นต่ำ ฿${coupon.minPurchase}` 
    };
  }
  
  // Check per-user limit
  if (coupon.usageLimitPerUser && clientContact) {
    const usageCount = getCouponUsageByClient(coupon.id, clientContact);
    if (usageCount >= coupon.usageLimitPerUser) {
      return { valid: false, error: 'คุณใช้คูปองนี้ครบตามจำนวนแล้ว' };
    }
  }
  
  // Check applicable services
  if (coupon.applicableServices && serviceId) {
    if (!coupon.applicableServices.includes(serviceId)) {
      return { valid: false, error: 'คูปองนี้ไม่สามารถใช้กับบริการนี้ได้' };
    }
  }
  
  // Calculate discount
  const discountAmount = calculateCouponDiscount(coupon, orderTotal);
  
  return {
    valid: true,
    coupon,
    discountAmount,
  };
}

/**
 * Record coupon usage
 */
export function recordCouponUsage(
  couponId: string,
  billId: string,
  clientId: string | undefined,
  clientContact: string,
  discountAmount: number
): void {
  // Update coupon usage count
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  
  for (const agentId of Object.keys(allCoupons)) {
    const couponIndex = allCoupons[agentId].findIndex(c => c.id === couponId);
    if (couponIndex !== -1) {
      allCoupons[agentId][couponIndex].usageCount++;
      allCoupons[agentId][couponIndex].status = calculateCouponStatus(
        allCoupons[agentId][couponIndex]
      );
      setItem(COUPONS_KEY, allCoupons);
      break;
    }
  }
  
  // Record usage
  const usages = getItem<CouponUsage[]>(COUPON_USAGE_KEY, []);
  usages.push({
    id: `usage_${Date.now()}`,
    couponId,
    billId,
    clientId,
    clientContact,
    discountAmount,
    usedAt: new Date().toISOString(),
  });
  setItem(COUPON_USAGE_KEY, usages);
}

/**
 * Get coupon usage by client
 */
export function getCouponUsageByClient(couponId: string, clientContact: string): number {
  const usages = getItem<CouponUsage[]>(COUPON_USAGE_KEY, []);
  return usages.filter(u => u.couponId === couponId && u.clientContact === clientContact).length;
}

// ==============================================
// Flash Sales CRUD
// ==============================================

/**
 * Get all flash sales for an agent
 */
export function getFlashSales(agentId: string): FlashSale[] {
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  return allFlashSales[agentId] || [];
}

/**
 * Get active flash sales
 */
export function getActiveFlashSales(agentId: string): FlashSale[] {
  return getFlashSales(agentId).filter(isFlashSaleActive);
}

/**
 * Get flash sale by ID
 */
export function getFlashSaleById(agentId: string, flashSaleId: string): FlashSale | null {
  const flashSales = getFlashSales(agentId);
  return flashSales.find(f => f.id === flashSaleId) || null;
}

/**
 * Get flash sale by service ID
 */
export function getFlashSaleByServiceId(agentId: string, serviceId: number): FlashSale | null {
  const flashSales = getActiveFlashSales(agentId);
  return flashSales.find(f => f.serviceId === serviceId) || null;
}

/**
 * Create flash sale
 */
export function createFlashSale(agentId: string, input: CreateFlashSaleInput): FlashSale {
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  
  if (!allFlashSales[agentId]) {
    allFlashSales[agentId] = [];
  }
  
  const discountPercent = Math.round(
    ((input.originalPrice - input.salePrice) / input.originalPrice) * 100
  );
  
  const flashSale: FlashSale = {
    id: generateFlashSaleId(),
    agentId,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    originalPrice: input.originalPrice,
    salePrice: input.salePrice,
    discountPercent,
    totalQuantity: input.totalQuantity,
    soldQuantity: 0,
    remainingQuantity: input.totalQuantity,
    startAt: input.startAt,
    endAt: input.endAt,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  
  allFlashSales[agentId].push(flashSale);
  setItem(FLASH_SALES_KEY, allFlashSales);
  
  return flashSale;
}

/**
 * Update flash sale sold count
 */
export function updateFlashSaleSold(
  agentId: string,
  flashSaleId: string,
  quantity: number = 1
): FlashSale | null {
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  const flashSales = allFlashSales[agentId] || [];
  
  const index = flashSales.findIndex(f => f.id === flashSaleId);
  if (index === -1) return null;
  
  flashSales[index].soldQuantity += quantity;
  flashSales[index].remainingQuantity = flashSales[index].totalQuantity - flashSales[index].soldQuantity;
  
  allFlashSales[agentId] = flashSales;
  setItem(FLASH_SALES_KEY, allFlashSales);
  
  return flashSales[index];
}

/**
 * Toggle flash sale active
 */
export function toggleFlashSaleActive(agentId: string, flashSaleId: string): FlashSale | null {
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  const flashSales = allFlashSales[agentId] || [];
  
  const index = flashSales.findIndex(f => f.id === flashSaleId);
  if (index === -1) return null;
  
  flashSales[index].isActive = !flashSales[index].isActive;
  
  allFlashSales[agentId] = flashSales;
  setItem(FLASH_SALES_KEY, allFlashSales);
  
  return flashSales[index];
}

/**
 * Delete flash sale
 */
export function deleteFlashSale(agentId: string, flashSaleId: string): boolean {
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  const flashSales = allFlashSales[agentId] || [];
  
  const index = flashSales.findIndex(f => f.id === flashSaleId);
  if (index === -1) return false;
  
  flashSales.splice(index, 1);
  allFlashSales[agentId] = flashSales;
  setItem(FLASH_SALES_KEY, allFlashSales);
  
  return true;
}

// ==============================================
// Loyalty Tiers
// ==============================================

/**
 * Get loyalty tier settings
 */
export function getLoyaltyTierSettings(agentId: string): LoyaltyTierSettings[] {
  const allTiers = getItem<Record<string, LoyaltyTierSettings[]>>(LOYALTY_TIERS_KEY, {});
  return allTiers[agentId] || getDefaultLoyaltyTiers(agentId);
}

/**
 * Get default loyalty tiers
 */
function getDefaultLoyaltyTiers(agentId: string): LoyaltyTierSettings[] {
  const now = new Date().toISOString();
  return [
    {
      id: `tier_${agentId}_silver`,
      agentId,
      name: 'VIP Silver',
      tier: 'silver',
      minOrders: 5,
      discountPercent: 5,
      color: '#9CA3AF',
      icon: 'star',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `tier_${agentId}_gold`,
      agentId,
      name: 'VIP Gold',
      tier: 'gold',
      minOrders: 10,
      discountPercent: 10,
      color: '#F59E0B',
      icon: 'star',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `tier_${agentId}_platinum`,
      agentId,
      name: 'VIP Platinum',
      tier: 'platinum',
      minOrders: 20,
      discountPercent: 15,
      color: '#06B6D4',
      icon: 'crown',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Update loyalty tier settings
 */
export function updateLoyaltyTierSettings(
  agentId: string,
  tierId: string,
  updates: Partial<LoyaltyTierSettings>
): LoyaltyTierSettings | null {
  const allTiers = getItem<Record<string, LoyaltyTierSettings[]>>(LOYALTY_TIERS_KEY, {});
  let tiers = allTiers[agentId];
  
  if (!tiers) {
    tiers = getDefaultLoyaltyTiers(agentId);
  }
  
  const index = tiers.findIndex(t => t.id === tierId);
  if (index === -1) return null;
  
  tiers[index] = {
    ...tiers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  allTiers[agentId] = tiers;
  setItem(LOYALTY_TIERS_KEY, allTiers);
  
  return tiers[index];
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get promotion summary
 */
export function getPromotionSummary(agentId: string): PromotionSummary {
  const coupons = getCoupons(agentId);
  const flashSales = getFlashSales(agentId);
  const usages = getItem<CouponUsage[]>(COUPON_USAGE_KEY, []);
  
  const agentUsages = usages.filter(u => 
    coupons.some(c => c.id === u.couponId)
  );
  
  const activeCoupons = coupons.filter(c => calculateCouponStatus(c) === 'active');
  const activeFlashSales = flashSales.filter(isFlashSaleActive);
  
  return {
    activeCoupons: activeCoupons.length,
    totalCouponUsage: agentUsages.length,
    totalCouponDiscount: agentUsages.reduce((sum, u) => sum + u.discountAmount, 0),
    
    activeFlashSales: activeFlashSales.length,
    flashSalesSold: flashSales.reduce((sum, f) => sum + f.soldQuantity, 0),
    flashSalesRevenue: flashSales.reduce((sum, f) => sum + (f.soldQuantity * f.salePrice), 0),
    
    loyaltyCustomers: {
      silver: 0, // Would need client data
      gold: 0,
      platinum: 0,
    },
  };
}

// ==============================================
// Utilities
// ==============================================

/**
 * Check if coupon code exists
 */
export function couponCodeExists(agentId: string, code: string, excludeId?: string): boolean {
  const coupons = getCoupons(agentId);
  return coupons.some(
    c => c.code.toUpperCase() === code.toUpperCase() && c.id !== excludeId
  );
}

/**
 * Get coupon count
 */
export function getCouponCount(agentId: string): number {
  return getCoupons(agentId).length;
}

/**
 * Get active coupon count
 */
export function getActiveCouponCount(agentId: string): number {
  return getCoupons(agentId).filter(c => calculateCouponStatus(c) === 'active').length;
}

/**
 * Clear all promotions for agent
 */
export function clearPromotions(agentId: string): void {
  const allCoupons = getItem<Record<string, Coupon[]>>(COUPONS_KEY, {});
  const allFlashSales = getItem<Record<string, FlashSale[]>>(FLASH_SALES_KEY, {});
  const allTiers = getItem<Record<string, LoyaltyTierSettings[]>>(LOYALTY_TIERS_KEY, {});
  
  delete allCoupons[agentId];
  delete allFlashSales[agentId];
  delete allTiers[agentId];
  
  setItem(COUPONS_KEY, allCoupons);
  setItem(FLASH_SALES_KEY, allFlashSales);
  setItem(LOYALTY_TIERS_KEY, allTiers);
}

/**
 * Clear all promotions (admin)
 */
export function clearAllPromotions(): void {
  removeItem(COUPONS_KEY);
  removeItem(COUPON_USAGE_KEY);
  removeItem(FLASH_SALES_KEY);
  removeItem(LOYALTY_TIERS_KEY);
}

