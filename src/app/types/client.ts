// src/app/types/client.ts
// ═══════════════════════════════════════════════════════════════════════════
// 👥 CLIENT TYPES - Agent System
// ═══════════════════════════════════════════════════════════════════════════

export type ClientSegment = 'vip' | 'regular' | 'new' | 'inactive';

export interface AgentClient {
  id: string;
  agentId: string;
  
  // Basic Info
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  
  // Social Media
  socialMedia?: {
    facebook?: string;
    line?: string;
    instagram?: string;
    twitter?: string;
  };
  
  // Tags & Notes
  tags: string[];
  notes?: string;
  
  // Segment (auto-calculated)
  segment: ClientSegment;
  
  // Stats
  totalSpent: number;            // ยอดซื้อรวม
  totalOrders: number;           // จำนวนบิล
  averageOrderValue: number;     // ยอดซื้อเฉลี่ย
  
  // Timestamps
  createdAt: string;
  lastOrderAt?: string;
  updatedAt: string;
}

export interface ClientStats {
  vip: number;           // ยอดซื้อ ฿5,000+
  regular: number;       // ซื้อ 3+ ครั้ง
  new: number;          // ซื้อครั้งแรก
  inactive: number;     // ไม่ซื้อ 30+ วัน
}

export interface CreateClientInput {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  socialMedia?: {
    facebook?: string;
    line?: string;
    instagram?: string;
    twitter?: string;
  };
  tags?: string[];
  notes?: string;
}

export interface ClientFilter {
  segment?: ClientSegment | 'all';
  tags?: string[];
  search?: string;
}

