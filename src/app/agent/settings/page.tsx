"use client";

import React, { useState, useEffect } from 'react';
import { AgentHeader } from '../components';
import Link from 'next/link';
import {
  getNotificationSettings,
  updateNotificationSettings,
  connectLineNotification,
  disconnectLineNotification,
} from '@/app/utils/storage/notifications';
import type { NotificationSettings, NotificationType, NotificationChannel } from '@/app/types/notification';
import { NOTIFICATION_TYPE_INFO } from '@/app/types/notification';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LinkIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MOCK_AGENT_ID = 'demo_agent';

type SettingsTab = 'profile' | 'notifications' | 'integrations' | 'billing';

const NOTIFICATION_TYPES: NotificationType[] = [
  'new_order',
  'payment_received',
  'order_completed',
  'order_failed',
  'new_review',
  'coupon_used',
  'low_balance',
  'subscription_expiring',
  'system',
];

export default function AgentSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const notifSettings = getNotificationSettings(MOCK_AGENT_ID);
    setSettings(notifSettings);
  }, []);

  const handleNotificationChannelToggle = (type: NotificationType, channel: NotificationChannel) => {
    if (!settings) return;

    const currentChannels = settings.typeSettings[type] || [];
    let newChannels: NotificationChannel[];

    if (currentChannels.includes(channel)) {
      newChannels = currentChannels.filter(c => c !== channel);
    } else {
      newChannels = [...currentChannels, channel];
    }

    const updated = updateNotificationSettings(MOCK_AGENT_ID, {
      typeSettings: {
        ...settings.typeSettings,
        [type]: newChannels,
      },
    });
    setSettings(updated);
    showSaved();
  };

  const handleQuietHoursToggle = () => {
    if (!settings) return;
    const updated = updateNotificationSettings(MOCK_AGENT_ID, {
      quietHours: {
        ...settings.quietHours,
        enabled: !settings.quietHours.enabled,
      },
    });
    setSettings(updated);
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile' as const, name: 'โปรไฟล์', icon: <UserIcon /> },
    { id: 'notifications' as const, name: 'การแจ้งเตือน', icon: <BellIcon /> },
    { id: 'integrations' as const, name: 'การเชื่อมต่อ', icon: <LinkIcon /> },
    { id: 'billing' as const, name: 'การเงิน', icon: <CreditCardIcon /> },
  ];

  return (
    <>
      <AgentHeader
        title="ตั้งค่า"
        subtitle="จัดการโปรไฟล์และการตั้งค่าต่างๆ"
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Saved Toast */}
          {saved && (
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg animate-fade-in">
              <CheckIcon />
              <span>บันทึกแล้ว</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-default overflow-x-auto pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'notifications' && settings && (
              <NotificationsSection
                settings={settings}
                onToggle={handleNotificationChannelToggle}
                onQuietHoursToggle={handleQuietHoursToggle}
              />
            )}
            {activeTab === 'integrations' && <IntegrationsSection settings={settings} />}
            {activeTab === 'billing' && <BillingSection />}
          </div>
        </div>
      </div>
    </>
  );
}

// Profile Section
function ProfileSection() {
  const [name, setName] = useState('Saruth');
  const [email, setEmail] = useState('saruth@example.com');
  const [phone, setPhone] = useState('081-234-5678');

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="font-semibold text-primary mb-4">ข้อมูลส่วนตัว</h3>
        
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-primary">S</span>
          </div>
          <div>
            <button className="text-sm text-brand-primary hover:underline">
              เปลี่ยนรูปโปรไฟล์
            </button>
            <p className="text-xs text-secondary mt-1">
              PNG, JPG ขนาดไม่เกิน 2MB
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">ชื่อ</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">เบอร์โทร</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-default bg-main text-primary focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
            บันทึกข้อมูล
          </button>
        </div>
      </div>

      {/* Agent ID */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="font-semibold text-primary mb-4">Agent ID</h3>
        <div className="flex items-center gap-2">
          <code className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
            AG-001
          </code>
          <button className="text-sm text-brand-primary hover:underline">คัดลอก</button>
        </div>
        <p className="text-xs text-secondary mt-2">
          ใช้สำหรับอ้างอิงในระบบ
        </p>
      </div>
    </div>
  );
}

// Notifications Section
function NotificationsSection({
  settings,
  onToggle,
  onQuietHoursToggle,
}: {
  settings: NotificationSettings;
  onToggle: (type: NotificationType, channel: NotificationChannel) => void;
  onQuietHoursToggle: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Quiet Hours */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-primary">ช่วงเวลาเงียบ</h3>
            <p className="text-sm text-secondary">
              ปิดการแจ้งเตือนช่วง {settings.quietHours.startTime} - {settings.quietHours.endTime}
            </p>
          </div>
          <button
            onClick={onQuietHoursToggle}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings.quietHours.enabled ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                settings.quietHours.enabled ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="font-semibold text-primary mb-4">ประเภทการแจ้งเตือน</h3>
        
        <div className="space-y-4">
          {NOTIFICATION_TYPES.map(type => {
            const info = NOTIFICATION_TYPE_INFO[type];
            const channels = settings.typeSettings[type] || [];

            return (
              <div key={type} className="flex items-center justify-between py-2 border-b border-default last:border-0">
                <div>
                  <p className="font-medium text-primary">{info.label}</p>
                  <p className="text-xs text-secondary">{info.defaultMessage}</p>
                </div>
                <div className="flex items-center gap-2">
                  <ChannelButton
                    label="App"
                    active={channels.includes('in_app')}
                    onClick={() => onToggle(type, 'in_app')}
                  />
                  <ChannelButton
                    label="LINE"
                    active={channels.includes('line')}
                    onClick={() => onToggle(type, 'line')}
                    disabled={!settings.line.connected}
                  />
                  <ChannelButton
                    label="Email"
                    active={channels.includes('email')}
                    onClick={() => onToggle(type, 'email')}
                    disabled={!settings.email.verified}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChannelButton({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 text-xs rounded transition-colors ${
        disabled
          ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 cursor-not-allowed'
          : active
          ? 'bg-brand-primary text-white'
          : 'bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

// Integrations Section
function IntegrationsSection({ settings }: { settings: NotificationSettings | null }) {
  const isLineConnected = settings?.line.connected || false;
  const isEmailVerified = settings?.email.verified || false;

  return (
    <div className="space-y-4">
      {/* LINE */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white text-xl font-bold">
              L
            </div>
            <div>
              <h4 className="font-semibold text-primary">LINE Notify</h4>
              <p className="text-sm text-secondary">
                {isLineConnected ? 'เชื่อมต่อแล้ว' : 'รับแจ้งเตือนผ่าน LINE'}
              </p>
            </div>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLineConnected
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isLineConnected ? 'ยกเลิกเชื่อมต่อ' : 'เชื่อมต่อ'}
          </button>
        </div>
        <p className="text-xs text-secondary mt-4">
          ต้องใช้แพ็คเกจ Boost ขึ้นไป
        </p>
      </div>

      {/* Email */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Email</h4>
              <p className="text-sm text-secondary">
                {isEmailVerified ? settings?.email.address : 'รับแจ้งเตือนทางอีเมล'}
              </p>
            </div>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isEmailVerified
                ? 'bg-gray-100 text-secondary hover:bg-gray-200 dark:bg-gray-800'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isEmailVerified ? 'เปลี่ยนอีเมล' : 'ตั้งค่า'}
          </button>
        </div>
        <p className="text-xs text-secondary mt-4">
          ต้องใช้แพ็คเกจ Boost+ เท่านั้น
        </p>
      </div>
    </div>
  );
}

// Billing Section
function BillingSection() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 rounded-xl border border-amber-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-bold bg-amber-500 text-white rounded-lg">
              Boost
            </span>
            <span className="text-sm text-secondary">ทดลองใช้ 14 วัน</span>
          </div>
          <span className="text-2xl font-bold text-primary">฿149/เดือน</span>
        </div>
        <p className="text-sm text-secondary mb-4">
          เหลือ 5 วัน - หมดอายุ 5 ม.ค. 2568
        </p>
        <div className="flex gap-3">
          <Link
            href="/subscription"
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors text-sm font-medium"
          >
            อัปเกรดแพ็คเกจ
          </Link>
          <button className="px-4 py-2 border border-default rounded-lg text-secondary hover:bg-hover transition-colors text-sm">
            ประวัติการชำระเงิน
          </button>
        </div>
      </div>

      {/* Quick Comparison */}
      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="font-semibold text-primary mb-4">เปรียบเทียบแพ็คเกจ</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg border border-default">
            <p className="font-medium text-primary">Free</p>
            <p className="text-2xl font-bold text-primary mt-1">฿0</p>
            <p className="text-xs text-secondary">จำกัด 50 บิล/เดือน</p>
          </div>
          <div className="p-4 rounded-lg border-2 border-brand-primary bg-brand-primary/5">
            <p className="font-medium text-brand-primary">Boost</p>
            <p className="text-2xl font-bold text-brand-primary mt-1">฿149</p>
            <p className="text-xs text-secondary">300 บิล + LINE</p>
          </div>
          <div className="p-4 rounded-lg border border-default">
            <p className="font-medium text-primary">Boost+</p>
            <p className="text-2xl font-bold text-primary mt-1">฿399</p>
            <p className="text-xs text-secondary">ไม่จำกัด + ทุกฟีเจอร์</p>
          </div>
        </div>
        <Link
          href="/subscription"
          className="block text-center text-sm text-brand-primary font-medium hover:underline mt-4"
        >
          ดูรายละเอียดเพิ่มเติม
        </Link>
      </div>
    </div>
  );
}

