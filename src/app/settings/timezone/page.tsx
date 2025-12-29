// src/app/settings/timezone/page.tsx
"use client";
import React from 'react';

const SettingsCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-brand-surface dark:bg-dark-surface p-6 rounded-xl shadow-md border border-brand-border dark:border-dark-border">
        <h2 className="text-xl font-bold text-brand-text-dark dark:text-dark-text-dark mb-6 pb-4 border-b border-brand-border dark:border-dark-border">{title}</h2>
        {children}
    </div>
);

const SaveButton = () => (
    <div className="flex justify-end mt-6">
        <button className="text-md font-semibold text-white bg-brand-primary dark:bg-dark-primary dark:text-brand-text-dark rounded-full px-8 py-3 hover:opacity-90 transition-opacity">
            บันทึก
        </button>
    </div>
);

export default function TimezonePage() {
    return (
        <SettingsCard title="การตั้งค่าเขตเวลา">
            <div className="max-w-md">
                 <label htmlFor="timezone" className="block text-sm font-semibold text-brand-text-dark dark:text-dark-text-dark mb-2">เขตเวลา (ปัจจุบัน: Asia/Bangkok)</label>
                 <select id="timezone" className="w-full bg-brand-bg dark:bg-dark-bg border border-brand-border dark:border-dark-border rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                    <option>Asia/Bangkok</option>
                    {/* Add other timezones here if needed */}
                 </select>
            </div>
            <SaveButton />
        </SettingsCard>
    );
}