// ==============================================
// BILL TYPES
// Agent bill/order management for customer orders
// ==============================================

/**
 * Bill Status Flow:
 * pending → confirmed → processing → completed
 *              ↓            ↓
 *           cancelled    cancelled
 */
export type BillStatus =
  | 'pending'      // รอชำระเงิน (ลูกค้ายังไม่โอนเงิน)
  | 'confirmed'    // รอดำเนินการ (Agent ยืนยันรับเงินแล้ว)
  | 'processing'   // กำลังดำเนินการ (MeeLike กำลังทำงาน)
  | 'completed'    // สำเร็จ
  | 'cancelled';   // ยกเลิก

/**
 * Bill Source - ที่มาของบิล
 */
export type BillSource = 
  | 'store'   // ลูกค้าสั่งเองผ่าน Agent Store
  | 'manual'; // Agent สร้างบิลให้ลูกค้า

/**
 * Bill Item - รายการสินค้าในบิล
 */
export interface BillItem {
  id: string;
  serviceId: number;
  serviceName: string;
  category: string;
  link: string;
  quantity: number;
  
  // Pricing
  unitCost: number;        // ต้นทุนต่อหน่วย (จาก MeeLike)
  baseCost: number;        // ต้นทุนรวม (unitCost * quantity)
  agentDiscount: number;   // ส่วนลดจาก subscription
  actualCost: number;      // ต้นทุนจริงหลังหักส่วนลด
  salePrice: number;       // ราคาขายลูกค้า
  profit: number;          // กำไร (salePrice - actualCost)
  profitMargin: number;    // % กำไร
  
  // Progress (เมื่อ status = processing)
  startCount?: number;
  currentCount?: number;
  progress?: number;       // 0-100
  
  // MeeLike Order Reference
  meelikeOrderId?: string;
}

/**
 * Bill - บิลสำหรับลูกค้าของ Agent
 */
export interface Bill {
  id: string;              // Unique ID
  billNumber: string;      // BILL-XXXXX (หมายเลขบิลแสดงผล)
  
  // Agent Info
  agentId: string;
  agentUsername: string;
  
  // Client Info
  clientId?: string;       // ถ้ามีในระบบ
  clientName: string;
  clientContact: string;   // เบอร์โทร/LINE ID
  
  // Bill Items
  items: BillItem[];
  
  // Totals
  subtotal: number;        // รวมราคาขาย
  totalCost: number;       // รวมต้นทุน
  totalProfit: number;     // รวมกำไร
  
  // Promotion
  couponCode?: string;
  couponDiscount?: number;
  
  // Final Amount
  totalAmount: number;     // ยอดที่ลูกค้าต้องจ่าย (subtotal - couponDiscount)
  
  // Status
  status: BillStatus;
  
  // Source
  source: BillSource;
  
  // Timestamps
  createdAt: string;
  confirmedAt?: string;    // Agent ยืนยันรับเงิน
  startedAt?: string;      // เริ่มทำงาน
  completedAt?: string;    // เสร็จสมบูรณ์
  cancelledAt?: string;    // ยกเลิก
  
  // Notes
  agentNote?: string;      // Agent เพิ่มหมายเหตุ
  customerNote?: string;   // ลูกค้าเพิ่มหมายเหตุตอนสั่ง
  cancellationReason?: string;
  
  // Review
  hasReview?: boolean;
  reviewId?: string;
  
  // Payment Info (สำหรับลูกค้าดู)
  paymentInfo?: PaymentInfo;
}

/**
 * Payment Info - ข้อมูลการชำระเงิน (แสดงในบิล)
 */
export interface PaymentInfo {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  promptpayId?: string;
  qrCodeUrl?: string;
  note?: string;
}

/**
 * Bill Summary - สรุปสถานะบิลสำหรับ Dashboard
 */
export interface BillSummary {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  completed: number;
  cancelled: number;
  
  totalRevenue: number;    // ยอดขายรวม (completed)
  totalProfit: number;     // กำไรรวม (completed)
  totalCost: number;       // ต้นทุนรวม (completed)
}

/**
 * Bill Filter Options
 */
export interface BillFilter {
  status?: BillStatus | 'all';
  source?: BillSource | 'all';
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Bill Sort Options
 */
export type BillSortField = 'createdAt' | 'totalAmount' | 'status' | 'clientName';
export type BillSortOrder = 'asc' | 'desc';

export interface BillSort {
  field: BillSortField;
  order: BillSortOrder;
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Bill ID
 */
export function generateBillId(): string {
  return `bill_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate Bill Number (human-readable)
 */
export function generateBillNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}-${randomNum}`;
}

/**
 * Get Bill Status Label (Thai)
 */
export function getBillStatusLabel(status: BillStatus): string {
  const labels: Record<BillStatus, string> = {
    pending: 'รอชำระเงิน',
    confirmed: 'รอดำเนินการ',
    processing: 'กำลังดำเนินการ',
    completed: 'สำเร็จ',
    cancelled: 'ยกเลิก',
  };
  return labels[status];
}

/**
 * Get Bill Status Color Class
 */
export function getBillStatusColor(status: BillStatus): string {
  const colors: Record<BillStatus, string> = {
    pending: 'text-warning-emphasis bg-warning-subtle',
    confirmed: 'text-info-emphasis bg-info-subtle',
    processing: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30',
    completed: 'text-success-emphasis bg-success-subtle',
    cancelled: 'text-error-emphasis bg-error-subtle',
  };
  return colors[status];
}

/**
 * Get Bill Status Icon
 */
export function getBillStatusIcon(status: BillStatus): string {
  const icons: Record<BillStatus, string> = {
    pending: 'clock',
    confirmed: 'check-circle',
    processing: 'refresh',
    completed: 'check-double',
    cancelled: 'x-circle',
  };
  return icons[status];
}

/**
 * Calculate Bill Item Profit
 */
export function calculateBillItemProfit(
  quantity: number,
  unitCost: number,
  agentDiscountPercent: number,
  salePrice: number
): { baseCost: number; agentDiscount: number; actualCost: number; profit: number; profitMargin: number } {
  const baseCost = unitCost * quantity;
  const agentDiscount = baseCost * (agentDiscountPercent / 100);
  const actualCost = baseCost - agentDiscount;
  const profit = salePrice - actualCost;
  const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  
  return {
    baseCost: Math.round(baseCost * 100) / 100,
    agentDiscount: Math.round(agentDiscount * 100) / 100,
    actualCost: Math.round(actualCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
  };
}

/**
 * Check if Bill can be confirmed
 */
export function canConfirmBill(bill: Bill): boolean {
  return bill.status === 'pending';
}

/**
 * Check if Bill can be cancelled
 */
export function canCancelBill(bill: Bill): boolean {
  return ['pending', 'confirmed'].includes(bill.status);
}

