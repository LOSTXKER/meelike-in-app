"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if we're in Agent Center
  const isAgentRoute = pathname?.startsWith('/agent');
  
  // Check if we're in Public Store (customer-facing pages)
  const isPublicStoreRoute = pathname?.startsWith('/s/');

  // Agent Center uses its own layout - render children directly
  if (isAgentRoute) {
    return (
      <div className="h-screen overflow-hidden">
        {children}
      </div>
    );
  }

  // Public Store pages - no sidebar/header, full screen for customers
  if (isPublicStoreRoute) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // Default layout with Sidebar and Header
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

