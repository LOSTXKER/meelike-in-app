// ==============================================
// NOTIFICATIONS STORAGE
// LocalStorage utilities for Agent Notifications
// ==============================================

import { getItem, setItem, removeItem } from './base';
import type {
  Notification,
  NotificationSettings,
  NotificationType,
  NotificationSummary,
  NotificationFilter,
  CreateNotificationInput,
  UpdateNotificationSettingsInput,
} from '@/app/types/notification';
import {
  generateNotificationId,
  DEFAULT_NOTIFICATION_SETTINGS,
  getChannelsForNotificationType,
} from '@/app/types/notification';

const NOTIFICATIONS_KEY = 'meelike_agent_notifications';
const SETTINGS_KEY = 'meelike_agent_notification_settings';

// ==============================================
// Notifications CRUD
// ==============================================

/**
 * Get all notifications for an agent
 */
export function getNotifications(agentId: string): Notification[] {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  return allNotifications[agentId] || [];
}

/**
 * Get notification by ID
 */
export function getNotificationById(agentId: string, notificationId: string): Notification | null {
  const notifications = getNotifications(agentId);
  return notifications.find(n => n.id === notificationId) || null;
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(agentId: string): Notification[] {
  return getNotifications(agentId).filter(n => !n.isRead);
}

/**
 * Get unread count
 */
export function getUnreadCount(agentId: string): number {
  return getUnreadNotifications(agentId).length;
}

/**
 * Create notification
 */
export function createNotification(agentId: string, input: CreateNotificationInput): Notification {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  
  if (!allNotifications[agentId]) {
    allNotifications[agentId] = [];
  }
  
  const settings = getNotificationSettings(agentId);
  const channels = getChannelsForNotificationType(settings, input.type);
  
  const notification: Notification = {
    id: generateNotificationId(),
    agentId,
    type: input.type,
    priority: input.priority || 'normal',
    title: input.title,
    message: input.message,
    billId: input.billId,
    reviewId: input.reviewId,
    clientId: input.clientId,
    actionUrl: input.actionUrl,
    isRead: false,
    channelsSent: channels,
    createdAt: new Date().toISOString(),
  };
  
  // Add to beginning (newest first)
  allNotifications[agentId].unshift(notification);
  
  // Keep only last 100 notifications
  if (allNotifications[agentId].length > 100) {
    allNotifications[agentId] = allNotifications[agentId].slice(0, 100);
  }
  
  setItem(NOTIFICATIONS_KEY, allNotifications);
  
  return notification;
}

/**
 * Mark notification as read
 */
export function markNotificationAsRead(agentId: string, notificationId: string): Notification | null {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  const notifications = allNotifications[agentId] || [];
  
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index === -1) return null;
  
  notifications[index].isRead = true;
  notifications[index].readAt = new Date().toISOString();
  
  allNotifications[agentId] = notifications;
  setItem(NOTIFICATIONS_KEY, allNotifications);
  
  return notifications[index];
}

/**
 * Mark all notifications as read
 */
export function markAllNotificationsAsRead(agentId: string): number {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  const notifications = allNotifications[agentId] || [];
  
  let count = 0;
  const now = new Date().toISOString();
  
  notifications.forEach(notification => {
    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = now;
      count++;
    }
  });
  
  allNotifications[agentId] = notifications;
  setItem(NOTIFICATIONS_KEY, allNotifications);
  
  return count;
}

/**
 * Delete notification
 */
export function deleteNotification(agentId: string, notificationId: string): boolean {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  const notifications = allNotifications[agentId] || [];
  
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index === -1) return false;
  
  notifications.splice(index, 1);
  allNotifications[agentId] = notifications;
  setItem(NOTIFICATIONS_KEY, allNotifications);
  
  return true;
}

/**
 * Delete all read notifications
 */
export function deleteReadNotifications(agentId: string): number {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  const notifications = allNotifications[agentId] || [];
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const deletedCount = notifications.length - unreadNotifications.length;
  
  allNotifications[agentId] = unreadNotifications;
  setItem(NOTIFICATIONS_KEY, allNotifications);
  
  return deletedCount;
}

// ==============================================
// Queries
// ==============================================

/**
 * Filter notifications
 */
export function queryNotifications(
  agentId: string,
  filter?: NotificationFilter
): Notification[] {
  let notifications = getNotifications(agentId);
  
  if (filter) {
    if (filter.type) {
      notifications = notifications.filter(n => n.type === filter.type);
    }
    
    if (filter.isRead !== undefined) {
      notifications = notifications.filter(n => n.isRead === filter.isRead);
    }
    
    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      notifications = notifications.filter(n => new Date(n.createdAt) >= fromDate);
    }
    
    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      toDate.setHours(23, 59, 59, 999);
      notifications = notifications.filter(n => new Date(n.createdAt) <= toDate);
    }
  }
  
  // Already sorted by newest first from storage
  return notifications;
}

/**
 * Get notifications by type
 */
export function getNotificationsByType(
  agentId: string,
  type: NotificationType
): Notification[] {
  return queryNotifications(agentId, { type });
}

/**
 * Get recent notifications
 */
export function getRecentNotifications(agentId: string, limit: number = 10): Notification[] {
  return getNotifications(agentId).slice(0, limit);
}

/**
 * Get today's notifications
 */
export function getTodayNotifications(agentId: string): Notification[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return queryNotifications(agentId, { dateFrom: today.toISOString() });
}

// ==============================================
// Notification Settings
// ==============================================

/**
 * Get notification settings
 */
export function getNotificationSettings(agentId: string): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  
  if (!allSettings[agentId]) {
    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      agentId,
      updatedAt: new Date().toISOString(),
    };
  }
  
  return allSettings[agentId];
}

/**
 * Update notification settings
 */
export function updateNotificationSettings(
  agentId: string,
  input: UpdateNotificationSettingsInput
): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  const current = getNotificationSettings(agentId);
  
  const updated: NotificationSettings = {
    ...current,
    channels: input.channels ? { ...current.channels, ...input.channels } : current.channels,
    typeSettings: input.typeSettings ? { ...current.typeSettings, ...input.typeSettings } : current.typeSettings,
    quietHours: input.quietHours ? { ...current.quietHours, ...input.quietHours } : current.quietHours,
    updatedAt: new Date().toISOString(),
  };
  
  allSettings[agentId] = updated;
  setItem(SETTINGS_KEY, allSettings);
  
  return updated;
}

/**
 * Connect LINE notification
 */
export function connectLineNotification(
  agentId: string,
  lineUserId: string,
  lineNotifyToken?: string
): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  const current = getNotificationSettings(agentId);
  
  const updated: NotificationSettings = {
    ...current,
    channels: { ...current.channels, line: true },
    line: {
      connected: true,
      lineUserId,
      lineNotifyToken,
      connectedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
  
  allSettings[agentId] = updated;
  setItem(SETTINGS_KEY, allSettings);
  
  return updated;
}

/**
 * Disconnect LINE notification
 */
export function disconnectLineNotification(agentId: string): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  const current = getNotificationSettings(agentId);
  
  const updated: NotificationSettings = {
    ...current,
    channels: { ...current.channels, line: false },
    line: {
      connected: false,
    },
    updatedAt: new Date().toISOString(),
  };
  
  allSettings[agentId] = updated;
  setItem(SETTINGS_KEY, allSettings);
  
  return updated;
}

/**
 * Set email for notifications
 */
export function setNotificationEmail(
  agentId: string,
  email: string,
  verified: boolean = false
): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  const current = getNotificationSettings(agentId);
  
  const updated: NotificationSettings = {
    ...current,
    email: {
      address: email,
      verified,
      verifiedAt: verified ? new Date().toISOString() : undefined,
    },
    updatedAt: new Date().toISOString(),
  };
  
  allSettings[agentId] = updated;
  setItem(SETTINGS_KEY, allSettings);
  
  return updated;
}

/**
 * Verify notification email
 */
export function verifyNotificationEmail(agentId: string): NotificationSettings {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  const current = getNotificationSettings(agentId);
  
  const updated: NotificationSettings = {
    ...current,
    channels: { ...current.channels, email: true },
    email: {
      ...current.email,
      verified: true,
      verifiedAt: new Date().toISOString(),
    },
    updatedAt: new Date().toISOString(),
  };
  
  allSettings[agentId] = updated;
  setItem(SETTINGS_KEY, allSettings);
  
  return updated;
}

// ==============================================
// Statistics
// ==============================================

/**
 * Get notification summary
 */
export function getNotificationSummary(agentId: string): NotificationSummary {
  const notifications = getNotifications(agentId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const byType: { [K in NotificationType]?: number } = {};
  let unreadCount = 0;
  let todayCount = 0;
  
  notifications.forEach(notification => {
    // Count by type
    byType[notification.type] = (byType[notification.type] || 0) + 1;
    
    // Unread count
    if (!notification.isRead) {
      unreadCount++;
    }
    
    // Today count
    if (new Date(notification.createdAt) >= today) {
      todayCount++;
    }
  });
  
  return {
    unreadCount,
    todayCount,
    byType,
  };
}

// ==============================================
// Utilities
// ==============================================

/**
 * Clear all notifications for agent
 */
export function clearNotifications(agentId: string): void {
  const allNotifications = getItem<Record<string, Notification[]>>(NOTIFICATIONS_KEY, {});
  delete allNotifications[agentId];
  setItem(NOTIFICATIONS_KEY, allNotifications);
}

/**
 * Clear notification settings for agent
 */
export function clearNotificationSettings(agentId: string): void {
  const allSettings = getItem<Record<string, NotificationSettings>>(SETTINGS_KEY, {});
  delete allSettings[agentId];
  setItem(SETTINGS_KEY, allSettings);
}

/**
 * Clear all agent data
 */
export function clearAllNotificationData(agentId: string): void {
  clearNotifications(agentId);
  clearNotificationSettings(agentId);
}

/**
 * Clear all notifications (admin)
 */
export function clearAllNotifications(): void {
  removeItem(NOTIFICATIONS_KEY);
}

/**
 * Clear all notification settings (admin)
 */
export function clearAllNotificationSettings(): void {
  removeItem(SETTINGS_KEY);
}

