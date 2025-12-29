// ==============================================
// TEMPLATE TYPES
// Bill Templates & Quick Reply Templates
// ==============================================

/**
 * Bill Template - เทมเพลตบิลที่ใช้บ่อย (Boost, Boost+)
 */
export interface BillTemplate {
  id: string;
  agentId: string;
  
  // Basic
  name: string;
  description?: string;
  
  // Service Info
  serviceId: number;
  serviceName: string;
  category: string;
  
  // Preset Values
  quantity: number;
  salePrice: number;
  
  // Stats
  usageCount: number;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quick Reply Category
 */
export type QuickReplyCategory = 
  | 'greeting'       // ทักทาย
  | 'payment'        // แจ้งข้อมูลโอนเงิน
  | 'confirmation'   // ยืนยันรับออเดอร์
  | 'progress'       // แจ้งความคืบหน้า
  | 'completion'     // แจ้งงานเสร็จ
  | 'issue'          // แจ้งปัญหา
  | 'other';         // อื่นๆ

/**
 * Quick Reply Template - ข้อความตอบสำเร็จรูป (Boost, Boost+)
 */
export interface QuickReplyTemplate {
  id: string;
  agentId: string;
  
  // Basic
  name: string;
  category: QuickReplyCategory;
  
  // Message
  message: string;
  
  // Variables available in message
  // {customer_name}, {amount}, {service}, {bill_id}, {link}
  variables: string[];
  
  // Shortcut (quick access)
  shortcut?: string;          // e.g., "/thank", "/payment"
  
  // Stats
  usageCount: number;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Quick Reply Variable
 */
export interface QuickReplyVariable {
  name: string;
  placeholder: string;
  description: string;
}

/**
 * Template Summary
 */
export interface TemplateSummary {
  billTemplates: number;
  billTemplateUsage: number;
  quickReplies: number;
  quickReplyUsage: number;
}

/**
 * Create Bill Template Input
 */
export interface CreateBillTemplateInput {
  name: string;
  description?: string;
  serviceId: number;
  serviceName: string;
  category: string;
  quantity: number;
  salePrice: number;
}

/**
 * Update Bill Template Input
 */
export interface UpdateBillTemplateInput {
  name?: string;
  description?: string;
  quantity?: number;
  salePrice?: number;
  isActive?: boolean;
}

/**
 * Create Quick Reply Input
 */
export interface CreateQuickReplyInput {
  name: string;
  category: QuickReplyCategory;
  message: string;
  shortcut?: string;
}

/**
 * Update Quick Reply Input
 */
export interface UpdateQuickReplyInput {
  name?: string;
  category?: QuickReplyCategory;
  message?: string;
  shortcut?: string;
  isActive?: boolean;
}

// ==============================================
// CONSTANTS
// ==============================================

/**
 * Available Quick Reply Variables
 */
export const QUICK_REPLY_VARIABLES: QuickReplyVariable[] = [
  { name: 'customer_name', placeholder: '{customer_name}', description: 'ชื่อลูกค้า' },
  { name: 'amount', placeholder: '{amount}', description: 'ยอดเงิน' },
  { name: 'service', placeholder: '{service}', description: 'ชื่อบริการ' },
  { name: 'bill_id', placeholder: '{bill_id}', description: 'หมายเลขบิล' },
  { name: 'link', placeholder: '{link}', description: 'ลิงก์ (URL)' },
  { name: 'quantity', placeholder: '{quantity}', description: 'จำนวน' },
];

/**
 * Default Quick Reply Templates
 */
export const DEFAULT_QUICK_REPLIES: Omit<QuickReplyTemplate, 'id' | 'agentId' | 'usageCount' | 'isActive' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'ทักทาย',
    category: 'greeting',
    message: 'สวัสดีค่ะ สนใจบริการอะไรคะ?',
    variables: [],
    shortcut: '/hi',
  },
  {
    name: 'ยืนยันรับออเดอร์',
    category: 'confirmation',
    message: 'ขอบคุณค่ะ ได้รับออเดอร์แล้วนะคะ\nบิล: {bill_id}\nรอดำเนินการสักครู่ค่ะ',
    variables: ['bill_id'],
    shortcut: '/confirm',
  },
  {
    name: 'แจ้งข้อมูลโอนเงิน',
    category: 'payment',
    message: 'ช่องทางชำระเงิน:\nยอดชำระ: {amount} บาท\n\nโอนแล้วแจ้งสลิปมาได้เลยนะคะ',
    variables: ['amount'],
    shortcut: '/pay',
  },
  {
    name: 'งานเสร็จแล้ว',
    category: 'completion',
    message: 'งานเสร็จเรียบร้อยแล้วค่ะ ตรวจสอบได้เลยนะคะ\nขอบคุณที่ใช้บริการค่ะ',
    variables: [],
    shortcut: '/done',
  },
];

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Template ID
 */
export function generateBillTemplateId(): string {
  return `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Generate Quick Reply ID
 */
export function generateQuickReplyId(): string {
  return `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Get Quick Reply Category Label
 */
export function getQuickReplyCategoryLabel(category: QuickReplyCategory): string {
  const labels: Record<QuickReplyCategory, string> = {
    greeting: 'ทักทาย',
    payment: 'การชำระเงิน',
    confirmation: 'ยืนยันออเดอร์',
    progress: 'ความคืบหน้า',
    completion: 'งานเสร็จ',
    issue: 'แจ้งปัญหา',
    other: 'อื่นๆ',
  };
  return labels[category];
}

/**
 * Get Quick Reply Category Color
 */
export function getQuickReplyCategoryColor(category: QuickReplyCategory): string {
  const colors: Record<QuickReplyCategory, string> = {
    greeting: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30',
    payment: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30',
    confirmation: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/30',
    progress: 'text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900/30',
    completion: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30',
    issue: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30',
    other: 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700',
  };
  return colors[category];
}

/**
 * Parse message variables
 */
export function parseMessageVariables(message: string): string[] {
  const regex = /\{(\w+)\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(message)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

/**
 * Replace variables in message
 */
export function replaceMessageVariables(
  message: string,
  values: Record<string, string>
): string {
  let result = message;
  
  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  
  return result;
}

/**
 * Validate shortcut format
 */
export function validateShortcut(shortcut: string): { valid: boolean; error?: string } {
  if (!shortcut) return { valid: true }; // Optional
  
  if (!shortcut.startsWith('/')) {
    return { valid: false, error: 'Shortcut ต้องเริ่มด้วย /' };
  }
  
  if (shortcut.length < 2 || shortcut.length > 15) {
    return { valid: false, error: 'Shortcut ต้องมี 1-14 ตัวอักษรหลัง /' };
  }
  
  if (!/^\/[a-z0-9_]+$/.test(shortcut)) {
    return { valid: false, error: 'Shortcut ใช้ได้เฉพาะ a-z, 0-9 และ _' };
  }
  
  return { valid: true };
}

/**
 * Find quick reply by shortcut
 */
export function findQuickReplyByShortcut(
  templates: QuickReplyTemplate[],
  shortcut: string
): QuickReplyTemplate | undefined {
  return templates.find(t => t.isActive && t.shortcut === shortcut);
}

