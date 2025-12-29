// src/app/components/Sidebar.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import to prevent hydration mismatch
const SidebarLeaderboard = dynamic(() => import('./SidebarLeaderboard'), { 
  ssr: false,
  loading: () => (
    <div className="mx-4 mb-4 p-3 bg-brand-bg dark:bg-dark-bg rounded-xl border border-brand-border dark:border-dark-border">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <span className="text-xs font-medium text-brand-text-dark dark:text-dark-text-light">Leaderboard</span>
      </div>
    </div>
  )
});

// --- Duotone Icons ---
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-5 h-5 mr-3 flex-shrink-0">{children}</div>
);

const DashboardIcon = ({ active }: { active?: boolean }) => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M4.5 13.5A.75.75 0 015.25 12h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm8.25-12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM4.5 21a3 3 0 01-3-3V6a3 3 0 013-3h15a3 3 0 013 3v12a3 3 0 01-3 3H4.5z"
            clipRule="evenodd" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"} />
      <path d="M4.5 6a3 3 0 00-3 3v1.5h18V9a3 3 0 00-3-3h-15z"
            className={active ? "text-brand-text-dark dark:text-dark-text-dark" : "text-brand-primary"} />
    </svg>
  </IconWrapper>
);
const NewOrderIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7.5a.75.75 0 01.75.75v3.75h3.75a.75.75 0 010 1.5h-3.75v3.75a.75.75 0 01-1.5 0v-3.75H8.25a.75.75 0 010-1.5h3.75V8.25a.75.75 0 01.75-.75z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
            <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zM10.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);
const CartIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.46-5.234.75.75 0 00-.674-.978H5.982l-2.09-7.832A.75.75 0 003.13 2.25H2.25z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
            <path d="M6 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17.25 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const ServicesIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.75 2.25a.75.75 0 00.75.75h3a.75.75 0 000-1.5h-3a.75.75 0 00-.75.75zM4.5 9a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3A.75.75 0 014.5 9zM4.5 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM4.5 15a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM15.75 6a.75.75 0 00.75.75h3a.75.75 0 000-1.5h-3a.75.75 0 00-.75.75zM4.5 18a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3A.75.75 0 014.5 18z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"} />
          <path fillRule="evenodd" d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 3.75zM3 7.5A.75.75 0 013.75 7.5h6.315c1.477-.923 3.219-1.5 5.085-1.5h1.35a.75.75 0 010 1.5h-1.35c-1.637 0-3.17.464-4.5 1.251V18.75a.75.75 0 01-1.5 0V7.5H3.75A.75.75 0 013 7.5z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"} />
        </svg>
    </IconWrapper>
);
const OrderHistoryIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
            <path fillRule="evenodd" d="M3.75 3.75a.75.75 0 01.75-.75h15a.75.75 0 01.75.75v15a.75.75 0 01-.75.75h-15a.75.75 0 01-.75-.75v-15zm.75 1.5v1.5h13.5v-1.5h-13.5zM5.25 9h13.5v9h-13.5v-9zM12 11.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0v-3a.75.75 0 00-.75-.75z" clipRule="evenodd" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);
const MassOrderIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M8.25 6a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM8.25 10.5a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zM8.25 15a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
            <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5a.75.75 0 000 1.5h15a.75.75 0 000-1.5V3.75a.75.75 0 000-1.5h-15zm1.5 1.5h12v15h-12v-15z" clipRule="evenodd" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);
const AddFundsIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-1.5z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
          <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v9a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-9zm15.75 1.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const DepositHistoryIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.75 3a.75.75 0 00-.75.75v16.5a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75H3.75z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
          <path d="M6.75 15.75a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const TransactionHistoryIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.25a.75.75 0 01.75.75v.54l1.153-.462a.75.75 0 11.694 1.388l-1.92 4.8a.75.75 0 01-1.341-.536l.96-2.4-1.542.617a.75.75 0 01-.5-.132l-3-2.25a.75.75 0 01.936-1.172l1.542 1.156V3a.75.75 0 01.75-.75z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);
const RefundIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
          <path d="M12.75 3a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V3zM12.75 18.75a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0v-2.25zM5.106 17.485a.75.75 0 101.06 1.061 8.226 8.226 0 0110.602-10.602.75.75 0 10-1.06-1.061 6.726 6.726 0 00-8.482 8.482z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const AffiliateIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.5 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a6 6 0 100-12 6 6 0 000 12zM10.5 10.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const RentWebsiteIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.5 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V3.75z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
            <path fillRule="evenodd" d="M3 8.25a.75.75 0 01.75-.75h16.5a.75.75 0 01.75.75v9a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-9zm1.5 0v9a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-9H4.5z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const CreateTicketIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
          <path d="M16.731 2.269a2.625 2.625 0 00-3.712 0L2.25 13.04l-1.125 4.5 4.5-1.125L16.09 5.66l-1.157-1.157L16.73 2.27z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);
const TicketHistoryIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 6.75a5.25 5.25 0 015.25 5.25c0 1.936-1.055 3.6-2.64 4.546l.16 1.605a.75.75 0 01-1.478.148l-.92-9.196a5.234 5.234 0 01-1.372 0l-.92 9.196a.75.75 0 01-1.478-.148l.16-1.605A5.25 5.25 0 0112 6.75z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25.75.75 0 01-1.5 0A6.75 6.75 0 0112 0a6.75 6.75 0 016.75 6.75.75.75 0 01-1.5 0A5.25 5.25 0 0012 1.5z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);
const TermsIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25.75.75 0 01-1.5 0A6.75 6.75 0 0112 0a6.75 6.75 0 016.75 6.75.75.75 0 01-1.5 0A5.25 5.25 0 0012 1.5z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
            <path fillRule="evenodd" d="M8.25 7.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM12 5.25a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
            <path d="M3 13.875a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
            <path d="M3 17.625a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
        </svg>
    </IconWrapper>
);

// --- *** NEW ICON FOR AGENT DASHBOARD *** ---
const BriefcaseIcon = ({ active }: { active?: boolean }) => (
    <IconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.125 19.125a3.375 3.375 0 013.375-3.375h5.25a3.375 3.375 0 013.375 3.375v1.5c0 .621-.504 1.125-1.125 1.125H4.25A1.125 1.125 0 013.125 20.625v-1.5z" className={active ? "text-brand-text-dark/80 dark:text-dark-text-light/80" : "text-brand-primary-light"}/>
            <path d="M10.5 5.25a2.625 2.625 0 10-5.25 0 2.625 2.625 0 005.25 0zM12.75 15.75a.75.75 0 00-1.5 0v2.25H9.375a.75.75 0 000 1.5h6.375a.75.75 0 000-1.5H14.25V15.75a.75.75 0 00-1.5 0z" className={active ? "text-brand-text-dark" : "text-brand-primary"}/>
        </svg>
    </IconWrapper>
);


const NavHeader = ({ title }: { title: string }) => (
    <h3 className="px-4 pt-6 pb-2 text-xs font-bold uppercase text-brand-text-light/60 dark:text-dark-text-light/60 tracking-wider">
        {title}
    </h3>
);

export default function Sidebar() {
    const pathname = usePathname();

    // Adjusted active logic to be more specific for nested routes
    const getIsActive = (href: string) => {
        // Exact match for the dashboard
        if (href === '/') {
            return pathname === '/';
        }
        // For other routes, use an exact match
        return pathname === href;
    };

    const LinkItem = ({ href, icon: Icon, label }: { href: string, icon: React.FC<{ active?: boolean }>, label: string }) => {
        const isActive = getIsActive(href);
        const linkClasses = "flex items-center px-4 py-2.5 text-sm font-medium text-brand-text-light dark:text-dark-text-light hover:bg-brand-secondary-light/50 dark:hover:bg-dark-surface rounded-lg transition-colors group";
        const activeLinkClasses = "flex items-center px-4 py-2.5 text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark bg-brand-secondary-light dark:bg-dark-surface rounded-lg transition-colors group";

        return (
            <a href={href} className={isActive ? activeLinkClasses : linkClasses}>
                <Icon active={isActive} />
                <span className={isActive ? "" : "group-hover:text-brand-text-dark dark:group-hover:text-dark-text-dark"}>{label}</span>
            </a>
        );
    };

    return (
        <aside id="sidebar" className="w-64 bg-brand-surface dark:bg-dark-bg border-r border-brand-border dark:border-dark-border flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out fixed sm:relative h-full z-20 -translate-x-full sm:translate-x-0">
            {/* Logo */}
            <div className="px-6 h-20 flex items-center">
                <img src="https://placehold.co/40x40/FCD77F/473B30?text=🐻" alt="Meelike Logo" className="h-10 w-10 rounded-full mr-3" />
                <h1 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark">Meelike-TH</h1>
            </div>

            {/* Main Content (Scrollable) */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="px-4 py-2">
                    <a href="/order" className="flex items-center justify-center w-full px-4 py-3 text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-lg hover:opacity-90 transition-opacity shadow-sm shadow-brand-primary/30 dark:shadow-dark-primary/20">
                        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a6.5 6.5 0 0112.429 2.251.75.75 0 01-1.494.15A5 5 0 005.478 5.07L4.63 2.5H1.75a.75.75 0 01-.75-.75zM2.5 7.5A.75.75 0 013.25 7h12.5a.75.75 0 010 1.5H3.25A.75.75 0 012.5 7.5zM3 11.75A.75.75 0 003.75 11h12.5a.75.75 0 000-1.5H3.75A.75.75 0 003 11.75zM4.75 14h10.5a.75.75 0 010 1.5H4.75a.75.75 0 010-1.5z" />
                        </svg>
                        สั่งซื้อใหม่
                    </a>
                </div>

                <nav className="flex-1 px-4 mt-2 space-y-1">
                    <LinkItem href="/" icon={DashboardIcon} label="แดชบอร์ด" />
                    <LinkItem href="/services" icon={ServicesIcon} label="บริการทั้งหมด" />
                    
                    <NavHeader title="สั่งซื้อ" />
                    <LinkItem href="/order" icon={NewOrderIcon} label="สั่งซื้อ" />
                    <LinkItem href="/cart" icon={CartIcon} label="ตะกร้าสินค้า" />
                    <LinkItem href="/mass-order" icon={MassOrderIcon} label="สั่งซื้อจำนวนมาก" />
                    <LinkItem href="/history" icon={OrderHistoryIcon} label="ประวัติการสั่งซื้อ" />
                    
                    {/* --- NEW AGENT SECTION --- */}
                    <NavHeader title="สำหรับตัวแทน" />
                    <LinkItem href="/agent" icon={BriefcaseIcon} label="Agent Dashboard" />

                    <NavHeader title="กระเป๋าเงิน" />
                    <LinkItem href="/add-funds" icon={AddFundsIcon} label="เติมเงิน" />
                    <LinkItem href="/history/deposits" icon={DepositHistoryIcon} label="ประวัติการเติมเงิน" />
                    <LinkItem href="/history/transactions" icon={TransactionHistoryIcon} label="ประวัติการทำรายการ" />
                    <LinkItem href="/refunds" icon={RefundIcon} label="การคืนเงิน" />

                    <NavHeader title="Affiliate" />
                    <LinkItem href="/affiliate" icon={AffiliateIcon} label="Affiliate" />

                    <NavHeader title="เช่าเว็บไซต์" />
                    <LinkItem href="/rent" icon={RentWebsiteIcon} label="เช่าเว็บปั้มไลค์" />
                    
                    <NavHeader title="การช่วยเหลือ" />
                    <LinkItem href="/tickets/create" icon={CreateTicketIcon} label="สร้างตั๋วใหม่" />
                    <LinkItem href="/tickets" icon={TicketHistoryIcon} label="ประวัติตั๋ว" />
                    <LinkItem href="/terms" icon={TermsIcon} label="เงื่อนไขและบริการ" />
                </nav>

                {/* Leaderboard Widget */}
                <SidebarLeaderboard />
            </div>
            
            <div className="p-4 border-t border-brand-border dark:border-dark-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full" src="https://placehold.co/100x100/FCD77F/473B30?text=S" alt="User Avatar" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark">Saruth</p>
                            <p className="text-xs text-brand-text-light dark:text-dark-text-light">Bronze Bear 🥉</p>
                        </div>
                    </div>
                    <button className="text-brand-text-light dark:text-dark-text-light hover:text-brand-text-dark dark:hover:text-dark-text-dark p-2 rounded-lg hover:bg-brand-bg dark:hover:bg-dark-surface">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" /><path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-1.047a.75.75 0 111.06-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L16.296 10.75H6.75A.75.75 0 016 10z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        </aside>
    );
}
