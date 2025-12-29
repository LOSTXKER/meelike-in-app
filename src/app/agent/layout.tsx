// src/app/agent/layout.tsx
import React from 'react';

export default function AgentLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-brand-text-dark dark:text-dark-text-dark">
                    Agent Dashboard
                </h1>
                <p className="text-md text-brand-text-light dark:text-dark-text-light mt-1">
                    เครื่องมือสำหรับจัดการออเดอร์ของลูกค้าอย่างมีประสิทธิภาพ
                </p>
            </header>
            
            {/* เนื้อหาของแต่ละหน้าใน Agent Dashboard จะถูกแสดงผลที่นี่ */}
            <div>
                {children}
            </div>
        </main>
    );
}