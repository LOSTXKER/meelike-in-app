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

  // Agent Center uses its own layout - render children directly
  if (isAgentRoute) {
    return (
      <div className="h-screen overflow-hidden">
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

