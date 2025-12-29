// ==============================================
// CLIENT TYPES
// Agent's customer management
// ==============================================

/**
 * Client Segment - กลุ่มลูกค้าอัตโนมัติ
 */
export type ClientSegment =
  | 'vip'        // ยอดซื้อสูง
  | 'regular'    // ซื้อประจำ
  | 'new'        // ลูกค้าใหม่
  | 'inactive';  // ไม่ซื้อนานแล้ว

/**
 * Loyalty Tier - ระดับลูกค้าสำหรับส่วนลด (Boost+)
 */
export type LoyaltyTier = 
  | 'none'
  | 'silver'     // ซื้อ 5+ ครั้ง
  | 'gold'       // ซื้อ 10+ ครั้ง
  | 'platinum';  // ซื้อ 20+ ครั้ง

/**
 * Client - ลูกค้าของ Agent
 */
export interface Client {
  id: string;
  agentId: string;
  
  // Basic Info
  name: string;
  contact: string;          // เบอร์โทร/LINE ID
  email?: string;
  note?: string;
  
  // Tags (Free: 3, Boost: 10, Boost+: unlimited)
  tags: string[];
  
  // Stats
  totalOrders: number;      // จำนวนออเดอร์ทั้งหมด
  totalSpent: number;       // ยอดซื้อรวม
  lastOrderDate?: string;   // วันที่ซื้อล่าสุด
  
  // Auto-calculated
  segment: ClientSegment;
  loyaltyTier: LoyaltyTier;
  loyaltyDiscount: number;  // % ส่วนลดจาก loyalty tier
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Client Summary - สรุปข้อมูลลูกค้าสำหรับ Dashboard
 */
export interface ClientSummary {
  total: number;
  vip: number;
  regular: number;
  new: number;
  inactive: number;
  
  totalRevenue: number;
  avgOrderValue: number;
}

/**
 * Client Filter Options
 */
export interface ClientFilter {
  segment?: ClientSegment | 'all';
  loyaltyTier?: LoyaltyTier | 'all';
  tag?: string;
  search?: string;
  hasOrders?: boolean;
}

/**
 * Client Sort Options
 */
export type ClientSortField = 'name' | 'totalOrders' | 'totalSpent' | 'lastOrderDate' | 'createdAt';
export type ClientSortOrder = 'asc' | 'desc';

export interface ClientSort {
  field: ClientSortField;
  order: ClientSortOrder;
}

/**
 * Create Client Input
 */
export interface CreateClientInput {
  name: string;
  contact: string;
  email?: string;
  note?: string;
  tags?: string[];
}

/**
 * Update Client Input
 */
export interface UpdateClientInput {
  name?: string;
  contact?: string;
  email?: string;
  note?: string;
  tags?: string[];
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Client ID
 */
export function generateClientId(): string {
  return `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get Segment Label (Thai)
 */
export function getSegmentLabel(segment: ClientSegment): string {
  const labels: Record<ClientSegment, string> = {
    vip: 'VIP',
    regular: 'ประจำ',
    new: 'ใหม่',
    inactive: 'ไม่แอคทีฟ',
  };
  return labels[segment];
}

/**
 * Get Segment Color Class
 */
export function getSegmentColor(segment: ClientSegment): string {
  const colors: Record<ClientSegment, string> = {
    vip: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30',
    regular: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30',
    new: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30',
    inactive: 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/30',
  };
  return colors[segment];
}

/**
 * Get Segment Icon
 */
export function getSegmentIcon(segment: ClientSegment): string {
  const icons: Record<ClientSegment, string> = {
    vip: 'crown',
    regular: 'star',
    new: 'sparkles',
    inactive: 'clock',
  };
  return icons[segment];
}

/**
 * Get Loyalty Tier Label (Thai)
 */
export function getLoyaltyTierLabel(tier: LoyaltyTier): string {
  const labels: Record<LoyaltyTier, string> = {
    none: '-',
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
  };
  return labels[tier];
}

/**
 * Get Loyalty Tier Color Class
 */
export function getLoyaltyTierColor(tier: LoyaltyTier): string {
  const colors: Record<LoyaltyTier, string> = {
    none: '',
    silver: 'text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-700',
    gold: 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/30',
    platinum: 'text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900/30',
  };
  return colors[tier];
}

/**
 * Get Loyalty Tier Discount
 */
export function getLoyaltyTierDiscount(tier: LoyaltyTier): number {
  const discounts: Record<LoyaltyTier, number> = {
    none: 0,
    silver: 5,
    gold: 10,
    platinum: 15,
  };
  return discounts[tier];
}

/**
 * Calculate Client Segment based on stats
 */
export function calculateSegment(
  totalOrders: number,
  totalSpent: number,
  lastOrderDate?: string,
  vipThreshold: number = 5000,
  regularOrdersThreshold: number = 3,
  inactiveDays: number = 30
): ClientSegment {
  // Check if VIP (high spending)
  if (totalSpent >= vipThreshold) {
    return 'vip';
  }
  
  // Check if inactive
  if (lastOrderDate) {
    const daysSinceLastOrder = Math.floor(
      (Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastOrder >= inactiveDays) {
      return 'inactive';
    }
  }
  
  // Check if regular
  if (totalOrders >= regularOrdersThreshold) {
    return 'regular';
  }
  
  // Default: new
  return 'new';
}

/**
 * Calculate Loyalty Tier based on order count
 */
export function calculateLoyaltyTier(totalOrders: number): LoyaltyTier {
  if (totalOrders >= 20) return 'platinum';
  if (totalOrders >= 10) return 'gold';
  if (totalOrders >= 5) return 'silver';
  return 'none';
}

/**
 * Orders needed for next tier
 */
export function getOrdersForNextTier(currentTier: LoyaltyTier, totalOrders: number): number | null {
  switch (currentTier) {
    case 'none':
      return 5 - totalOrders;
    case 'silver':
      return 10 - totalOrders;
    case 'gold':
      return 20 - totalOrders;
    case 'platinum':
      return null; // Already at max
  }
}

