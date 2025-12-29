// src/app/types/bill.ts
// ═══════════════════════════════════════════════════════════════════════════
// 📋 BILL TYPES - Agent System
// ═══════════════════════════════════════════════════════════════════════════

export type BillStatus = 
  | 'pending'      // 🟡 รอชำระเงิน
  | 'confirmed'    // 🔵 รอดำเนินการ (Agent ยืนยันแล้ว)
  | 'processing'   // 🔄 กำลังดำเนินการ
  | 'completed'    // ✅ สำเร็จ
  | 'cancelled';   // ❌ ยกเลิก

export type BillSource = 'store' | 'manual';

export interface Bill {
  id: string;                    // BILL-XXXXX
  
  // Agent Info
  agentId: string;
  agentUsername: string;
  
  // Client Info
  clientId?: string;             // ถ้าเป็นลูกค้าในระบบ
  clientName: string;
  clientContact: string;         // เบอร์โทร / LINE / Email
  
  // Service Info
  serviceId: number;
  serviceName: string;
  category: string;
  link: string;
  quantity: number;
  
  // Pricing (Agent เห็น)
  baseCost: number;              // ราคา MeeLike
  agentDiscount: number;         // ส่วนลด Tier
  actualCost: number;            // ต้นทุนจริง
  salePrice: number;             // ราคาขายให้ลูกค้า
  profit: number;                // กำไร
  profitMargin: number;          // % กำไร
  
  // Pricing (ลูกค้าเห็น)
  displayPrice: number;          // ราคาที่แสดงให้ลูกค้า
  
  // Promotion
  couponCode?: string;
  couponDiscount?: number;
  
  // Status
  status: BillStatus;
  progress?: number;             // 0-100%
  startCount?: number;
  currentCount?: number;
  
  // Source
  source: BillSource;            // 'store' หรือ 'manual'
  
  // Timestamps
  createdAt: string;
  confirmedAt?: string;          // Agent ยืนยันชำระ
  startedAt?: string;            // เริ่มทำ
  completedAt?: string;
  cancelledAt?: string;
  
  // Notes
  agentNote?: string;            // Note สำหรับ Agent
  customerNote?: string;         // Note จากลูกค้า
  
  // Review
  hasReview?: boolean;
  reviewId?: string;
}

export interface BillSummary {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  completed: number;
  cancelled: number;
  
  totalRevenue: number;
  totalProfit: number;
}

export interface CreateBillInput {
  clientId?: string;
  clientName: string;
  clientContact: string;
  
  serviceId: number;
  serviceName: string;
  category: string;
  link: string;
  quantity: number;
  
  salePrice: number;
  couponCode?: string;
  
  agentNote?: string;
  customerNote?: string;
}

export interface BillFilter {
  status?: BillStatus | 'all';
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

