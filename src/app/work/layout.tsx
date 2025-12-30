'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WorkerSidebar, WorkerBottomNav } from '@/components/worker/WorkerNavigation';
import { initializeStorage, setCurrentUser } from '@/lib/storage';

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initializeStorage();
    // Set current user as worker for testing
    setCurrentUser('worker-1', 'worker');
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg pb-20 lg:pb-0">
      <WorkerSidebar />
      <WorkerBottomNav />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <Link href="/work" className="lg:hidden flex items-center gap-2">
              <span className="text-xl">🐻</span>
              <span className="font-bold text-brand-text-dark">MeeLike</span>
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors relative">
                <span className="text-lg">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
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

