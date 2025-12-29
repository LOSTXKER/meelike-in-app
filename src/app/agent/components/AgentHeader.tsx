"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Icons
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

interface AgentHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function AgentHeader({ title, subtitle, onMenuClick }: AgentHeaderProps) {
  const [notificationCount] = useState(3);

  return (
    <header className="bg-surface dark:bg-dark-surface border-b border-default px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Menu button (mobile) + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-hover transition-colors"
          >
            <MenuIcon />
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-primary">{title}</h1>
            {subtitle && (
              <p className="text-sm text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* View Store Button */}
          <Link
            href="/store/preview"
            target="_blank"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary px-3 py-2 rounded-lg hover:bg-hover transition-colors"
          >
            <span>ดูร้านค้า</span>
            <ExternalLinkIcon />
          </Link>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-hover transition-colors">
            <BellIcon />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-brand-primary">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}

