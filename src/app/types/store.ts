// src/app/types/store.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🏪 AGENT STORE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AgentStore {
  id: string;
  agentId: string;
  
  // Store Info
  name: string;
  username: string;              // URL: [username].meelike.com
  description?: string;
  
  // Branding (Boost+ only)
  logo?: string;
  coverImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  hideMeeLikeBranding: boolean;
  
  // Contact
  contactLine?: string;
  contactFacebook?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Payment Info
  paymentInfo: {
    promptPayNumber?: string;
    promptPayName?: string;
    promptPayQRCode?: string;
    bankAccount?: string;
    bankName?: string;
    accountName?: string;
  };
  
  // Services
  services: StoreService[];
  
  // Settings
  isActive: boolean;
  autoConfirmPayment: boolean;   // อนาคต: เชื่อม Payment Gateway
  
  // Stats
  totalOrders: number;
  totalRevenue: number;
  rating?: number;
  reviewCount?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface StoreService {
  id: string;
  serviceId: number;             // Reference to main service
  serviceName: string;
  category: string;
  description?: string;
  
  // Pricing
  originalPrice: number;         // ราคา MeeLike
  salePrice: number;             // ราคาขาย (Agent ตั้ง)
  
  // Status
  isActive: boolean;
  sortOrder: number;
  
  // Stats
  viewCount: number;
  orderCount: number;
}

export interface StoreStats {
  views: number;
  orders: number;
  revenue: number;
  conversionRate: number;        // % (orders/views * 100)
  
  // Top services
  topServices: {
    serviceId: number;
    serviceName: string;
    orderCount: number;
    percentage: number;
  }[];
  
  // Traffic sources
  referrers?: {
    source: string;
    visits: number;
  }[];
}

export interface CreateStoreInput {
  name: string;
  username: string;
  description?: string;
  contactLine?: string;
  contactFacebook?: string;
  contactPhone?: string;
  contactEmail?: string;
  paymentInfo: {
    promptPayNumber?: string;
    promptPayName?: string;
    bankAccount?: string;
    bankName?: string;
    accountName?: string;
  };
}

export interface UpdateStoreServiceInput {
  serviceId: number;
  salePrice: number;
  description?: string;
  isActive: boolean;
}

