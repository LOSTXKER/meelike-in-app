'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
  children?: { label: string; href: string; badge?: number }[];
}

const navItems: NavItem[] = [
  { icon: '📊', label: 'แดชบอร์ด', href: '/seller' },
  {
    icon: '🏪',
    label: 'ร้านค้า',
    href: '/seller/store',
    children: [
      { label: 'ตั้งค่าร้าน', href: '/seller/store' },
      { label: 'จัดการบริการ', href: '/seller/services' },
      { label: 'ออเดอร์', href: '/seller/orders' },
    ],
  },
  {
    icon: '👥',
    label: 'ทีมงาน',
    href: '/seller/team',
    children: [
      { label: 'สมาชิก', href: '/seller/team/members' },
      { label: 'งานทั้งหมด', href: '/seller/team/jobs' },
      { label: 'รอตรวจสอบ', href: '/seller/team/review', badge: 5 },
      { label: 'จ่ายเงิน', href: '/seller/team/payouts' },
    ],
  },
  {
    icon: '💰',
    label: 'การเงิน',
    href: '/seller/wallet',
    children: [
      { label: 'ยอดเงิน', href: '/seller/wallet' },
      { label: 'เติมเงิน', href: '/seller/wallet/deposit' },
      { label: 'ประวัติ', href: '/seller/wallet/history' },
    ],
  },
  { icon: '🏪', label: 'Marketplace', href: '/seller/marketplace' },
  {
    icon: '⚙️',
    label: 'ตั้งค่า',
    href: '/seller/settings',
    children: [
      { label: 'โปรไฟล์', href: '/seller/settings' },
      { label: 'Subscription', href: '/seller/settings/subscription' },
      { label: 'API Keys', href: '/seller/settings/api' },
    ],
  },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['ร้านค้า', 'ทีมงาน']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.href));
    }
    return false;
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-brand-border">
        <Link href="/seller" className="flex items-center gap-2">
          <span className="text-2xl">🐻</span>
          <span className="font-bold text-lg text-brand-text-dark">MeeLike Seller</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => (
          <div key={item.label} className="mb-1">
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                    ${isParentActive(item)
                      ? 'bg-brand-primary/10 text-brand-primary font-medium'
                      : 'text-brand-text-light hover:bg-brand-primary/5 hover:text-brand-text-dark'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span
                    className={`transition-transform ${
                      expandedItems.includes(item.label) ? 'rotate-90' : ''
                    }`}
                  >
                    ›
                  </span>
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="ml-8 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                          ${isActive(child.href)
                            ? 'bg-brand-primary/15 text-brand-primary font-medium'
                            : 'text-brand-text-light hover:bg-brand-primary/5 hover:text-brand-text-dark'
                          }
                        `}
                      >
                        <span>{child.label}</span>
                        {child.badge && (
                          <span className="px-1.5 py-0.5 bg-brand-error text-white text-xs rounded-full">
                            {child.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                  ${isActive(item.href)
                    ? 'bg-brand-primary/10 text-brand-primary font-medium'
                    : 'text-brand-text-light hover:bg-brand-primary/5 hover:text-brand-text-dark'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 bg-brand-error text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-text-dark truncate">JohnBoost</p>
            <p className="text-xs text-brand-text-light">
              💎 Pro │ ฿2,450
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-brand-surface border border-brand-border shadow-md"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed left-0 top-0 h-full w-64 z-50
          bg-brand-surface border-r border-brand-border
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-brand-surface border-r border-brand-border flex-col">
        <NavContent />
      </aside>
    </>
  );
}

