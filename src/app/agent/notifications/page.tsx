"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteReadNotifications,
  getNotificationSummary,
} from '@/app/utils/storage/notifications';
import type { Notification, NotificationType, NotificationSummary } from '@/app/types/notification';
import {
  NOTIFICATION_TYPE_INFO,
  formatNotificationTime,
} from '@/app/types/notification';
import Link from 'next/link';

// Icons
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Icon map
const ICON_MAP: Record<string, React.ReactNode> = {
  'shopping-cart': <ShoppingCartIcon />,
  'credit-card': <CreditCardIcon />,
  'check-circle': <CheckCircleIcon />,
  'alert-triangle': <AlertIcon />,
  'star': <StarIcon />,
  'ticket': <TicketIcon />,
  'wallet': <WalletIcon />,
  'clock': <ClockIcon />,
  'info': <InfoIcon />,
};

type FilterType = 'all' | 'unread' | NotificationType;

const MOCK_AGENT_ID = 'demo_agent';

export default function AgentNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allNotifications = getNotifications(MOCK_AGENT_ID);
    setNotifications(allNotifications);
    setSummary(getNotificationSummary(MOCK_AGENT_ID));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(MOCK_AGENT_ID, notificationId);
    loadData();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(MOCK_AGENT_ID);
    loadData();
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(MOCK_AGENT_ID, notificationId);
    loadData();
  };

  const handleDeleteAllRead = () => {
    if (confirm('ต้องการลบการแจ้งเตือนที่อ่านแล้วทั้งหมดหรือไม่?')) {
      deleteReadNotifications(MOCK_AGENT_ID);
      loadData();
    }
  };

  return (
    <>
      <AgentHeader
        title="การแจ้งเตือน"
        subtitle="ติดตามกิจกรรมและการอัปเดตทั้งหมด"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Summary */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-surface rounded-xl border border-default p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <BellIcon />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{summary?.unreadCount || 0}</p>
                <p className="text-sm text-secondary">ยังไม่ได้อ่าน</p>
              </div>
            </div>
            
            <div className="bg-surface rounded-xl border border-default p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ClockIcon />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{summary?.todayCount || 0}</p>
                <p className="text-sm text-secondary">วันนี้</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                ทั้งหมด
              </FilterButton>
              <FilterButton
                active={filter === 'unread'}
                onClick={() => setFilter('unread')}
                badge={summary?.unreadCount}
              >
                ยังไม่อ่าน
              </FilterButton>
              <FilterButton
                active={filter === 'new_order'}
                onClick={() => setFilter('new_order')}
              >
                ออเดอร์ใหม่
              </FilterButton>
              <FilterButton
                active={filter === 'new_review'}
                onClick={() => setFilter('new_review')}
              >
                รีวิว
              </FilterButton>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {(summary?.unreadCount || 0) > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                >
                  <CheckIcon />
                  <span>อ่านทั้งหมด</span>
                </button>
              )}
              <button
                onClick={handleDeleteAllRead}
                className="flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
              >
                <TrashIcon />
                <span>ลบที่อ่านแล้ว</span>
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-surface rounded-xl border border-default p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                  <BellIcon />
                </div>
                <h3 className="font-medium text-primary mb-2">ไม่มีการแจ้งเตือน</h3>
                <p className="text-sm text-secondary">
                  {filter === 'unread' 
                    ? 'คุณอ่านการแจ้งเตือนทั้งหมดแล้ว'
                    : 'ยังไม่มีการแจ้งเตือนในหมวดหมู่นี้'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Filter Button Component
function FilterButton({
  children,
  active,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
        active
          ? 'bg-brand-primary text-white border-brand-primary'
          : 'bg-surface border-default text-secondary hover:bg-hover'
      }`}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
          active ? 'bg-white/20' : 'bg-brand-primary text-white'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// Notification Card Component
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) {
  const typeInfo = NOTIFICATION_TYPE_INFO[notification.type];
  const icon = ICON_MAP[typeInfo.icon] || <InfoIcon />;

  const content = (
    <div
      className={`bg-surface rounded-xl border border-default p-4 hover:shadow-md transition-all ${
        !notification.isRead ? 'border-l-4 border-l-brand-primary' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={`font-medium ${!notification.isRead ? 'text-primary' : 'text-secondary'}`}>
                {notification.title}
              </h4>
              <p className={`text-sm mt-0.5 ${!notification.isRead ? 'text-secondary' : 'text-gray-400 dark:text-gray-500'}`}>
                {notification.message}
              </p>
            </div>
            <span className="text-xs text-secondary whitespace-nowrap">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                className="text-xs text-brand-primary hover:underline"
              >
                ทำเครื่องหมายว่าอ่านแล้ว
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-secondary hover:text-error"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl}>
        {content}
      </Link>
    );
  }

  return content;
}

