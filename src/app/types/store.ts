// ==============================================
// STORE TYPES
// Agent Store (public storefront) configuration
// ==============================================

/**
 * Store Level based on subscription
 */
export type StoreLevel = 'starter' | 'pro' | 'business';

/**
 * Store Theme
 */
export type StoreTheme = 'light' | 'dark' | 'auto';

/**
 * Store Service - บริการที่ Agent เลือกขายในร้าน
 */
export interface StoreService {
  id: string;
  serviceId: number;         // MeeLike service ID
  serviceName: string;
  category: string;
  
  // Agent's custom settings
  displayName?: string;      // ชื่อที่แสดงในร้าน (ถ้าไม่ใส่ใช้ serviceName)
  description?: string;      // รายละเอียดเพิ่มเติม
  
  // Pricing
  baseCost: number;          // ต้นทุน (จาก MeeLike)
  salePrice: number;         // ราคาขาย
  
  // Limits
  minQuantity: number;
  maxQuantity: number;
  
  // Display
  isActive: boolean;         // เปิด/ปิดบริการ
  sortOrder: number;         // ลำดับการแสดง
  
  // Stats
  totalSold: number;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Store Settings - การตั้งค่าร้าน
 */
export interface StoreSettings {
  id: string;
  agentId: string;
  username: string;          // URL: {username}.meelike.com
  
  // Basic Info
  storeName: string;
  storeDescription?: string;
  storeAnnouncement?: string;
  logoUrl?: string;
  bannerUrl?: string;
  
  // Contact
  contactLine?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Payment Info (แสดงในบิล)
  paymentInfo: PaymentMethod[];
  
  // Store Level
  level: StoreLevel;
  
  // Branding (Boost+ only)
  hideMeeLikeBranding: boolean;
  primaryColor?: string;
  accentColor?: string;
  
  // Theme
  theme: StoreTheme;
  
  // Services
  services: StoreService[];
  maxServices: number;       // Based on subscription
  
  // Stats
  totalViews: number;
  totalOrders: number;
  totalRevenue: number;
  
  // Rating
  averageRating: number;
  totalReviews: number;
  
  // Status
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Payment Method - วิธีการชำระเงิน
 */
export interface PaymentMethod {
  id: string;
  type: 'bank' | 'promptpay' | 'truewallet' | 'other';
  
  // Bank Transfer
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  
  // PromptPay / TrueWallet
  phoneNumber?: string;
  
  // QR Code
  qrCodeUrl?: string;
  
  // Custom
  customLabel?: string;
  customValue?: string;
  
  note?: string;
  isActive: boolean;
  sortOrder: number;
}

/**
 * Store Analytics - Basic
 */
export interface StoreAnalyticsBasic {
  period: 'today' | '7days' | '30days' | 'all';
  views: number;
  orders: number;
  revenue: number;
}

/**
 * Store Analytics - Pro (Boost, Boost+)
 */
export interface StoreAnalyticsPro extends StoreAnalyticsBasic {
  conversionRate: number;    // views → orders %
  avgOrderValue: number;
  
  // Time-based
  viewsByDate: { date: string; count: number }[];
  ordersByDate: { date: string; count: number; revenue: number }[];
  
  // Top Services
  topServices: { 
    serviceId: number; 
    serviceName: string; 
    orders: number; 
    revenue: number;
    percentage: number;
  }[];
  
  // Peak Hours
  peakHours: { hour: number; orders: number }[];
  
  // Referrers
  referrers: { source: string; count: number }[];
}

/**
 * Store Filter Options
 */
export interface StoreServiceFilter {
  category?: string;
  isActive?: boolean;
  search?: string;
}

/**
 * Create Store Service Input
 */
export interface CreateStoreServiceInput {
  serviceId: number;
  serviceName: string;
  category: string;
  baseCost: number;
  displayName?: string;
  description?: string;
  salePrice: number;
  minQuantity?: number;
  maxQuantity?: number;
  isActive?: boolean;
}

/**
 * Update Store Service Input
 */
export interface UpdateStoreServiceInput {
  displayName?: string;
  description?: string;
  salePrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Update Store Settings Input
 */
export interface UpdateStoreSettingsInput {
  storeName?: string;
  storeDescription?: string;
  storeAnnouncement?: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactLine?: string;
  contactPhone?: string;
  contactEmail?: string;
  paymentInfo?: PaymentMethod[];
  primaryColor?: string;
  accentColor?: string;
  theme?: StoreTheme;
  isActive?: boolean;
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Store Service ID
 */
export function generateStoreServiceId(): string {
  return `svc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate Payment Method ID
 */
export function generatePaymentMethodId(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Get Store Level Label
 */
export function getStoreLevelLabel(level: StoreLevel): string {
  const labels: Record<StoreLevel, string> = {
    starter: 'Starter',
    pro: 'Pro',
    business: 'Business',
  };
  return labels[level];
}

/**
 * Get Store Level Color
 */
export function getStoreLevelColor(level: StoreLevel): string {
  const colors: Record<StoreLevel, string> = {
    starter: 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
    pro: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30',
    business: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30',
  };
  return colors[level];
}

/**
 * Get Max Services for Store Level
 */
export function getMaxServicesForLevel(level: StoreLevel): number {
  const limits: Record<StoreLevel, number> = {
    starter: 5,
    pro: 20,
    business: Infinity,
  };
  return limits[level];
}

/**
 * Get Payment Type Label
 */
export function getPaymentTypeLabel(type: PaymentMethod['type']): string {
  const labels: Record<PaymentMethod['type'], string> = {
    bank: 'โอนผ่านธนาคาร',
    promptpay: 'พร้อมเพย์',
    truewallet: 'TrueMoney Wallet',
    other: 'อื่นๆ',
  };
  return labels[type];
}

/**
 * Get Store URL
 */
export function getStoreUrl(username: string): string {
  // In production, this would be subdomain
  // For dev, we use path-based
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return `/store/${username}`;
  }
  return `https://${username}.meelike.com`;
}

/**
 * Validate username for store URL
 */
export function validateStoreUsername(username: string): { valid: boolean; error?: string } {
  if (!username) {
    return { valid: false, error: 'กรุณาระบุ username' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'username ต้องมีอย่างน้อย 3 ตัวอักษร' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'username ต้องไม่เกิน 20 ตัวอักษร' };
  }
  
  if (!/^[a-z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'username ใช้ได้เฉพาะ a-z, 0-9, _ และ -' };
  }
  
  // Reserved usernames
  const reserved = ['admin', 'api', 'www', 'app', 'store', 'agent', 'help', 'support'];
  if (reserved.includes(username)) {
    return { valid: false, error: 'username นี้ถูกสงวนไว้' };
  }
  
  return { valid: true };
}

/**
 * Calculate service profit margin
 */
export function calculateServiceProfitMargin(baseCost: number, salePrice: number): number {
  if (salePrice <= 0) return 0;
  return Math.round(((salePrice - baseCost) / salePrice) * 10000) / 100;
}

