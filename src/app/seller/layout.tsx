'use client';

import { useEffect } from 'react';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { initializeStorage } from '@/lib/storage';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      <SellerSidebar />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors relative">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors">
                <span className="text-xl">🌙</span>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

