// src/app/types/notification.ts
// ═══════════════════════════════════════════════════════════════════════════
// 🔔 NOTIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType = 
  | 'new_order'
  | 'payment_confirmed'
  | 'order_completed'
  | 'order_failed'
  | 'new_review';

export type NotificationChannel = 'in_app' | 'line' | 'email';

export interface Notification {
  id: string;
  agentId: string;
  
  type: NotificationType;
  title: string;
  message: string;
  
  billId?: string;
  reviewId?: string;
  
  isRead: boolean;
  
  createdAt: string;
}

export interface NotificationSettings {
  agentId: string;
  
  channels: {
    in_app: boolean;
    line: boolean;
    email: boolean;
  };
  
  types: {
    new_order: NotificationChannel[];
    payment_confirmed: NotificationChannel[];
    order_completed: NotificationChannel[];
    order_failed: NotificationChannel[];
    new_review: NotificationChannel[];
  };
  
  // LINE Settings (Boost, Boost+)
  lineUserId?: string;
  lineNotifyToken?: string;
  
  // Email Settings (Boost+)
  emailAddress?: string;
}

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  billId?: string;
  reviewId?: string;
}

