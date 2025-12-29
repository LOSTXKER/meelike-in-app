// ==============================================
// NOTIFICATION TYPES
// Agent notification system (In-app, LINE, Email)
// ==============================================

/**
 * Notification Type - ประเภทการแจ้งเตือน
 */
export type NotificationType =
  | 'new_order'           // มีออเดอร์ใหม่
  | 'payment_received'    // ลูกค้าแจ้งโอนเงิน
  | 'order_completed'     // ออเดอร์สำเร็จ
  | 'order_failed'        // ออเดอร์มีปัญหา
  | 'new_review'          // ลูกค้ารีวิว
  | 'coupon_used'         // คูปองถูกใช้
  | 'low_balance'         // ยอดเงินเหลือน้อย
  | 'subscription_expiring' // subscription ใกล้หมด
  | 'system';             // ประกาศจากระบบ

/**
 * Notification Channel
 */
export type NotificationChannel = 'in_app' | 'line' | 'email';

/**
 * Notification Priority
 */
export type NotificationPriority = 'low' | 'normal' | 'high';

/**
 * Notification - การแจ้งเตือน
 */
export interface Notification {
  id: string;
  agentId: string;
  
  type: NotificationType;
  priority: NotificationPriority;
  
  title: string;
  message: string;
  
  // Related entities
  billId?: string;
  reviewId?: string;
  clientId?: string;
  
  // Action URL (click notification → go to)
  actionUrl?: string;
  
  // Status
  isRead: boolean;
  readAt?: string;
  
  // Channels sent
  channelsSent: NotificationChannel[];
  
  createdAt: string;
}

/**
 * Notification Settings - ตั้งค่าการแจ้งเตือน
 */
export interface NotificationSettings {
  agentId: string;
  
  // Enabled Channels
  channels: {
    in_app: boolean;
    line: boolean;       // Boost, Boost+
    email: boolean;      // Boost+ only
  };
  
  // Per-type channel settings
  typeSettings: {
    [K in NotificationType]: NotificationChannel[];
  };
  
  // LINE Settings (Boost, Boost+)
  line: {
    connected: boolean;
    lineUserId?: string;
    lineNotifyToken?: string;
    connectedAt?: string;
  };
  
  // Email Settings (Boost+ only)
  email: {
    address?: string;
    verified: boolean;
    verifiedAt?: string;
  };
  
  // Quiet Hours (ไม่ส่ง notification ช่วงเวลานี้)
  quietHours: {
    enabled: boolean;
    startTime: string;   // "22:00"
    endTime: string;     // "08:00"
    channels: NotificationChannel[]; // ช่องทางที่ปิดช่วง quiet hours
  };
  
  updatedAt: string;
}

/**
 * Notification Summary
 */
export interface NotificationSummary {
  unreadCount: number;
  todayCount: number;
  
  byType: {
    [K in NotificationType]?: number;
  };
}

/**
 * Notification Filter Options
 */
export interface NotificationFilter {
  type?: NotificationType;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Create Notification Input
 */
export interface CreateNotificationInput {
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  billId?: string;
  reviewId?: string;
  clientId?: string;
  actionUrl?: string;
}

/**
 * Update Notification Settings Input
 */
export interface UpdateNotificationSettingsInput {
  channels?: Partial<NotificationSettings['channels']>;
  typeSettings?: Partial<NotificationSettings['typeSettings']>;
  quietHours?: Partial<NotificationSettings['quietHours']>;
}

// ==============================================
// CONSTANTS
// ==============================================

/**
 * Default Notification Settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS: Omit<NotificationSettings, 'agentId' | 'updatedAt'> = {
  channels: {
    in_app: true,
    line: false,
    email: false,
  },
  typeSettings: {
    new_order: ['in_app'],
    payment_received: ['in_app'],
    order_completed: ['in_app'],
    order_failed: ['in_app'],
    new_review: ['in_app'],
    coupon_used: ['in_app'],
    low_balance: ['in_app'],
    subscription_expiring: ['in_app'],
    system: ['in_app'],
  },
  line: {
    connected: false,
  },
  email: {
    verified: false,
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
    channels: ['line', 'email'],
  },
};

/**
 * Notification Type Display Info
 */
export const NOTIFICATION_TYPE_INFO: Record<NotificationType, {
  label: string;
  icon: string;
  color: string;
  defaultMessage: string;
}> = {
  new_order: {
    label: 'ออเดอร์ใหม่',
    icon: 'shopping-cart',
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    defaultMessage: 'คุณมีออเดอร์ใหม่',
  },
  payment_received: {
    label: 'แจ้งโอนเงิน',
    icon: 'credit-card',
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    defaultMessage: 'ลูกค้าแจ้งโอนเงินแล้ว',
  },
  order_completed: {
    label: 'ออเดอร์สำเร็จ',
    icon: 'check-circle',
    color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30',
    defaultMessage: 'ออเดอร์เสร็จสมบูรณ์',
  },
  order_failed: {
    label: 'ออเดอร์มีปัญหา',
    icon: 'alert-triangle',
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    defaultMessage: 'ออเดอร์มีปัญหา กรุณาตรวจสอบ',
  },
  new_review: {
    label: 'รีวิวใหม่',
    icon: 'star',
    color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    defaultMessage: 'ลูกค้าให้รีวิวร้านค้า',
  },
  coupon_used: {
    label: 'คูปองถูกใช้',
    icon: 'ticket',
    color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    defaultMessage: 'มีการใช้คูปองส่วนลด',
  },
  low_balance: {
    label: 'ยอดเงินเหลือน้อย',
    icon: 'wallet',
    color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
    defaultMessage: 'ยอดเงินในบัญชีเหลือน้อย',
  },
  subscription_expiring: {
    label: 'แพ็คเกจใกล้หมด',
    icon: 'clock',
    color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    defaultMessage: 'แพ็คเกจของคุณใกล้หมดอายุ',
  },
  system: {
    label: 'ประกาศระบบ',
    icon: 'info',
    color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700',
    defaultMessage: 'ประกาศจากระบบ',
  },
};

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Generate Notification ID
 */
export function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Get Notification Type Label
 */
export function getNotificationTypeLabel(type: NotificationType): string {
  return NOTIFICATION_TYPE_INFO[type].label;
}

/**
 * Get Notification Type Color
 */
export function getNotificationTypeColor(type: NotificationType): string {
  return NOTIFICATION_TYPE_INFO[type].color;
}

/**
 * Get Notification Type Icon
 */
export function getNotificationTypeIcon(type: NotificationType): string {
  return NOTIFICATION_TYPE_INFO[type].icon;
}

/**
 * Check if in quiet hours
 */
export function isInQuietHours(settings: NotificationSettings): boolean {
  if (!settings.quietHours.enabled) return false;
  
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const { startTime, endTime } = settings.quietHours;
  
  // Handle overnight quiet hours (e.g., 22:00 - 08:00)
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }
  
  return currentTime >= startTime && currentTime < endTime;
}

/**
 * Get channels to send for notification type
 */
export function getChannelsForNotificationType(
  settings: NotificationSettings,
  type: NotificationType
): NotificationChannel[] {
  const channels = settings.typeSettings[type] || [];
  const enabledChannels = channels.filter(ch => settings.channels[ch]);
  
  // Remove channels in quiet hours
  if (isInQuietHours(settings)) {
    return enabledChannels.filter(ch => !settings.quietHours.channels.includes(ch));
  }
  
  return enabledChannels;
}

/**
 * Format notification time
 */
export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'เมื่อสักครู่';
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;
  
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
  });
}

/**
 * Create notification message for new order
 */
export function createNewOrderNotification(
  billId: string,
  amount: number,
  clientName: string
): CreateNotificationInput {
  return {
    type: 'new_order',
    priority: 'high',
    title: 'มีออเดอร์ใหม่!',
    message: `${clientName} สั่งออเดอร์ ฿${amount.toLocaleString()}`,
    billId,
    actionUrl: `/agent/orders/${billId}`,
  };
}

/**
 * Create notification message for completed order
 */
export function createOrderCompletedNotification(
  billId: string,
  serviceName: string
): CreateNotificationInput {
  return {
    type: 'order_completed',
    priority: 'normal',
    title: 'ออเดอร์สำเร็จ',
    message: `ออเดอร์ ${billId} (${serviceName}) เสร็จสมบูรณ์`,
    billId,
    actionUrl: `/agent/orders/${billId}`,
  };
}

/**
 * Create notification message for new review
 */
export function createNewReviewNotification(
  reviewId: string,
  rating: number,
  comment?: string
): CreateNotificationInput {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  return {
    type: 'new_review',
    priority: 'normal',
    title: 'มีรีวิวใหม่!',
    message: `${stars} ${comment ? `"${comment.slice(0, 50)}..."` : ''}`,
    reviewId,
    actionUrl: '/agent/reviews',
  };
}

