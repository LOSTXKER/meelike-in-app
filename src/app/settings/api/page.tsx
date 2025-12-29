// src/app/settings/api/page.tsx
"use client";
import React from 'react';

const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6 pb-4 border-b border-brand-border dark:border-dark-border">{title}</h2>
        {children}
    </div>
);

export default function ApiKeyPage() {
    const apiKey = "0919b80f75b8c9c1033baf3c9e7e1b3637fbd32c33c70f070997f9e3";
    
    return (
        <SettingsCard title="API Key">
            <div className="flex items-center bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg p-4">
                <input 
                    type="text" 
                    readOnly 
                    value={apiKey} 
                    className="flex-1 bg-transparent outline-none font-mono text-brand-text-dark dark:text-dark-text-light" 
                />
                <button onClick={() => navigator.clipboard.writeText(apiKey)} className="p-2 rounded-lg hover:bg-brand-border dark:hover:bg-dark-border">
                    <svg className="w-5 h-5 text-brand-text-light dark:text-dark-text-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.121A1.5 1.5 0 0117 6.621V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13A1.5 1.5 0 014.5 2H6a1.5 1.5 0 011 1.5v1zM8.5 2a.5.5 0 00-.5.5v1a.5.5 0 00.5.5H11a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2.5z" /></svg>
                </button>
            </div>
             <p className="text-xs text-brand-text-light dark:text-dark-text-light mt-2">รับเมื่อ: 2025-08-04 15:40:54 am</p>

            <div className="flex justify-end items-center gap-4 mt-6">
                <button className="text-md font-semibold text-brand-error hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full px-8 py-3 transition-colors">
                    เพิกถอน
                </button>
                <button className="text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-3 hover:opacity-90 transition-opacity">
                    สร้าง
                </button>
            </div>
        </SettingsCard>
    );
}