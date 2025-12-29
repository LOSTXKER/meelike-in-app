"use client";

import React, { useState } from 'react';
import { AgentSidebar } from './components';
import Link from 'next/link';

// Mobile sidebar component
function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
        <AgentSidebar />
      </div>
    </>
  );
}

// Mobile header for Agent Center
function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="lg:hidden bg-brand-surface dark:bg-dark-surface border-b border-brand-border dark:border-dark-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-brand-bg dark:hover:bg-dark-bg transition-colors"
        >
          <svg className="w-6 h-6 text-brand-text-dark dark:text-dark-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-brand-text-dark dark:text-dark-text-dark">Agent Center</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-xs font-medium text-brand-primary hover:underline"
        >
          กลับ MeeLike
        </Link>
      </div>
    </header>
  );
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-brand-bg dark:bg-dark-bg">
      {/* Desktop Sidebar */}
      <AgentSidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
