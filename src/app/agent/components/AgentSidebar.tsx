"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const BillIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClientsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PromotionIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/agent', icon: <DashboardIcon /> },
  { name: 'บิล/ออเดอร์', href: '/agent/orders', icon: <BillIcon /> },
  { name: 'ลูกค้า', href: '/agent/clients', icon: <ClientsIcon /> },
  { name: 'ร้านค้า', href: '/agent/store', icon: <StoreIcon /> },
  { name: 'โปรโมชั่น', href: '/agent/promotions', icon: <PromotionIcon /> },
  { name: 'สถิติ', href: '/agent/analytics', icon: <AnalyticsIcon /> },
  { name: 'ตั้งค่า', href: '/agent/settings', icon: <SettingsIcon /> },
];

export default function AgentSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/agent') {
      return pathname === '/agent';
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="w-64 bg-brand-surface dark:bg-dark-surface border-r border-brand-border dark:border-dark-border flex-shrink-0 hidden lg:flex lg:flex-col h-full">
      {/* Header with Back Button */}
      <div className="p-4 border-b border-brand-border dark:border-dark-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-brand-text-light dark:text-dark-text-light hover:text-brand-text-dark dark:hover:text-dark-text-dark mb-4 transition-colors group"
        >
          <BackIcon />
          <span className="text-sm font-medium group-hover:underline">กลับ MeeLike</span>
        </Link>
        <div>
          <h2 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">Agent Center</h2>
          <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-0.5">จัดการร้านค้าและลูกค้า</p>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4">
        <Link
          href="/agent/orders/new"
          className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
        >
          <PlusIcon />
          <span>สร้างบิลใหม่</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(item.href)
                    ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary'
                    : 'text-brand-text-light dark:text-dark-text-light hover:bg-brand-bg dark:hover:bg-dark-bg hover:text-brand-text-dark dark:hover:text-dark-text-dark'
                  }
                `}
              >
                <span className={isActive(item.href) ? 'text-brand-primary' : ''}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-brand-error text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subscription Info */}
      <div className="p-4 border-t border-brand-border dark:border-dark-border">
        <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
              Boost
            </span>
            <span className="text-xs text-brand-text-light dark:text-dark-text-light">ทดลองใช้</span>
          </div>
          <p className="text-xs text-brand-text-light dark:text-dark-text-light">เหลือ 5 วัน</p>
          <Link
            href="/subscription"
            className="text-xs font-medium text-brand-primary hover:underline mt-2 inline-block"
          >
            อัปเกรดแพ็คเกจ
          </Link>
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-t border-brand-border dark:border-dark-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-primary">S</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">Saruth</p>
            <p className="text-xs text-brand-text-light dark:text-dark-text-light">Agent ID: AG-001</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
