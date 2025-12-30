'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

const bottomNavItems: NavItem[] = [
  { icon: '🏠', label: 'หน้าแรก', href: '/work' },
  { icon: '👥', label: 'ทีม', href: '/work/teams' },
  { icon: '📋', label: 'งานของฉัน', href: '/work/my-jobs', badge: 3 },
  { icon: '💰', label: 'รายได้', href: '/work/earnings' },
  { icon: '👤', label: 'โปรไฟล์', href: '/work/profile' },
];

const sidebarNavItems: NavItem[] = [
  { icon: '🏠', label: 'หน้าแรก', href: '/work' },
  { icon: '👥', label: 'ทีมของฉัน', href: '/work/teams' },
  { icon: '🔍', label: 'ค้นหาทีม', href: '/work/teams/search' },
  { icon: '📋', label: 'งานของฉัน', href: '/work/my-jobs', badge: 3 },
  { icon: '💰', label: 'รายได้', href: '/work/earnings' },
  { icon: '💸', label: 'ถอนเงิน', href: '/work/withdraw' },
  { icon: '📱', label: 'บัญชี Social', href: '/work/accounts' },
  { icon: '👤', label: 'โปรไฟล์', href: '/work/profile' },
];

// Mobile Bottom Navigation
export function WorkerBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/work') return pathname === '/work';
    return pathname.startsWith(href);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border z-50 safe-area-pb">
      <div className="flex justify-around py-2">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors relative
              ${isActive(item.href)
                ? 'text-brand-primary'
                : 'text-brand-text-light'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
            {item.badge && (
              <span className="absolute top-0 right-1 w-4 h-4 bg-brand-error text-white text-[10px] rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

// Desktop Sidebar
export function WorkerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/work') return pathname === '/work';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-brand-surface border-r border-brand-border flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-brand-border">
        <Link href="/work" className="flex items-center gap-2">
          <span className="text-2xl">🐻</span>
          <span className="font-bold text-lg text-brand-text-dark">MeeLike Worker</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {sidebarNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 relative
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
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-brand-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-secondary/30 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-text-dark truncate">นุ่น</p>
            <p className="text-xs text-brand-text-light">
              🥇 Gold │ ⭐ 4.9
            </p>
            <p className="text-xs text-brand-primary font-medium">
              💰 ฿447.50
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

