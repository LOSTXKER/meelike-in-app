// src/app/types/template.ts
// ═══════════════════════════════════════════════════════════════════════════
// 📝 TEMPLATE TYPES - Bill Templates, Quick Replies
// ═══════════════════════════════════════════════════════════════════════════

export interface BillTemplate {
  id: string;
  agentId: string;
  
  name: string;
  
  serviceId: number;
  serviceName: string;
  category: string;
  
  quantity: number;
  salePrice: number;
  
  isActive: boolean;
  usageCount: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface QuickReply {
  id: string;
  agentId: string;
  
  name: string;               // ชื่อเทมเพลต
  message: string;            // ข้อความ (รองรับ variables)
  category: string;           // greeting, payment, completion, etc.
  
  variables: string[];        // ['customer_name', 'amount', 'service']
  
  isActive: boolean;
  usageCount: number;
  
  createdAt: string;
}

export interface CreateBillTemplateInput {
  name: string;
  serviceId: number;
  serviceName: string;
  category: string;
  quantity: number;
  salePrice: number;
}

export interface CreateQuickReplyInput {
  name: string;
  message: string;
  category: string;
}

